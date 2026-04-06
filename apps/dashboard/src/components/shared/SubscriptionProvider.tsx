'use client';

import { createContext, useContext } from 'react';

interface SubscriptionContextValue {
  subscriptions: any[];
  hasAccess: (module: string) => boolean;
  getSubscription: (module: string) => any;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  subscriptions: [],
  hasAccess: () => true,  // Always grant access — free & open source
  getSubscription: () => ({ status: 'active', plan: 'free' }),
});

export function SubscriptionProvider({
  subscriptions,
  children,
}: {
  subscriptions: any[];
  children: React.ReactNode;
}) {
  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        hasAccess: () => true,
        getSubscription: () => ({ status: 'active', plan: 'free' }),
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  return useContext(SubscriptionContext);
}
