import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/database";
import { parseDatabaseErrorMessage } from "@/shared/utilities";

const dalResultSchema = z.object({
  id: z.coerce.number(),
  transaction_type: z.literal("income").or(z.literal("expense")),
  name: z.string(),
  description: z.coerce.string(),
  amount: z.coerce.number(),
  transaction_date: z.coerce.date(),
  trx_freq_id: z.coerce.number().nullable(),
});

type DeletedTransaction = z.infer<typeof dalResultSchema>;
type MutationResult =
  | { success: true; data: DeletedTransaction }
  | { success: false; data: null; errorMessage: string };

export async function deleteTransactionDal(
  id: number,
  userId: string,
): Promise<MutationResult> {
  const transactionId = z.number().int().positive().parse(id);
  const validatedUserId = z.string().trim().min(1).parse(userId);

  try {
    const result = await db.execute(
      sql`SELECT * FROM delete_transaction(${transactionId}, ${validatedUserId})`,
    );

    return {
      success: true,
      data: dalResultSchema.parse(result[0]),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errorMessage: parseDatabaseErrorMessage(
        error,
        "Cannot delete transaction.",
      ),
    };
  }
}
