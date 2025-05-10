import { Document } from "mongoose";
import { UserModel } from "../db/users";

export type UserType = Document<unknown, {}, typeof UserModel> & {
  _id: any;
  email: string;
  username: string;
  authentication?: {
    password?: string;
    salt?: string;
    sessionToken?: string;
  };
};
