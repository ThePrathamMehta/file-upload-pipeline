import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload";
import { profilePictureSchema } from "../schemas/schema";
import { validateSchema } from "../middlewares/validate";
import { uploadPicture } from "../controllers/profile.conroller";

const router = Router();

router.post(
  "/profile-picture",
  uploadMiddleware.single("profile-picture"),
  validateSchema(profilePictureSchema),
  uploadPicture,
);

export default router;
