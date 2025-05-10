import { UserModel } from "../db/users";

const getUsers = async () => {
  const users = await UserModel.find();
  return users;
};

const getUserByEmail = (email: string, selectFields?: string) => {
  return UserModel.findOne({ email }).select(selectFields || "");
};

const getUserBySessionToken = async (sessionToken: string) => {
  const user = await UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
  return user;
};

const getUserById = async (id: string) => {
  const user = await UserModel.findById(id);
  return user;
};

const createUser = async (values: Record<string, any>) => {
  const user = new UserModel(values);
  const savedUser = await user.save();
  return savedUser.toObject();
};

const deleteUserById = async (id: string) => {
  return await UserModel.findOneAndDelete({ _id: id });
};

const updateUserById = async (id: string, values: Record<string, any>) => {
  return await UserModel.findByIdAndUpdate(id, values);
};

export {
  getUsers,
  getUserByEmail,
  getUserBySessionToken,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
};
