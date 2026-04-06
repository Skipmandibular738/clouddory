'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FinalCTA() {
  const [copied, setCopied] = useState(false);
  const installCmd = 'curl -fsSL https://clouddory.com/install.sh | bash';

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Install in{' '}
            <span className="text-gradient">60 seconds.</span>
          </h2>
          <p className="mt-6 text-xl text-slate-400 max-w-xl mx-auto">
            One command. Auto-detects Docker or Node.js. Sets up everything.
          </p>

          {/* Install command */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div
              onClick={handleCopy}
              className="group relative cursor-pointer rounded-xl bg-navy-900 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 p-1"
            >
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="text-cyan-500 text-sm font-mono">$</span>
                <code className="text-sm sm:text-base font-mono text-slate-300 flex-1 text-left truncate">
                  {installCmd}
                </code>
                <button className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Alt methods */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
              <span>or:</span>
              <code className="px-2 py-1 rounded bg-white/5 text-slate-400 font-mono">docker-compose up -d</code>
              <span>·</span>
              <a href="https://github.com/ALANDVO/clouddory" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                View on GitHub
              </a>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://dashboard.clouddory.com/register"
              className="btn-glow group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-cyan-500 text-navy-950 font-bold text-lg hover:bg-cyan-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,229,199,0.35)]"
            >
              Try Live Demo
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </a>
            <a
              href="https://github.com/ALANDVO/clouddory"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white font-medium text-base hover:border-cyan-500/30 hover:bg-white/5 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Star on GitHub
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Free forever. Open source. MIT license.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
