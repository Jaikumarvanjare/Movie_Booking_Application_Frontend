import { createContext, useEffect, useState } from "react";
import { signIn } from "../api/authApi";
import { SignInPayload } from "../types/auth";
import { User } from "../types/user";
import { storage } from "../utils/storage";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: SignInPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = storage.getUser();
    const storedToken = storage.getToken();
    if (storedUser) setUser(storedUser);
    if (storedToken) setToken(storedToken);
    setIsLoading(false);
  }, []);

  const login = async (payload: SignInPayload) => {
    const response = await signIn(payload);
    const authData = response.data;

    const resolvedToken = authData?.accessToken || authData?.token || "";
    const resolvedUser = authData?.user || null;

    if (resolvedToken) {
      storage.setToken(resolvedToken);
      setToken(resolvedToken);
    }

    if (resolvedUser) {
      storage.setUser(resolvedUser);
      setUser(resolvedUser as User);
    }
  };

  const logout = () => {
    storage.clearAuth();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};