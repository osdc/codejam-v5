import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
    {
        notes: {
                type: String,
                required: true,
        },
        lectureId: {
                type: Schema.Types.ObjectId,
                ref: 'Lecture',
                required: true,
        },
        userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
        }
    },
    { timestamps: true }
);





export const Note = mongoose.model("Note", noteSchema);
