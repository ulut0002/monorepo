import { User } from "@/packages/shared/src/types";
import { NextFunction, Request, Response } from "express";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = {
    id: "1",
    name: "Jim",
    email: "mike@example.com",
  };
  res.status(200).json({ status: "ok", user });
};

export { getUser };
