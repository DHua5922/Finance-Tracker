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

export interface UpsertIncomeParams {
  id: number;
  userId: string;
  name: string;
  description: string;
  amount: number;
  incomeDate: Date;
}
type UpsertIncomeResult =
  | { success: true; data: Income }
  | { success: false; data: null; errorMessage: string };

export async function upsertIncomeDal(
  upsertInputParams: UpsertIncomeParams,
): Promise<UpsertIncomeResult> {
  const upsertParams = z
    .object({
      id: z.number(),
      userId: z.string(),
      name: z.string().min(1, { message: "Name is required" }),
      description: z.string(),
      amount: z.number(),
      incomeDate: z.date().transform((date) => date.toISOString()),
    })
    .parse(upsertInputParams);

  try {
    const result = await db.execute(
      sql`SELECT * FROM upsert_user_income(
        ${upsertParams.id},
        ${upsertParams.userId},
        ${upsertParams.name},
        ${upsertParams.description},
        ${upsertParams.amount},
        ${upsertParams.incomeDate}
      )`,
    );

    return {
      success: true,
      data: incomeSchema.parse(result[0]),
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
