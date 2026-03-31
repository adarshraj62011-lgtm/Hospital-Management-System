import mongoose from "mongoose";

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

const userSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    nic: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Doctor", "Patient"],
    },
    doctorDepartment: {
      type: String,
      default: null,
    },
    docAvatar: {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
