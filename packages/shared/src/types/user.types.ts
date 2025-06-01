import { Document } from "mongoose";

interface INewUserModel {
  username?: string;
  name?: string;
  email?: string;
  password: string; // Optional for OAuth users
  facebookId?: string; // Optional for Facebook OAuth
  googleId?: string; // Optional for Google OAuth
  githubId?: string; // Optional for GitHub OAuth
  linkedinId?: string; // Optional for LinkedIn OAuth
  profilePicture?: string; // Optional profile picture URL
}

interface IUserDb extends INewUserModel, Document {
  lastLogin?: Date;
}

export { INewUserModel, IUserDb };
