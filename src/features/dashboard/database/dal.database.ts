import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/database/config.database";
import { parseDatabaseErrorMessage } from "@/shared/utilities/database.utilities";

const dashboardStatsSchema = z.object({
  expenses_count: z.coerce.number(),
  total_expenses_amount: z.coerce.number(),
  income_count: z.coerce.number(),
  total_income_amount: z.coerce.number(),
  net_savings: z.coerce.number(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

type DashboardStatsResult =
  | { success: true; data: DashboardStats }
  | { success: false; data: null; errorMessage: string };

export async function getDashboardStatsDal(
  userId: string,
  frequencyId: number,
): Promise<DashboardStatsResult> {
  try {
    const result = await db.execute(
      sql`SELECT * FROM get_dashboard_stats(${userId}, ${frequencyId})`,
    );

    return {
      success: true,
      data: dashboardStatsSchema.parse(result[0]),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errorMessage: parseDatabaseErrorMessage(
        error,
        "Your dashboard data is temporarily unavailable.",
      ),
    };
  }
}
