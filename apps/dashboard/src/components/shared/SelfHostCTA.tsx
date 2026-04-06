"use client";

import { ExternalLink } from "lucide-react";

/**
 * A subtle text link encouraging self-hosting for users on the demo tier.
 */
export default function SelfHostCTA() {
  return (
    <div className="mt-6 pt-4 border-t border-white/[0.04]">
      <a
        href="https://github.com/ALANDVO/clouddory"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        Running on the demo? Install CloudDory on your own server
      </a>
    </div>
  );
}
