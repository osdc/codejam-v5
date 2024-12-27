const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/codejam", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(cors());
app.use(express.json());

const commentSchema = new mongoose.Schema({
  parent: Number,
  id: Number,
  content: String,
  createdAt: String,
  score: Number,
  user: {
    image: {
      png: String,
      webp: String,
    },
    username: String,
  },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Comment = mongoose.model("Comment", commentSchema);

app.post("/add-comment", async (req, res) => {
  try {
    const newComment = new Comment(req.body.comment);
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

app.get("/comments/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const comments = await Comment.find({ parent: 0 }).populate("replies"); // Get top-level comments and populate replies
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
