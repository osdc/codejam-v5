import { connectToDb } from "@/lib/connection";
import { Item } from "@/models/item.model";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

import multer from "multer";
import { storage, uploadImage } from "@/lib/cloudinary";

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false, // Disable body parser to allow multer to parse the request
  },
};

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
  const image = formData.get("image") as unknown as File;
  const data = await uploadImage(image);
  return NextResponse.json(
    {
      message: data,
    },
    { status: 200 }
  );
};
