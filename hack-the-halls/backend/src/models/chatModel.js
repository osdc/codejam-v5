import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
