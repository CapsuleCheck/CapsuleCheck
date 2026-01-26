import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const AUTH_TOKEN_KEY = "authToken";

function getStoredToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setStoredToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

type UserRole = "patient" | "prescriber" | null;

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (data: any) => void;
  userData: any;
  updateUserData: (updates: any) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState<any>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(getStoredToken());
  }, []);

  const setToken = (value: string | null) => {
    setTokenState(value);
    setStoredToken(value);
  };

  const completeOnboarding = (data: any) => {
    if (typeof data === "string") {
      setUserRole(data as UserRole);
      setHasCompletedOnboarding(true);
      const dataToStore = { selectedRole: data };
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(dataToStore));
      }
      setUserData(dataToStore);
      return;
    }
    const tokenFromData = data?.token;
    if (tokenFromData) {
      setToken(tokenFromData);
    }
    setUserRole(data?.selectedRole ?? null);
    setHasCompletedOnboarding(true);
    delete data?.password;
    delete data?.token;
    const dataToStore = {
      ...data,
      selectedRole: data?.selectedRole,
    };
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(dataToStore));
    }
    setUserData(dataToStore);
  };

  const updateUserData = (updates: any) => {
    setUserData((prev: any) => {
      const next = { ...prev, ...updates };
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        hasCompletedOnboarding,
        completeOnboarding,
        userData,
        updateUserData,
        token,
        setToken,
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
