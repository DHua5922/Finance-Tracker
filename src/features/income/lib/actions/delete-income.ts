"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuthenticatedUser } from "@/features/auth/lib/session";
import { deleteIncomeDal } from "../../database/dal";

export interface DeleteIncomeActionState {
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
}

export async function deleteIncomeAction(
  _previousState: DeleteIncomeActionState,
  formData: FormData,
): Promise<DeleteIncomeActionState> {
  const result = z.coerce
    .number()
    .int()
    .positive()
    .safeParse(formData.get("id"));

  if (!result.success) {
    return {
      isError: true,
      isSuccess: false,
      errorMessage: "This income record is invalid.",
    };
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      isError: true,
      isSuccess: false,
      errorMessage: "Your session has expired. Please log in again.",
    };
  }

  const deleteResult = await deleteIncomeDal(result.data);

  if (!deleteResult.success) {
    return {
      isError: true,
      isSuccess: false,
      errorMessage: deleteResult.errorMessage,
    };
  }

  revalidatePath("/income");
  revalidatePath("/dashboard");
  return { isError: false, isSuccess: true, errorMessage: "" };
}
