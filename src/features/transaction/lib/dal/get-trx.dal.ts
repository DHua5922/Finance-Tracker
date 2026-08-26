import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/database";
import { parseDatabaseErrorMessage } from "@/shared/utilities";

interface QueryParams {
  userId: string;
  name: string;
  description: string;
  transactionFrequencyId: number | null;
  transactionType: "income" | "expense" | null;
}

const transactionDateSchema = z.preprocess(
  (value) =>
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00.000Z`
      : value,
  z.coerce.date(),
);

const transactionDalResultSchema = z
  .object({
    id: z.coerce.number(),
    transaction_type: z.literal("income").or(z.literal("expense")),
    name: z.string(),
    description: z
      .string()
      .nullable()
      .transform((desc) => desc || ""),
    amount: z.coerce.number(),
    unit_amount: z.coerce.number().nullable(),
    transaction_date: transactionDateSchema,
    trx_freq_id: z.coerce.number().nullable(),
    transaction_frequency_name: z.string(),
  })
  .transform(
    ({
      transaction_type,
      transaction_date,
      trx_freq_id,
      transaction_frequency_name,
      unit_amount,
      amount,
      ...transaction
    }) => ({
      ...transaction,
      transactionType: transaction_type,
      transactionDate: transaction_date,
      transactionFrequencyId: trx_freq_id,
      transactionFrequencyName: transaction_frequency_name,
      unitAmount: unit_amount,
      monthlyAmount: amount,
    }),
  );

export type Transaction = z.infer<typeof transactionDalResultSchema>;
type TransactionResult =
  | { success: true; data: Transaction[] }
  | { success: false; data: null; errorMessage: string };

export async function getTransactionsDal(
  queryParams: QueryParams,
): Promise<TransactionResult> {
  const validatedQueryParams = z
    .object({
      userId: z.string().trim().min(1),
      name: z.string().trim(),
      description: z.string(),
      transactionFrequencyId: z.number().int().positive().nullable(),
      transactionType: z.literal("income").or(z.literal("expense")).nullable(),
    })
    .parse(queryParams);

  try {
    const result = await db.execute(
      sql`SELECT * FROM get_user_transactions(
        ${validatedQueryParams.userId},
        ${validatedQueryParams.name},
        ${validatedQueryParams.description},
        ${validatedQueryParams.transactionFrequencyId},
        ${validatedQueryParams.transactionType}
      )`,
    );

    return {
      success: true,
      data: z.array(transactionDalResultSchema).parse(result),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errorMessage: parseDatabaseErrorMessage(
        error,
        "Your transaction data is temporarily unavailable.",
      ),
    };
  }
}
