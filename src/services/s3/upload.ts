import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../config/awsConfig";
import { randomUUID } from "crypto";

export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
) => {
  try {
    const key = `uploads/${randomUUID()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET!,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });
    await s3Client.send(command);
    return key;
  } catch (e) {
    console.log(e);
  }
};

export const deleteFileFromS3 = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.STORAGE_BUCKET!,
      Key: key,
    });
    await s3Client.send(command);
  } catch (e) {
    console.log(e);
  }
};
