import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "patient" | "prescriber" | null;

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (role: UserRole) => void;
  userData: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const completeOnboarding = (data: any) => {
    setUserRole(data.selectedRole);
    setHasCompletedOnboarding(true);
    delete data.password;
    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...data,
        selectedRole: data.selectedRole,
      })
    );
    delete data.token;
    setUserData(data);
  };

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        hasCompletedOnboarding,
        completeOnboarding,
        userData,
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
