import { z } from "zod";

export const updateUserProfileSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  email: z.email({ message: "Invalid email address" }),
});
