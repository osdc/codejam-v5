import mongoose from "mongoose";

export const connectToDb = async () => {
  const connUrl = process.env.MONGO_CONNECTION_URL;

  if (!connUrl) {
    throw new Error(
      "MONGO_CONNECTION_URL is not defined in the environment variables."
    );
  }

  try {
    await mongoose.connect(connUrl, {});
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB.");
  }
};
