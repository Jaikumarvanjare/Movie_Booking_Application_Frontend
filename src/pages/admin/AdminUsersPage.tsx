import { type FormEvent, useState } from "react";
import { updateUser } from "../../api/userApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useToast } from "../../context/ToastContext";
import type { UserRole, UserStatus } from "../../types/user";

const AdminUsersPage = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    userRole: "CUSTOMER" as UserRole,
    userStatus: "APPROVED" as UserStatus
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateUser(formData.userId, {
        userRole: formData.userRole,
        userStatus: formData.userStatus
      });
      showToast("User updated successfully", "success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update user");
      showToast("Failed to update user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl animate-fade-in-up">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Admin User Update</h1>
        <p className="text-slate-400">
          Your backend only exposes an update route for users, so this page updates a user when you already know the user id.
        </p>
      </div>

      <div className="glass rounded-2xl p-8 shadow-2xl">
        {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-1">
          <Input
            label="User ID"
            placeholder="Mongo ObjectId"
            value={formData.userId}
            onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">User Role</label>
              <select
                value={formData.userRole}
                onChange={(e) => setFormData((prev) => ({ ...prev, userRole: e.target.value as UserRole }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="CLIENT">Client</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">User Status</label>
              <select
                value={formData.userStatus}
                onChange={(e) => setFormData((prev) => ({ ...prev, userStatus: e.target.value as UserStatus }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand"
              >
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update User"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminUsersPage;
