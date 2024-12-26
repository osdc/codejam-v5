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
  const formData = await req.formData();
  const image = formData.get("image") as File;
  const body = Object.fromEntries(formData.entries());
  if (image) {
    const data: { url: string } = (await uploadImage(image)) as { url: string };
    body.image = data.url as string;
  }
  try {
    connectToDb();
    const newItem = await Item.create(body);
    return NextResponse.json(
      {
        message: "all good",
        newItem,
      },
      { status: 200 }
    );
  } catch (error) {
    throw new Error("Some error occurred while creating document.");
  }
};