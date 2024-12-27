import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";
import { generateJWTToken } from "../utils/GenerateJWT.js";

export const registerUser = AsyncHandler(async (req, res) => {
  console.log("******** registerUser Function ********");
  const { name, email, password, batch, branch } = req.body;

  if (!name || !email || !password || !batch || !branch) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@mail\.jiit\.ac\.in$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Email must be a valid @mail.jiit.ac.in address");
  }

  const newUser = await User.create({ name, email, password, batch, branch });
  if (!newUser) {
    throw new ApiError(500, "Failed to create User");
  }

  const jwtToken = generateJWTToken(newUser._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        batch: newUser.batch,
        branch: newUser.branch,
        token: jwtToken,
      },
      "User Sign in successfull"
    )
  );
});

export const loginUser = AsyncHandler(async (req, res) => {
  console.log("******** loginUser Function ********");
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const jwtToken = generateJWTToken(user._id);

  const checkPassword = await user.matchPassword(password);
  if (checkPassword) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: jwtToken,
        },
        "User logged in successfully"
      )
    );
  }

  throw new ApiError(401, "Invalid email or password");
});
