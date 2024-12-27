import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()
const mongoURL = process.env.mongoURL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Set timeout to avoid indefinite hanging
});

const db = mongoose.connection;

db.on("connected", () => {
    console.log("Connected to MongoDB Server");
});

db.on("error", (err) => {
    console.error("Connection error:", err.message); // Log specific error message
});

db.on("disconnected", () => {
    console.log("Disconnected from MongoDB Server");
});

export default db;
