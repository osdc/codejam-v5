import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chatModel.js";

export const getChat = AsyncHandler(async (req, res) => {
  console.log("******** getChat Function ********");
  const user = req.user;
  const lectureId = req.body.lectureId;

  console.log("lectureId: ", lectureId);
  const chat = await Chat.find({ userId: user._id, lectureId })
    .sort({ createdAt: -1 })
    .limit(10);

  console.log("chat", chat);

  if (!chat) {
    await Chat.create({
      userId: user._id,
      lectureId,
      messages: [],
    });
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          chat: [],
        },
        "Chat fetched successfully"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        chat,
      },
      "Chat fetched successfully"
    )
  );
});

export const deleteChat = AsyncHandler(async (req, res) => {
  console.log("******** deleteChat Function ********");
  const user = req.user;
  const lectureId = req.body.lectureId;

  console.log("lectureId: ", lectureId);
  const chat = await Chat.findOneAndDelete({ userId: user._id, lectureId });

  console.log("chat", chat);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deleted successfully"));
});
