"use server";

import { redirect } from "next/navigation";
import { accessTokenName, refreshTokenName } from "../session";
import { cookies } from "next/dist/server/request/cookies";

export async function logOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(accessTokenName);
  cookieStore.delete(refreshTokenName);

  redirect("/");
}
