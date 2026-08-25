"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuthenticatedUser } from "@/shared/session/session";
import { upsertTransactionDal } from "../dal/upsert-trx.dal";

const upsertTransactionFormDataSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  transactionType: z.literal("income").or(z.literal("expense")),
  name: z.string().trim().min(1, "Enter a transaction name"),
  description: z.preprocess(
    (description) => description ?? "",
    z.string().trim(),
  ),
  amount: z.coerce.number().positive("Enter an amount greater than zero"),
  transactionDate: z.coerce.date({ error: "Enter a valid date" }),
  transactionFrequencyId: z.coerce.number().int().positive(),
});
type UpsertTransactionFormData = keyof z.infer<
  typeof upsertTransactionFormDataSchema
>;

export interface UpsertTransactionActionState {
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
  fieldErrors: Partial<Record<UpsertTransactionFormData, string[]>>;
}

export async function upsertTransactionAction(
  _previousState: UpsertTransactionActionState,
  formData: FormData,
): Promise<UpsertTransactionActionState> {
  const result = upsertTransactionFormDataSchema.safeParse({
    id: formData.get("id"),
    transactionType: formData.get("transactionType"),
    name: formData.get("name"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    transactionDate: formData.get("transactionDate"),
    transactionFrequencyId: formData.get("transactionFrequencyId"),
  });

  if (!result.success) {
    return {
      isError: true,
      isSuccess: false,
      errorMessage: "Please correct the errors below",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      isError: true,
      isSuccess: false,
      errorMessage: "Your session has expired. Please log in again.",
      fieldErrors: {},
    };
  }

  const upsertResult = await upsertTransactionDal({
    ...result.data,
    userId: user._id,
  });

  if (!upsertResult.success) {
    return {
      isError: true,
      isSuccess: false,
      errorMessage: upsertResult.errorMessage,
      fieldErrors: {},
    };
  }

  revalidatePath("/transaction");
  revalidatePath("/dashboard");

  return {
    isError: false,
    isSuccess: true,
    errorMessage: "",
    fieldErrors: {},
  };
}
