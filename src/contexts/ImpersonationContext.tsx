import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImpersonationState {
  isImpersonating: boolean;
  originalUser: {
    id: string;
    email: string;
    role: string;
  } | null;
  impersonatedUser: {
    id: string;
    email: string;
    role: string;
  } | null;
}

interface ImpersonationContextType {
  state: ImpersonationState;
  startImpersonation: (originalUser: any, targetUser: any) => void;
  endImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ImpersonationState>({
    isImpersonating: false,
    originalUser: null,
    impersonatedUser: null,
  });

  const startImpersonation = (originalUser: any, targetUser: any) => {
    setState({
      isImpersonating: true,
      originalUser: {
        id: originalUser.id,
        email: originalUser.email,
        role: originalUser.role,
      },
      impersonatedUser: {
        id: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
      },
    });
  };

  const endImpersonation = () => {
    setState({
      isImpersonating: false,
      originalUser: null,
      impersonatedUser: null,
    });
  };

  return (
    <ImpersonationContext.Provider value={{ state, startImpersonation, endImpersonation }}>
      {children}
    </ImpersonationContext.Provider>
  );
}

export function useImpersonation() {
  const context = useContext(ImpersonationContext);
  if (context === undefined) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return context;
}