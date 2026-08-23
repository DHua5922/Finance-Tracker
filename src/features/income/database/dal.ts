import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/database/config";
import { parseDatabaseErrorMessage } from "@/shared/utilities/database";

const incomeSchema = z
  .object({
    id: z.coerce.number(),
    name: z.string(),
    description: z.string(),
    amount: z.coerce.number(),
    income_date: z.coerce.date(),
  })
  .transform(({ id, name, description, amount, income_date }) => ({
    id,
    name,
    description,
    amount,
    incomeDate: income_date,
  }));

export type Income = z.infer<typeof incomeSchema>;

type IncomeResult =
  | { success: true; data: Income[] }
  | { success: false; data: null; errorMessage: string };

export async function getIncomeDal(userId: string): Promise<IncomeResult> {
  try {
    const result = await db.execute(
      sql`SELECT * FROM get_user_income(${userId})`,
    );

    return {
      success: true,
      data: z.array(incomeSchema).parse(result),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errorMessage: parseDatabaseErrorMessage(
        error,
        "Your income data is temporarily unavailable.",
      ),
    };
  }
}
