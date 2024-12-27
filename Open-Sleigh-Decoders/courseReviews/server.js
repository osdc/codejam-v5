const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/course_comments', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  parent: { type: Number, required: true },
  id: { type: Number, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
  user: {
    image: {
      png: String,
      webp: String
    },
    username: String
  },
  replies: [{
    parent: Number,
    id: Number,
    content: String,
    createdAt: { type: Date, default: Date.now },
    score: Number,
    user: {
      image: {
        png: String,
        webp: String
      },
      username: String
    },
    replyingTo: String
  }]
});

const Comment = mongoose.model('Comment', commentSchema);

app.use(cors());
app.use(express.json());

// Get comments for a course
app.get('/api/comments/:courseId', async (req, res) => {
  try {
    const comments = await Comment.find({ courseId: req.params.courseId });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Add new comment
app.post('/api/comments', async (req, res) => {
  try {
    console.log('Received comment data:', req.body);

    const { courseId, comment } = req.body;

    if (!courseId || !comment) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: { courseId, comment } 
      });
    }

    if (comment.parent === 0) {
      // For top-level comments
      const lastComment = await Comment.findOne({ courseId })
        .sort({ id: -1 });
      
      const newId = lastComment ? lastComment.id + 1 : 1;
      
      const newComment = new Comment({
        courseId,
        parent: 0,
        id: newId,
        content: comment.content,
        createdAt: new Date(),
        score: 0,
        user: comment.user,
        replies: []
      });

      await newComment.save();
      console.log('Saved new comment:', newComment);
      
      return res.status(201).json(newComment);
    } else {
      // For replies
      const parentComment = await Comment.findOne({ 
        courseId, 
        id: comment.parent 
      });

      if (!parentComment) {
        return res.status(404).json({ 
          error: 'Parent comment not found' 
        });
      }

      const newReplyId = parentComment.replies.length + 1;
      const newReply = {
        parent: comment.parent,
        id: newReplyId,
        content: comment.content,
        createdAt: new Date(),
        score: 0,
        user: comment.user,
        replyingTo: comment.replyingTo
      };

      parentComment.replies.push(newReply);
      await parentComment.save();
      console.log('Saved new reply:', newReply);
      
      return res.status(201).json(newReply);
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      error: 'Error adding comment',
      details: error.message 
    });
  }
});

// Delete comment
app.delete('/api/comments/:courseId/:commentId', async (req, res) => {
  try {
    const { courseId, commentId } = req.params;
    const { parentId } = req.query;
    
    if (!parentId) {
      // Delete top-level comment
      await Comment.deleteOne({ 
        courseId, 
        id: parseInt(commentId) 
      });
    } else {
      // Delete reply
      const parentComment = await Comment.findOne({ 
        courseId, 
        id: parseInt(parentId) 
      });
      
      if (!parentComment) {
        return res.status(404).json({ 
          error: 'Parent comment not found' 
        });
      }

      parentComment.replies = parentComment.replies.filter(
        reply => reply.id !== parseInt(commentId)
      );
      await parentComment.save();
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      error: 'Error deleting comment',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});