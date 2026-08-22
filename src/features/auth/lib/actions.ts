"use server";

import { buildAuthApiUrl } from "./config";
import {
  createFetchInstance,
  parseFetchErrorMessage,
} from "@/shared/utilities/api";
import { signUpUserFormDataSchema } from "../schemas";
import { z } from "zod";
import { AUTH_API_ROUTES, AUTH_API_BACKEND_BASE_URL } from "./constants";


const userSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.email(),
});

const authBackendFetch = createFetchInstance({
  defaultBaseUrl: AUTH_API_BACKEND_BASE_URL,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
});

export async function signUpUserAction(values: unknown) {
  const payload = signUpUserFormDataSchema.parse(values);
  const response = await authBackendFetch(
    buildAuthApiUrl(AUTH_API_ROUTES.register),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(await parseFetchErrorMessage(response));
  }

  return userSchema.parse(await response.json());
}
