import UserModel from "@shared/models/user.model";
import { INewUserModel } from "@shared/types/user.types";

const findUserByUsername = async (username: string) => {
  return await UserModel.findOne({ username });
};

const findUserById = async (userId: string) => {
  return await UserModel.findById({ _id: userId });
};

const findExistingUserByUsernameOrEmail = async (
  username?: string,
  email?: string
) => {
  const orConditions = [];
  if (username) orConditions.push({ username });
  if (email) orConditions.push({ email });

  if (orConditions.length === 0) {
    return null;
  }

  return await UserModel.findOne({ $or: orConditions });
};

const createLocalUser = async (newUser: INewUserModel) => {
  const user = new UserModel(newUser);
  return await user.save();
};

export {
  findUserByUsername,
  findExistingUserByUsernameOrEmail,
  createLocalUser,
  findUserById,
};
