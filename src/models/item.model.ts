import mongoose, { Schema, model } from "mongoose";

export interface IItem {
  _id: string;
  name: string;
  description?: string;
  contactInformation: string;
  location: string;
  category: "lost" | "found";
  campus: 62 | 128;
  date: Date;
  image?: string;
}

const itemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    contactInformation: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["lost", "found"],
    },
    campus: {
      type: Number,
      enum: [62, 128],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Item = mongoose.models.Item || model<IItem>("Item", itemSchema);
