import mongoose from "mongoose";

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: createId,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
