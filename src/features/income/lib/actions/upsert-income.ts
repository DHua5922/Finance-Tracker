"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuthenticatedUser } from "@/features/auth/lib/session";
import { upsertIncomeDal } from "../../database/dal";

const upsertIncomeFormDataSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  name: z.string().trim().min(1, "Enter an income name").max(100),
  description: z.string().trim().max(500),
  amount: z.coerce.number().positive("Enter an amount greater than zero"),
  incomeDate: z.coerce.date({ error: "Enter a valid date" }),
});
type UpsertIncomeFormData = keyof z.infer<typeof upsertIncomeFormDataSchema>;

export interface UpsertIncomeActionState {
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
  fieldErrors: Partial<Record<UpsertIncomeFormData, string[]>>;
}

export async function upsertIncomeAction(
  _previousState: UpsertIncomeActionState,
  formData: FormData,
): Promise<UpsertIncomeActionState> {
  const result = upsertIncomeFormDataSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    incomeDate: formData.get("incomeDate"),
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

  const upsertResult = await upsertIncomeDal({
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

  revalidatePath("/income");
  revalidatePath("/dashboard");

  return {
    isError: false,
    isSuccess: true,
    errorMessage: "",
    fieldErrors: {},
  };
}
