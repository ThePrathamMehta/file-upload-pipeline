import z from "zod";

export const profilePictureSchema = z.object({
  body: z.object({
    imageType: z.enum(["profile", "cover"]).default("profile"),
  }),
});
