import { createContext, ReactNode, useContext } from 'react';

import useAgendaHook from '@/hooks/useAgenda';

const AgendaContext = createContext<any>(null);

export function AgendaProvider({ children }: { children: ReactNode }) {
  const agenda = useAgendaHook();

  return (
    <AgendaContext.Provider value={agenda}>
      {children}
    </AgendaContext.Provider>
  );
}

export default function useAgenda() {
  return useContext(AgendaContext);
}