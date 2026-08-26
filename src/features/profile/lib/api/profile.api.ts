import type { z } from "zod";
import { API_BACKEND_BASE_URL } from "@/shared/constants";
import { createFetchInstance, throwIfResponseFailed } from "@/shared/utilities";
import type { updateUserProfileSchema } from "../../schemas";

type UpdateUserInput = z.infer<typeof updateUserProfileSchema>;

interface UserRequest {
  userId: string;
  accessToken: string;
}

const PROFILE_API_ROUTES = {
  user: (userId: string) => `/api/v1/users/${userId}`,
} as const;

export async function updateUserApi(
  { userId, accessToken }: UserRequest,
  input: UpdateUserInput,
) {
  const response = await createProfileApiFetch(accessToken)(
    PROFILE_API_ROUTES.user(userId),
    { method: "PUT", body: JSON.stringify(input) },
  );

  await throwIfResponseFailed(response);
}

export async function deleteUserApi({ userId, accessToken }: UserRequest) {
  const response = await createProfileApiFetch(accessToken)(
    PROFILE_API_ROUTES.user(userId),
    { method: "DELETE" },
  );

  await throwIfResponseFailed(response);
  return response;
}

function createProfileApiFetch(accessToken: string) {
  return createFetchInstance({
    defaultBaseUrl: API_BACKEND_BASE_URL,
    defaultHeaders: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
