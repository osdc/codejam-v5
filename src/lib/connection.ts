import mongoose from "mongoose";

export const connectToDb = async () => {
  const connUrl = process.env.MONGO_CONNECTION_URL as string;
  try {
    await mongoose.connect(connUrl);
  } catch (e: unknown) {
    if (e instanceof Error) throw new Error(e.message);
    else throw new Error("An unknown error occurred");
  }
};
