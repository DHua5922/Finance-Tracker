import { z } from "zod";

export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  accessTokenExpirationTime: z.string(),
  refreshTokenExpirationTime: z.string(),
});

export const logInUserFormDataSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signUpUserFormDataSchema = z
  .object({
    username: z.string().min(1, {
      message: "Username is required",
    }),
    email: z.email({
      message: "Invalid email address",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
