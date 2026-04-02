import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface AdminProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: ("ADMIN" | "CLIENT")[];
}

const AdminProtectedRoute = ({
  children,
  allowedRoles = ["ADMIN", "CLIENT"]
}: AdminProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-rose-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.userStatus && user.userStatus !== "APPROVED") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-3xl font-bold text-amber-500">Account Pending</h1>
        <p className="text-slate-400">
          Your account is not approved for admin actions yet.
        </p>
      </div>
    );
  }

  if (!allowedRoles.includes(user?.userRole as "ADMIN" | "CLIENT")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="text-slate-400">You don't have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
