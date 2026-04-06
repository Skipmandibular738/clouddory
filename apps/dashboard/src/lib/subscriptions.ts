// All modules are free in the open source version

export type ModuleKey = "finops" | "security" | "intelligence" | "automation";

export const MODULES: Record<ModuleKey, { name: string }> = {
  finops: { name: "FinOps & Cost Optimization" },
  security: { name: "Cloud Security" },
  intelligence: { name: "Threat Intelligence" },
  automation: { name: "Security Automation" },
};

export const PRICING_MODEL = {
  minimum: 0,
  description: "Free and open source",
};

// Always returns all modules as active — no subscription checks
export async function getOrgSubscriptions(_orgId: string) {
  return (Object.keys(MODULES) as ModuleKey[]).map((mod) => ({
    module: mod,
    status: "active" as const,
    plan: "free" as const,
    trialEndsAt: null as Date | null,
    expiresAt: null as Date | null,
  }));
}

export function hasModuleAccess(_orgId: string, _module: ModuleKey): boolean {
  return true;
}
