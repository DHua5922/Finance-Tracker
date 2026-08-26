import { deleteAllUserTransactionsDal } from "@/features/profile";
import { inngest } from "./client";

export const deleteUserTransactions = inngest.createFunction(
  { id: "delete-user-transactions", triggers: { event: "app/user.deleted" } },
  async ({ event, step, logger }) => {
    const userId = event.data.userId;
    const loggerPayload = {
      userId,
    };

    logger.info(
      `Delete all the user's transactions for user ${userId}`,
      loggerPayload,
    );

    const result = await step.run("delete-all-user-transactions", async () => {
      const result = await deleteAllUserTransactionsDal(userId);

      if (!result.success) throw new Error(result.errorMessage);

      return {
        userId,
        deletedCount: result.data.deleted_count,
      };
    });

    logger.info(`Successfully deleted all transactions for user ${userId}`, {
      ...loggerPayload,
      deletedCount: result.deletedCount,
    });
  },
);
