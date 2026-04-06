'use client';

// ModuleGate — all modules are free and accessible in the open source version
export default function ModuleGate({ children }: { module: string; children: React.ReactNode }) {
  return <>{children}</>;
}
