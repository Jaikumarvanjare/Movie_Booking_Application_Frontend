import { createContext, useEffect, useState } from "react";
import { signIn } from "../api/authApi";
import type { AuthData, SignInPayload } from "../types/auth";
import type { User, UserRole, UserStatus } from "../types/user";
import { storage } from "../utils/storage";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: SignInPayload) => Promise<void>;
  logout: () => void;
}

interface JwtPayload {
  id?: string;
  userId?: string;
  email?: string;
  name?: string;
  userRole?: UserRole;
  role?: UserRole;
  userStatus?: UserStatus;
  status?: UserStatus;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const [, payloadSegment] = token.split(".");
    if (!payloadSegment) return null;

    const normalizedPayload = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "="));
    return JSON.parse(decodedPayload) as JwtPayload;
  } catch {
    return null;
  }
};

const buildUserFromAuthData = (authData: AuthData, token: string): User | null => {
  if (authData.user) {
    return authData.user;
  }

  const jwtPayload = decodeJwtPayload(token);
  const email = authData.email || jwtPayload?.email;
  const userRole = authData.role || jwtPayload?.role || jwtPayload?.userRole;

  if (!email || !userRole) {
    return null;
  }

  const derivedName = jwtPayload?.name || email.split("@")[0] || "User";

  return {
    id: jwtPayload?.id || jwtPayload?.userId || email,
    name: derivedName,
    email,
    userRole,
    userStatus: authData.status || jwtPayload?.status || jwtPayload?.userStatus
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = storage.getUser();
    const storedToken = storage.getToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    } else {
      storage.clearAuth();
    }

    setIsLoading(false);
  }, []);

  const login = async (payload: SignInPayload) => {
    const response = await signIn(payload);
    const authData = response.data;
    const resolvedToken = authData?.accessToken || authData?.token || "";
    const resolvedUser = resolvedToken ? buildUserFromAuthData(authData, resolvedToken) : null;

    if (!resolvedToken || !resolvedUser) {
      throw new Error("Sign in response is missing user or token data.");
    }

    storage.setToken(resolvedToken);
    storage.setUser(resolvedUser);
    setToken(resolvedToken);
    setUser(resolvedUser);
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
