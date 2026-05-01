import { fileTypeFromBuffer } from "file-type";

export const imageValidator = async (buffer: Buffer) => {
  const fileInfo = await fileTypeFromBuffer(buffer);
  if (!fileInfo) {
    return false;
  }
  return fileInfo.mime.startsWith("image/");
};
