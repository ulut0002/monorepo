// src/models/User.ts
import { Schema, model } from "mongoose";
import { IUserDb } from "../types/user.types";

const userSchema = new Schema<IUserDb>(
  {
    username: { type: String, unique: true, sparse: true }, // only for local
    name: { type: String },
    email: { type: String, unique: true, sparse: true },

    // For local strategy
    password: { type: String },

    // For OAuth strategies
    facebookId: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    linkedinId: { type: String, unique: true, sparse: true },

    // Optional: provider-specific info
    profilePicture: { type: String },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUserDb>("User", userSchema);
export default UserModel;
