import express from "express";

import {
  deleteUserById,
  getUserById,
  getUsers,
} from "../services/user.services";

const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal server error" });
    return;
  }
};

const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    const deletedUser = await deleteUserById(id);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ deletedUser, message: "User deleted successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal server error" });
    return;
  }
};

const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ message: "Invalid username" });
      return;
    }
    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.username = username;
    await user.save();

    res.status(200).json({ user, message: "User updated successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal server error" });
    return;
  }
};

export { getAllUsers, deleteUser, updateUser };
