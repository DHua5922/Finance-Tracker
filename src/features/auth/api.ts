import { z } from "zod";
import type { signUpUserFormDataSchema } from "./schemas";

const userSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.email(),
});
type User = z.infer<typeof userSchema>;

type SignUpUserFormData = z.infer<typeof signUpUserFormDataSchema>;

export async function signUpUserApi(data: SignUpUserFormData): Promise<User> {
  const response = await fetch(
    `${process.env.AUTH_API_BACKEND_BASE_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to register user");
  }

  return userSchema.parse(await response.json());
}
