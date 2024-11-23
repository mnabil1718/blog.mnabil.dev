"use client";
import React, { createContext, useContext, ReactNode } from "react";

interface CsrfTokenProviderProps {
  csrfToken: string;
  children: ReactNode;
}

const CsrfTokenContext = createContext<string | undefined>(undefined);

export const useCsrfToken = (): string => {
  const context = useContext(CsrfTokenContext);
  if (context === undefined) {
    throw new Error("useCsrfToken must be used within a CsrfTokenProvider");
  }
  return context;
};

export const CsrfTokenProvider: React.FC<CsrfTokenProviderProps> = ({
  csrfToken,
  children,
}) => {
  return (
    <CsrfTokenContext.Provider value={csrfToken}>
      {children}
    </CsrfTokenContext.Provider>
  );
};
