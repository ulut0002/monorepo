import { Document } from "mongoose";

interface IWebNewUserModel {
  username?: string; // Optional for OAuth users
  email?: string; // Optional for OAuth users
  password: string; // Required for local auth, ignored for OAuth
}

/**
 * This interface defines the shape of a user object when being created (e.g., during registration).
 * Fields like OAuth IDs are optional, as users may sign up through different providers.
 */
interface INewUserModel {
  username?: string; // Optional for OAuth users
  name?: string; // User's full name
  email?: string; // Optional for OAuth users
  password: string; // Required for local auth, ignored for OAuth
  facebookId?: string; // Facebook OAuth ID
  googleId?: string; // Google OAuth ID
  githubId?: string; // GitHub OAuth ID
  linkedinId?: string; // LinkedIn OAuth ID
  profilePicture?: string; // Optional: URL to user's avatar/profile image
}

/**
 * This extends INewUserModel and Mongoose's Document.
 * It represents a complete user object as stored in MongoDB.
 */
interface IUserDb extends INewUserModel, Document {
  lastLogin?: Date; // Timestamp of last successful login
}

export type { IWebNewUserModel, INewUserModel, IUserDb };
