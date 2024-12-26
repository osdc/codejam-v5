import { connectToDb } from "@/lib/connection";
import { Item } from "@/models/item.model";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export const GET = async (request: Request) => {
  try {
    connectToDb();
    const allItems = await Item.find({});
    return NextResponse.json(allItems);
  } catch (error) {
    console.log(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const body = Object.fromEntries(formData.entries());
    console.log(body);
    if (image) {
      const data: { url: string } = (await uploadImage(image)) as {
        url: string;
      };
      body.image = data.url as string;
    }
    console.log(body);

    connectToDb();
    const newItem = await Item.create(body);
    return NextResponse.json({
      message: "all good",
      newItem,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong!",
      status: 500,
    });
  }
};
