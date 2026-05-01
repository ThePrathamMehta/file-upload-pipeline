import sharp from "sharp";
import {encode} from "blurhash";

export const optimizeImage = async (buffer: Buffer) => {
  return await sharp(buffer)
    .resize({
      width: 800,
    })
    .webp({ quality: 80 })
    .toBuffer();
};

export const blurHashGenerator = async (buffer: Buffer) => {
  const { data, info } = await sharp(buffer)
    .resize({ width: 32, height: 32, fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3);
};
