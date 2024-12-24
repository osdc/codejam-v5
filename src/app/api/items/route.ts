import { connectToDb } from "@/lib/connection";
import { Item } from "@/models/item.model";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    connectToDb();
    const allItems = await Item.find({});
    return NextResponse.json(allItems);
  } catch (error) {
    console.log(error);
  }
};

export const POST = async (request: Request) => {
  try {
    console.log("reached post request");
    const body = await request.json();
    connectToDb();
    console.log(body);
    const newItem = await Item.create(body);
    return NextResponse.json(newItem);
  } catch (e) {
    console.log(e);
  }
};
