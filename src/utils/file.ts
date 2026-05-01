import { fileTypeFromBuffer } from "file-type";

export const imageValidator = (buffer: Buffer) => {
  const fileInfo = fileTypeFromBuffer(buffer);
  console.log(fileInfo);
}