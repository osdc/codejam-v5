import { connectToDb } from "@/lib/connection";
import { Item } from "@/models/item.model";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;
  try {
    connectToDb();
    const item = await Item.findById(id);
    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
  }
};
