"use server";

import { redirect } from "next/navigation";
import { clearUserSession } from "@/shared/session/session";

export async function logOutAction() {
  await clearUserSession();
  redirect("/");
}
