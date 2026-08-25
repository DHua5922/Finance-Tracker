import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/database/config.database";
import { parseDatabaseErrorMessage } from "@/shared/utilities/database.utilities";

const deleteResponseSchema = z.object({
  success: z.coerce.boolean(),
  deleted_count: z.coerce.number(),
});

type DeleteResult = z.infer<typeof deleteResponseSchema>;
type DeleteAllUserTransactionsResult =
  | { success: true; data: DeleteResult }
  | { success: false; data: null; errorMessage: string };

export async function deleteAllUserTransactionsDal(
  userId: string,
): Promise<DeleteAllUserTransactionsResult> {
  try {
    const validatedUserId = z.string().trim().min(1).parse(userId);

    const result = await db.execute(
      sql`SELECT * FROM delete_all_user_transactions(${validatedUserId})`,
    );

    return {
      success: true,
      data: deleteResponseSchema.parse(result[0]),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errorMessage: parseDatabaseErrorMessage(
        error,
        "Cannot delete the user's transactions.",
      ),
    };
  }
}
