'use client';

import { motion } from 'framer-motion';

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-medium">
            Pricing
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Free.{' '}
            <span className="text-gradient">Open source.</span>{' '}
            Forever.
          </h2>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto">
            CloudDory is 100% free and open source under the MIT license. Self-host it on your own infrastructure. No usage limits, no feature gates, no vendor lock-in.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl bg-gradient-to-b from-cyan-500/10 to-navy-900/80 border-2 border-cyan-500/30 p-10 text-center"
          >
            <div className="mb-6">
              <span className="font-display font-extrabold text-6xl text-white">$0</span>
              <span className="text-slate-400 text-lg ml-2">forever</span>
            </div>

            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto">
              {[
                'All modules included — FinOps, Security, Threat Intel, SOAR',
                'Unlimited cloud accounts (AWS, GCP, Azure)',
                'AI-powered DoryAI assistant (bring your own keys)',
                'CVE tracking from NVD + CISA KEV',
                'AiTags virtual tagging, cost allocation, waste scanning',
                'Custom dashboards, query builder, reports',
                '20+ integrations (Jira, Slack, Datadog, Snowflake)',
                'Role-based access, SSO, API keys',
                'Self-hosted — your data never leaves your infrastructure',
                'MIT license — use, modify, distribute freely',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                  <svg className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/ALANDVO/clouddory"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-500 text-navy-950 font-semibold text-base hover:bg-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,199,0.3)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                View on GitHub
              </a>
              <a
                href="https://dashboard.clouddory.com/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white font-medium text-base hover:border-cyan-500/30 hover:bg-white/5 transition-all duration-300"
              >
                Try Live Demo
              </a>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-slate-500 mt-8"
        >
          No credit card. No signup required for self-hosting. Just clone, configure, and deploy.
        </motion.p>
      </div>
    </section>
  );
}
