import { z } from "zod";

export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  accessTokenExpireTime: z.string(),
  refreshTokenExpireTime: z.string(),
});

export const logInUserFormDataSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const passwordResetEmailSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export const resetPasswordFormDataSchema = z
  .object({
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
