import { INewUserModel, UserModel } from "@monorepo/shared";

/**
 * Finds a user document by their username.
 * @param username - The username to look up.
 * @returns A promise resolving to the user document or null.
 */
const findUserByUsername = async (username: string) => {
  return await UserModel.findOne({ username });
};

/**
 * Finds a user by their MongoDB ObjectId.
 * @param userId - The user's unique ObjectId.
 * @returns A promise resolving to the user document or null.
 */
const findUserById = async (userId: string) => {
  return await UserModel.findById({ _id: userId });
};

/**
 * Checks for an existing user using either a username or email.
 * Useful during registration to avoid duplicate accounts.
 * @param username - Optional username to check.
 * @param email - Optional email to check.
 * @returns The user if found, otherwise null.
 */
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

/**
 * Creates and saves a new local user in the database.
 * Password should be hashed before passing into this function.
 * @param newUser - New user data object (already validated and hashed).
 * @returns The newly created user document.
 */
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
