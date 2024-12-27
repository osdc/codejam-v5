import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
