'use client';

import { Heart, Github, Coffee, Gift, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  'FinOps & Cost Optimization',
  'Cloud Security (CSPM) + CVE Tracking',
  'Threat Intelligence Feeds',
  'SOAR Automated Playbooks',
  'DoryAI Assistant (Gemini/OpenAI/Anthropic)',
  'AWS, GCP, Azure Integrations',
  'AiTags Virtual Tagging',
  'Custom Dashboards & Reports',
  'Jira, Confluence, Slack Integrations',
  'Unlimited Users & Cloud Accounts',
  'Role-Based Access Controls',
  'API Access & Webhooks',
];

export default function BillingPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-display font-semibold text-white">Plan & Billing</h2>
        <p className="text-sm text-muted-foreground mt-1">CloudDory is free and open source.</p>
      </div>

      {/* Free Plan Card */}
      <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-navy-900/80">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl text-white">
                Free <Badge className="ml-2 bg-cyan-500/10 text-cyan-400">Forever</Badge>
              </h3>
              <p className="text-sm text-slate-400">Open source under MIT license</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2 mb-8">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-navy-950/50 border border-white/5">
            <p className="text-sm text-slate-400">
              No credit card required. No usage limits. No feature gates. All modules are included for every user.
              Self-host on your own infrastructure for complete control, or use our hosted demo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Support the Project */}
      <Card className="border-white/5">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-rose-400" />
            <h3 className="font-display font-semibold text-lg text-white">Support the Project</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            CloudDory is built and maintained by Alan Vo. If it saves your team time or money,
            consider supporting the project to keep development going.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://buymeacoffee.com/alanvo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <Coffee className="w-4 h-4 text-amber-400" />
                Buy Me a Coffee
              </Button>
            </a>
            <a
              href="https://github.com/ALANDVO/clouddory"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <Github className="w-4 h-4" />
                Star on GitHub
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Self-Host */}
      <Card className="border-white/5">
        <CardContent className="p-8">
          <h3 className="font-display font-semibold text-lg text-white mb-2">Running on the Hosted Demo?</h3>
          <p className="text-sm text-slate-400 mb-4">
            The hosted demo at dashboard.clouddory.com supports cloud accounts with up to $10,000/month in spend.
            For larger environments or full data sovereignty, install CloudDory on your own server.
          </p>
          <a
            href="https://github.com/ALANDVO/clouddory"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="gap-2">
              <Github className="w-4 h-4" />
              Self-Host from GitHub
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
