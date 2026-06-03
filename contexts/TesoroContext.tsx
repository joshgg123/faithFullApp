import {
  createContext,
  ReactNode,
  useContext,
} from "react";

import useTreasuryHook from "@/hooks/useTreasury";

const TreasuryContext =
  createContext<any>(null);

export function TreasuryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const treasury =
    useTreasuryHook();

  return (
    <TreasuryContext.Provider
      value={treasury}
    >
      {children}
    </TreasuryContext.Provider>
  );
}

export default function useTreasury() {
  return useContext(
    TreasuryContext,
  );
}