import { connectToDb } from "@/lib/connection";
import { Item } from "@/models/item.model";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    connectToDb();
    const allItems = await Item.find({});
    return NextResponse.json(allItems);
  } catch (error) {
    console.log(error);
  }
};
