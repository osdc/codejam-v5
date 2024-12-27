import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Chat } from "../models/chatModel.js";
import pinecone from "../config/pinecone.js";
import GeminiModel from "../config/gemini.js";
import { createGeminiPrompt } from "../utils/gemini.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const askAi = AsyncHandler(async (req, res, next) => {
  console.log("******** askAi Function ********");
  const { prompt, lectureId, token } = req.query;

  // Verify token
  let decodedToken;

  if (token.charAt(0) === '"' && token.charAt(token.length - 1) === '"')
    token = token.slice(1, -1);

  console.log("token", token);
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log("error", error);
  }

  console.log("decodedToken", decodedToken);

  const user = await User.findById(decodedToken?._id).select("-password");

  if (!user) {
    throw new ApiError(401, "Invalid JWT Token");
  }

  req.user = user;

  if (!prompt || !lectureId) {
    return next(new ApiError(400, "Prompt and lectureId are required"));
  }

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    let chat = await Chat.find({ userId: req.user._id, lectureId }).limit(5);

    if (chat.length === 0) {
      chat = await Chat.create({
        userId: req.user._id,
        lectureId,
        messages: [],
      });
      chat = [chat];
    }

    chat = chat[0];
    const initialMessage = {
      type: "user",
      message: prompt,
    };

    // Store initial user message
    chat.messages.push(initialMessage);

    // Get Pinecone embeddings
    const index = pinecone.index("testing");
    const embedding = await pinecone.inference.embed(
      "multilingual-e5-large",
      [prompt],
      {
        inputType: "query",
      }
    );

    const queryResponse = await index.namespace("example-namespace").query({
      topK: 3,
      vector: embedding[0].values,
      includeValues: false,
      includeMetadata: true,
      filter: {
        lectureId: { $eq: lectureId },
      },
    });

    console.log("Pinecone Query Response:", queryResponse);

    // Prepare the prompt
    const recentMessages = chat.messages.map((msg) => msg.message).join("\n");
    const fullPrompt = createGeminiPrompt(
      recentMessages,
      prompt,
      queryResponse.matches[0].metadata.text
    );

    console.log("Full Prompt:", fullPrompt);

    // Generate streaming response
    const response = await GeminiModel.generateContentStream(fullPrompt);

    console.log(response);

    let completeResponse = "";

    // Stream the response
    for await (const chunk of response.stream) {
      console.log("Chunk:", chunk);
      const chunkText = chunk.text(); // Ensure you're using the correct method to get the text
      completeResponse += chunkText;

      // Send chunk to client
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    // Save the complete response to database
    chat.messages.push({
      type: "ai",
      message: completeResponse,
    });
    await chat.save();

    // Send done event
    res.write("event: done\ndata: {}\n\n");
    res.end();
  } catch (error) {
    console.error("Streaming Error:", error);
    // Send error event to client
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`
    );
    res.end();
  }
});
