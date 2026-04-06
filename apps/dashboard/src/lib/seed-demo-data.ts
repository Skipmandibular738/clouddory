import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Seeds realistic demo data for a new organization.
 * All cost records are tagged with source='demo' so they can be
 * identified and cleaned up when real cloud accounts are connected.
 */
export async function seedDemoDataForOrg(orgId: string): Promise<void> {
  const now = new Date();

  // ── Teams & Environments ──────────────────────────────────
  const teams = ["Platform", "Product", "Data Science", "Security", "Infrastructure"];
  const environments = ["production", "staging", "development", "sandbox"];
  const regions = ["us-east-1", "us-west-2", "eu-west-1"];

  // ── Service definitions with monthly cost ranges ──────────
  const services: {
    provider: string;
    service: string;
    source: string;
    monthlyMin: number;
    monthlyMax: number;
  }[] = [
    // AWS
    { provider: "aws", service: "Amazon Elastic Compute Cloud - Compute", source: "demo", monthlyMin: 1200, monthlyMax: 1800 },
    { provider: "aws", service: "Amazon Relational Database Service", source: "demo", monthlyMin: 800, monthlyMax: 1200 },
    { provider: "aws", service: "Amazon Simple Storage Service", source: "demo", monthlyMin: 200, monthlyMax: 400 },
    { provider: "aws", service: "AWS Lambda", source: "demo", monthlyMin: 100, monthlyMax: 250 },
    { provider: "aws", service: "Amazon Elastic Kubernetes Service", source: "demo", monthlyMin: 600, monthlyMax: 900 },
    { provider: "aws", service: "Amazon CloudFront", source: "demo", monthlyMin: 150, monthlyMax: 300 },
    { provider: "aws", service: "Amazon DynamoDB", source: "demo", monthlyMin: 100, monthlyMax: 200 },
    { provider: "aws", service: "Amazon Route 53", source: "demo", monthlyMin: 10, monthlyMax: 30 },
    // GCP
    { provider: "gcp", service: "Compute Engine", source: "demo", monthlyMin: 500, monthlyMax: 800 },
    { provider: "gcp", service: "BigQuery", source: "demo", monthlyMin: 300, monthlyMax: 500 },
    { provider: "gcp", service: "Cloud Storage", source: "demo", monthlyMin: 100, monthlyMax: 200 },
    // Azure
    { provider: "azure", service: "Virtual Machines", source: "demo", monthlyMin: 400, monthlyMax: 700 },
    { provider: "azure", service: "SQL Database", source: "demo", monthlyMin: 200, monthlyMax: 400 },
    { provider: "azure", service: "Blob Storage", source: "demo", monthlyMin: 80, monthlyMax: 150 },
  ];

  // ── Generate 90 days of cost records ──────────────────────
  const costRecords: {
    orgId: string;
    date: Date;
    service: string;
    region: string;
    cost: Decimal;
    currency: string;
    source: string;
    team: string;
    environment: string;
    tags: object;
  }[] = [];

  for (let dayOffset = 89; dayOffset >= 0; dayOffset--) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);

    for (const svc of services) {
      // Daily cost = monthly range / 30, with +-20% random noise
      const dailyBase = (svc.monthlyMin + Math.random() * (svc.monthlyMax - svc.monthlyMin)) / 30;
      const noise = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const dailyCost = Math.max(0.01, dailyBase * noise);

      const team = teams[Math.floor(Math.random() * teams.length)];
      const env = environments[Math.floor(Math.random() * environments.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];

      costRecords.push({
        orgId,
        date,
        service: svc.service,
        region,
        cost: new Decimal(dailyCost.toFixed(4)),
        currency: "USD",
        source: "demo",
        team,
        environment: env,
        tags: { provider: svc.provider, demo: true },
      });
    }
  }

  // ── Batch insert cost records (chunks of 100) ─────────────
  const chunkSize = 100;
  for (let i = 0; i < costRecords.length; i += chunkSize) {
    await prisma.costRecord.createMany({
      data: costRecords.slice(i, i + chunkSize),
    });
  }

  // ── Waste scan results ────────────────────────────────────
  await prisma.wasteScanResult.createMany({
    data: [
      {
        orgId,
        scanType: "idle_resources",
        resourceId: "i-0a1b2c3d4e5f67890",
        provider: "aws",
        service: "Amazon Elastic Compute Cloud - Compute",
        region: "us-east-1",
        monthlyWasteCost: new Decimal("156.00"),
        recommendation: "EC2 instance i-0a1b2c3d has averaged <2% CPU utilization over the past 14 days. Consider stopping or downsizing to a t3.small.",
        severity: "high",
        status: "open",
      },
      {
        orgId,
        scanType: "oversized_instances",
        resourceId: "db-prod-analytics-01",
        provider: "aws",
        service: "Amazon Relational Database Service",
        region: "us-east-1",
        monthlyWasteCost: new Decimal("320.00"),
        recommendation: "RDS instance db-prod-analytics-01 (db.r5.2xlarge) is using only 15% of allocated memory. Downsize to db.r5.xlarge to save ~$320/month.",
        severity: "high",
        status: "open",
      },
      {
        orgId,
        scanType: "orphaned_storage",
        resourceId: "vol-0abc123def456789a",
        provider: "aws",
        service: "Amazon Elastic Block Store",
        region: "us-west-2",
        monthlyWasteCost: new Decimal("45.00"),
        recommendation: "Unattached EBS volume vol-0abc123d (500GB gp3) has been orphaned for 30+ days. Delete or snapshot and remove.",
        severity: "medium",
        status: "open",
      },
      {
        orgId,
        scanType: "idle_resources",
        resourceId: "nat-0def456abc789012b",
        provider: "aws",
        service: "Amazon VPC",
        region: "eu-west-1",
        monthlyWasteCost: new Decimal("95.00"),
        recommendation: "NAT Gateway nat-0def456a in eu-west-1 processes <1GB/day. Consider replacing with a NAT instance or VPC endpoints.",
        severity: "medium",
        status: "open",
      },
      {
        orgId,
        scanType: "idle_resources",
        resourceId: "eip-alloc-0123456789abcdef0",
        provider: "aws",
        service: "Amazon Elastic Compute Cloud - Compute",
        region: "us-east-1",
        monthlyWasteCost: new Decimal("3.60"),
        recommendation: "Elastic IP eip-alloc-01234 is not associated with any running instance. Release it to avoid idle charges.",
        severity: "low",
        status: "open",
      },
    ],
  });

  // ── Anomalies ─────────────────────────────────────────────
  await prisma.anomaly.createMany({
    data: [
      {
        orgId,
        resourceId: "lambda-data-pipeline-prod",
        provider: "aws",
        service: "AWS Lambda",
        team: "Data Science",
        region: "us-east-1",
        expectedCost: new Decimal("45.00"),
        actualCost: new Decimal("312.00"),
        deviationPct: new Decimal("593.33"),
        severity: "high",
        status: "open",
        detectedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        orgId,
        resourceId: "cloudfront-dist-E1ABC234DEF",
        provider: "aws",
        service: "Amazon CloudFront",
        team: "Product",
        region: "us-east-1",
        expectedCost: new Decimal("180.00"),
        actualCost: new Decimal("340.00"),
        deviationPct: new Decimal("88.89"),
        severity: "medium",
        status: "open",
        detectedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        orgId,
        resourceId: "gcs-bucket-staging-logs",
        provider: "gcp",
        service: "Cloud Storage",
        team: "Platform",
        region: "us-east-1",
        expectedCost: new Decimal("25.00"),
        actualCost: new Decimal("38.00"),
        deviationPct: new Decimal("52.00"),
        severity: "low",
        status: "open",
        detectedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // ── AiTags with rules ─────────────────────────────────────
  const teamTag = await prisma.aiTag.create({
    data: {
      orgId,
      name: "Team",
      description: "Automatically assigns team ownership based on resource tags and naming conventions.",
      tagType: "ai_powered",
      defaultValue: "Unallocated",
      isActive: true,
      priority: 1,
    },
  });

  const envTag = await prisma.aiTag.create({
    data: {
      orgId,
      name: "Environment",
      description: "Classifies resources into production, staging, development, or sandbox.",
      tagType: "ai_powered",
      defaultValue: "Unknown",
      isActive: true,
      priority: 2,
    },
  });

  const appTag = await prisma.aiTag.create({
    data: {
      orgId,
      name: "Application",
      description: "Maps resources to business applications based on tags and naming patterns.",
      tagType: "custom",
      defaultValue: "Untagged",
      isActive: true,
      priority: 3,
    },
  });

  // Team tag rules
  await prisma.aiTagRule.create({
    data: {
      aiTagId: teamTag.id,
      valueName: "Platform",
      priority: 10,
      conditions: {
        create: [
          { dimension: "tag_value", operator: "contains", value: "platform", logicOp: "AND" },
        ],
      },
    },
  });
  await prisma.aiTagRule.create({
    data: {
      aiTagId: teamTag.id,
      valueName: "Data Science",
      priority: 9,
      conditions: {
        create: [
          { dimension: "service", operator: "contains", value: "bigquery", logicOp: "AND" },
        ],
      },
    },
  });

  // Environment tag rules
  await prisma.aiTagRule.create({
    data: {
      aiTagId: envTag.id,
      valueName: "production",
      priority: 10,
      conditions: {
        create: [
          { dimension: "resource_name", operator: "contains", value: "prod", logicOp: "AND" },
        ],
      },
    },
  });

  // Application tag rules
  await prisma.aiTagRule.create({
    data: {
      aiTagId: appTag.id,
      valueName: "Data Pipeline",
      priority: 10,
      conditions: {
        create: [
          { dimension: "tag_value", operator: "contains", value: "pipeline", logicOp: "AND" },
        ],
      },
    },
  });

  // ── Commitments (RIs and Savings Plans) ───────────────────
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const twoYearsFromNow = new Date(now);
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixMonthsFromNow = new Date(now);
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  await prisma.commitment.createMany({
    data: [
      {
        orgId,
        provider: "aws",
        commitmentType: "ri",
        service: "Amazon Elastic Compute Cloud - Compute",
        region: "us-east-1",
        term: "1yr",
        startDate: oneYearAgo,
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        totalCost: new Decimal("8760.00"),
        usedCost: new Decimal("7884.00"),
        coveragePct: new Decimal("90.00"),
      },
      {
        orgId,
        provider: "aws",
        commitmentType: "savings_plan",
        service: "Compute",
        region: null,
        term: "1yr",
        startDate: sixMonthsAgo,
        endDate: sixMonthsFromNow,
        totalCost: new Decimal("12000.00"),
        usedCost: new Decimal("9600.00"),
        coveragePct: new Decimal("80.00"),
      },
      {
        orgId,
        provider: "aws",
        commitmentType: "ri",
        service: "Amazon Relational Database Service",
        region: "us-east-1",
        term: "3yr",
        startDate: oneYearAgo,
        endDate: twoYearsFromNow,
        totalCost: new Decimal("18000.00"),
        usedCost: new Decimal("16200.00"),
        coveragePct: new Decimal("90.00"),
      },
      {
        orgId,
        provider: "gcp",
        commitmentType: "cud",
        service: "Compute Engine",
        region: "us-east-1",
        term: "1yr",
        startDate: sixMonthsAgo,
        endDate: sixMonthsFromNow,
        totalCost: new Decimal("6000.00"),
        usedCost: new Decimal("4200.00"),
        coveragePct: new Decimal("70.00"),
      },
      {
        orgId,
        provider: "azure",
        commitmentType: "ri",
        service: "Virtual Machines",
        region: "us-east-1",
        term: "1yr",
        startDate: oneYearAgo,
        endDate: oneYearFromNow,
        totalCost: new Decimal("4800.00"),
        usedCost: new Decimal("2880.00"),
        coveragePct: new Decimal("60.00"),
      },
    ],
  });

  // ── Notifications ─────────────────────────────────────────
  const notifTemplates = [
    { type: "anomaly", title: "Cost anomaly detected", body: "Lambda function data-pipeline-prod saw a 593% cost increase in the last 24 hours." },
    { type: "waste_found", title: "New savings opportunity", body: "Idle EC2 instance i-0a1b2c3d could save $156/month. Review in Waste Scanner." },
    { type: "anomaly", title: "CloudFront spike", body: "CloudFront distribution E1ABC234DEF is 89% above expected spend this week." },
    { type: "budget_breach", title: "Budget threshold reached", body: "AWS spend has reached 85% of the monthly budget ($6,800 of $8,000)." },
    { type: "waste_found", title: "Oversized RDS instance", body: "db-prod-analytics-01 is using only 15% of allocated memory. Downsize to save $320/month." },
    { type: "policy_violation", title: "Untagged resources found", body: "12 resources in us-west-2 are missing required Team and Environment tags." },
    { type: "waste_found", title: "Orphaned EBS volume", body: "500GB gp3 volume vol-0abc123d has been unattached for 30+ days." },
    { type: "anomaly", title: "GCS storage cost increase", body: "Cloud Storage bucket staging-logs costs increased 52% from last month." },
    { type: "budget_breach", title: "GCP budget alert", body: "GCP Compute Engine spend is on track to exceed budget by 15% this month." },
    { type: "waste_found", title: "Idle NAT Gateway", body: "NAT Gateway in eu-west-1 processes <1GB/day. Consider VPC endpoints instead." },
  ];

  await prisma.notification.createMany({
    data: notifTemplates.map((n, i) => ({
      orgId,
      type: n.type,
      title: n.title,
      body: n.body,
      read: i > 4, // first 5 unread
      createdAt: new Date(now.getTime() - i * 8 * 60 * 60 * 1000), // staggered
    })),
  });

  // ── Dashboard ─────────────────────────────────────────────
  await prisma.dashboard.create({
    data: {
      orgId,
      name: "Executive Summary",
      isDefault: true,
      layout: { columns: 2, rows: 3 },
      widgets: [
        { type: "spend_trend", position: { col: 0, row: 0, w: 2, h: 1 }, config: { period: "30d" } },
        { type: "top_services", position: { col: 0, row: 1, w: 1, h: 1 }, config: { limit: 5 } },
        { type: "team_breakdown", position: { col: 1, row: 1, w: 1, h: 1 }, config: {} },
        { type: "anomalies", position: { col: 0, row: 2, w: 1, h: 1 }, config: { severity: "high" } },
        { type: "savings_opportunities", position: { col: 1, row: 2, w: 1, h: 1 }, config: {} },
      ],
    },
  });

  // ── Flag org as having demo data ──────────────────────────
  await prisma.orgSetting.create({
    data: {
      orgId,
      settingKey: "has_demo_data",
      settingValue: "true",
    },
  });
}
