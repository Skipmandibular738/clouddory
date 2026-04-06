import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export const DEMO_SPEND_CAP = 10000; // $10K/month

export interface SpendCapResult {
  withinLimit: boolean;
  currentSpend: number;
  cap: number;
  message?: string;
}

/**
 * Check if an org's REAL (non-demo) spend for the current month
 * exceeds the demo tier spend cap.
 */
export async function checkSpendCap(orgId: string): Promise<SpendCapResult> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Sum only real spend — exclude demo records
  const result = await prisma.costRecord.aggregate({
    where: {
      orgId,
      source: { not: "demo" },
      date: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
    _sum: {
      cost: true,
    },
  });

  const currentSpend = result._sum.cost
    ? Number(result._sum.cost)
    : 0;

  if (currentSpend > DEMO_SPEND_CAP) {
    return {
      withinLimit: false,
      currentSpend: Math.round(currentSpend * 100) / 100,
      cap: DEMO_SPEND_CAP,
      message: `Your cloud spend ($${Math.round(currentSpend).toLocaleString()}/month) exceeds the free tier limit of $${DEMO_SPEND_CAP.toLocaleString()}. Please self-host CloudDory for unlimited usage.`,
    };
  }

  return {
    withinLimit: true,
    currentSpend: Math.round(currentSpend * 100) / 100,
    cap: DEMO_SPEND_CAP,
  };
}
