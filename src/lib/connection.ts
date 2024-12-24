import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL);
  } catch (e: unknown) {
    if (e instanceof Error) throw new Error(e.message);
    else throw new Error("An unknown error occurred");
  }
};
