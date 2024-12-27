import { connectToDb } from "@/lib/connection";
import { Item } from "@/models/item.model";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export const GET = async () => {
  try {
    await connectToDb();
    const allItems = await Item.find({});
    console.log("Successfully fetched items:", allItems.length);
    return NextResponse.json(allItems);
  } catch (error) {
    console.error("Error in GET /api/items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDb(); // Add await here
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const body = Object.fromEntries(formData.entries());

    if (image) {
      const data: { url: string } = (await uploadImage(image)) as {
        url: string;
      };
      body.image = data.url as string;
    }

    const newItem = await Item.create(body);
    return NextResponse.json({
      message: "Item created successfully",
      newItem,
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST /api/items:", error);
    return NextResponse.json({
      message: "Failed to create item",
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    });
  }
};
