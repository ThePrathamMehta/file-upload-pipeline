import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { pool } from "../db/connection";
import { imageValidator } from "../utils/file";

const getOrCreateUser = async () => {
  const existingUser = await pool.query(`SELECT * FROM users LIMIT 1`);
  if (existingUser.rows.length > 0) return existingUser.rows[0].id;
  const newUser = await pool.query(
    `INSERT INTO users (email,name)
     VALUES ($1,$2)
     RETURNING *
    `,
    ["user@gmail.com", "user"],
  );
  return newUser.rows[0].id;
};

export const uploadPicture = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).json({ error: "No Image Provided" });
    }
    const userId = await getOrCreateUser();
    console.log(userId);
    imageValidator(req.file?.buffer!);
  },
);
