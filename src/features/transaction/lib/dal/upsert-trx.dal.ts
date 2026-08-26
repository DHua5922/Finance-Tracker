import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/database";
import { parseDatabaseErrorMessage } from "@/shared/utilities";

interface UpsertTransactionParams {
  id: number;
  userId: string;
  transactionType: string;
  name: string;
  description: string;
  amount: number;
  transactionDate: Date;
  transactionFrequencyId: number;
}

const dalResultSchema = z.object({
  id: z.coerce.number(),
  transaction_type: z.literal("income").or(z.literal("expense")),
  name: z.string(),
  description: z.coerce.string(),
  amount: z.coerce.number(),
  transaction_date: z.coerce.date(),
  trx_freq_id: z.coerce.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

type UpsertedTransaction = z.infer<typeof dalResultSchema>;
type MutationResult =
  | { success: true; data: UpsertedTransaction }
  | { success: false; data: null; errorMessage: string };

export async function upsertTransactionDal(
  upsertInputParams: UpsertTransactionParams,
): Promise<MutationResult> {
  const validatedUpsertParams = z
    .object({
      id: z.number(),
      userId: z.string(),
      transactionType: z.literal("income").or(z.literal("expense")),
      name: z.string().min(1),
      description: z.string().trim(),
      amount: z.number().positive(),
      transactionDate: z.date().transform((date) => date.toISOString()),
      transactionFrequencyId: z.number().int().positive().min(1),
    })
    .parse(upsertInputParams);

  try {
    const result = await db.execute(
      sql`SELECT * FROM upsert_user_transaction(
        ${validatedUpsertParams.id},
        ${validatedUpsertParams.userId},
        ${validatedUpsertParams.transactionType},
        ${validatedUpsertParams.name},
        ${validatedUpsertParams.description},
        ${validatedUpsertParams.amount},
        ${validatedUpsertParams.transactionDate}::timestamptz::date,
        ${validatedUpsertParams.transactionFrequencyId}
      )`,
    );

    return {
      success: true,
      data: dalResultSchema.parse(result[0]),
    };
  } catch (error) {
    console.error("Error in upsertTransactionDal:", error);
    return {
      success: false,
      data: null,
      errorMessage: parseDatabaseErrorMessage(
        error,
        validatedUpsertParams.id
          ? "Cannot update transaction."
          : "Cannot create transaction.",
      ),
    };
  }
}
