"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X, ExternalLink } from "lucide-react";
import { useAppStore } from "@/stores/app-store";

export default function SpendCapBanner() {
  const { currentOrgId } = useAppStore();
  const [exceeded, setExceeded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!currentOrgId) return;

    // Check session storage for dismiss state
    const key = `spend_cap_dismissed_${currentOrgId}`;
    if (sessionStorage.getItem(key) === "true") {
      setDismissed(true);
      return;
    }

    // Check if the org has exceeded the spend cap
    fetch(`/api/orgs/${currentOrgId}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        const settings: { settingKey: string; settingValue: string | null }[] =
          data.settings || data;
        const capSetting = settings.find(
          (s) => s.settingKey === "spend_cap_exceeded"
        );
        setExceeded(capSetting?.settingValue === "true");
      })
      .catch(() => {});
  }, [currentOrgId]);

  if (!exceeded || dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    if (currentOrgId) {
      sessionStorage.setItem(
        `spend_cap_dismissed_${currentOrgId}`,
        "true"
      );
    }
  }

  return (
    <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-200 font-medium">
            Your cloud spend exceeds $10,000/month
          </p>
          <p className="text-xs text-amber-200/70 mt-1">
            CloudDory&apos;s hosted demo is limited to $10K. For unlimited usage,
            install CloudDory on your own server.
          </p>
          <a
            href="https://github.com/ALANDVO/clouddory"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View on GitHub
          </a>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded hover:bg-amber-500/20 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
}
