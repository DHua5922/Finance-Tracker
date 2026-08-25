"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuthenticatedUser } from "@/features/auth/lib/session";
import { deleteTransactionDal } from "../dal/delete-trx.dal";

export interface DeleteTransactionActionState {
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
}

export async function deleteTransactionAction(
  _previousState: DeleteTransactionActionState,
  formData: FormData,
): Promise<DeleteTransactionActionState> {
  const result = z.coerce
    .number()
    .int()
    .positive()
    .safeParse(formData.get("id"));

  if (!result.success) {
    return {
      isError: true,
      isSuccess: false,
      errorMessage: "This transaction record is invalid.",
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

  const deleteResult = await deleteTransactionDal(result.data, user._id);

  if (!deleteResult.success) {
    return {
      isError: true,
      isSuccess: false,
      errorMessage: deleteResult.errorMessage,
    };
  }

  revalidatePath("/transaction");
  revalidatePath("/dashboard");
  return { isError: false, isSuccess: true, errorMessage: "" };
}
