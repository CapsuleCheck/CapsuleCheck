import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "patient" | "prescriber" | null;

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const completeOnboarding = (role: UserRole) => {
    setUserRole(role);
    setHasCompletedOnboarding(true);
  };

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        hasCompletedOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
