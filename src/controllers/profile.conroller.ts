import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { pool } from "../db/connection";
import { imageValidator } from "../utils/file";
import { optimizeImage, blurHashGenerator } from "../utils/image";
import { deleteFileFromS3, uploadFileToS3 } from "../services/s3/upload";

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
      return;
    }
    const userId = await getOrCreateUser();
    const isImage = imageValidator(req.file?.buffer!);
    if (!isImage) {
      return res.status(400).json({
        error: "Not a Real Image",
      });
    }
    const [optimizedImageBuffer, blurHashString] = await Promise.all([
      optimizeImage(req.file!.buffer),
      blurHashGenerator(req.file!.buffer),
    ]);
    console.log("uploading file to s3...");
    const key = await uploadFileToS3(
      optimizedImageBuffer,
      req.file!.originalname,
      "image/webp",
    );

    const user = await pool.query(`SELECT * FROM users LIMIT 1`);
    if (user.rows[0].public_id) {
      await deleteFileFromS3(user.rows[0].public_id);
    }

    await pool.query(
      `
        UPDATE users
        SET public_id=$1,
            blur_hashed_string=$2,
            updated_at= NOW()
        WHERE id=$3
      `,
      [key, blurHashString, userId],
    );
    res.status(200).json({
      message: "File Uploaded Successfully",
      fileKey: key,
    });
  },
);
