import { z } from "zod";
import { API_BACKEND_BASE_URL } from "../constants/api.constants";
import {
  createFetchInstance,
  throwIfResponseFailed,
} from "../utilities/api.utilities";

export const userSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.email(),
});

const USERS_API_ROUTES = {
  me: "/api/v1/users/me",
} as const;

export async function getMeApi(accessToken: string) {
  const response = await createUsersApiFetch(accessToken)(USERS_API_ROUTES.me, {
    method: "GET",
  });

  await throwIfResponseFailed(response);
  return userSchema.parse(await response.json());
}

function createUsersApiFetch(accessToken: string) {
  return createFetchInstance({
    defaultBaseUrl: API_BACKEND_BASE_URL,
    defaultHeaders: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
