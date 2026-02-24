'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';

type ProPlanContextType = {
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
};

const ProPlanContext = createContext<ProPlanContextType | undefined>(undefined);

export function ProPlanProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);

  return React.createElement(ProPlanContext.Provider, { value: { isPro, setIsPro } }, children);
}

export function useProPlan() {
  const context = useContext(ProPlanContext);
  if (context === undefined) {
    throw new Error('useProPlan must be used within a ProPlanProvider');
  }
  return context;
}
