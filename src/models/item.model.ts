import mongoose, { Schema, model } from "mongoose";

interface IItem {
  name: string;
  description?: string;
  founderName: string;
  founderNumber: number;
  founderEmail: string;
  foundAddress: string;
}

const itemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    founderName: {
      type: String,
      required: true,
    },
    founderNumber: {
      type: Number,
      required: true,
    },
    founderEmail: {
      type: String,
      required: true,
    },
    foundAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Item = mongoose.models.Item || model<IItem>("Item", itemSchema);
