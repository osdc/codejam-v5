import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const validateToken = AsyncHandler(async (req, res, next) => {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    console.log("Before decoded token", process.env.JWT_SECRET);
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

    next();
  } catch (error) {
    // Handle token verification errors
    throw new ApiError(401, error?.message || "Invalid JWT Token");
  }
});
