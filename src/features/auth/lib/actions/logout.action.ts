"use server";

import { redirect } from "next/navigation";
import { clearUserSession } from "../session";

export async function logOutAction() {
  await clearUserSession();
  redirect("/");
}
