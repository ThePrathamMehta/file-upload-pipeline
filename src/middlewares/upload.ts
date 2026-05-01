import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeValid =
    file.mimetype.startsWith("image/") ||
    ALLOWED_MIMETYPES.includes(file.mimetype);
  const extValid = ALLOWED_EXTENSIONS.includes(ext);

  console.log({ mimetype: file.mimetype, ext, mimeValid, extValid });

  if (mimeValid && extValid) {
    cb(null, true);
  } else {
    cb(new Error("INVALID_FILE_TYPE"));
  }
};
export const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
