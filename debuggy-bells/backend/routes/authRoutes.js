import express from "express";
import User from "./../models/userModels.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const router = express.Router();
// POST - Create a new user
router.post("/", async (req, res) => {
  try {
      const { name, email, password, expenseScore = 0 } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user object
      const newUser = new User({
          name,
          email,
          password:hashedPassword,
          expenseScore, // Defaulted to 0 if not provided
      });

      const response = await newUser.save();
      console.log("User created successfully");
      res.status(200).json(response);
  } catch (err) {
      console.error("Error creating user:", err);
      res.status(400).json({ error: err.message });
  }
});


// GET - Read all users
router.get("/", async (req, res) => {
    try {
        const data = await User.find();
        console.log("Data fetched");
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});


//sign in

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Wrong Password",
        });
      }
  
  
      const token = jwt.sign(
        {
          Email: user.email,
          name: user.name,
          expenseScore: user.expenseScore
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
  
    
      res.cookie("token", token, {
        secure: true,
        httpOnly: false,
      });
  
      res.status(201).json({
        success: true,
        message: "Successfully Logged in",
        token,
        result: user,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
  
  //get a specific user by email
  router.get("/user", async (req, res) => {
    const userEmail = req.query.userEmail;
  
    try {
      const users = await User.findOne({ email: userEmail });
  
      if (!users || users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      console.log({users})
  
      res.status(200).json({
        success: true,
        result: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
  

export default router;
