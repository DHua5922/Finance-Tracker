import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/database/config";
import { parseDatabaseErrorMessage } from "@/shared/utilities/database";

const transactionFrequencySchema = z
  .object({
    id: z.coerce.number(),
    name: z.string(),
    description: z.string(),
    to_monthly_multiplier: z.coerce.number().nullable(),
  })
  .transform(({ to_monthly_multiplier, ...frequency }) => ({
    ...frequency,
    toMonthlyMultiplier: to_monthly_multiplier,
  }));

export type TransactionFrequency = z.infer<typeof transactionFrequencySchema>;
export type TransactionFrequenciesResult =
  | { success: true; data: TransactionFrequency[] }
  | { success: false; data: null; errorMessage: string };

export async function getTransactionFrequenciesDal(): Promise<TransactionFrequenciesResult> {
  try {
    const result = await db.execute(
      sql`SELECT * FROM get_transaction_frequencies()`,
    );

    return {
      success: true,
      data: z.array(transactionFrequencySchema).parse(result),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errorMessage: parseDatabaseErrorMessage(
        error,
        "Transaction frequency data is temporarily unavailable.",
      ),
    };
  }
}
