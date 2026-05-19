import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/authApi";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useToast } from "../context/ToastContext";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const requestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email: formData.email });
      setOtpSent(true);
      showToast("OTP sent to your email", "success");
    } catch (err: any) {
      setError(err?.response?.data?.err || err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      showToast("Password reset successfully. Please sign in.", "success");
      navigate("/signin");
    } catch (err: any) {
      setError(err?.response?.data?.err || err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-extrabold text-white">Reset Password</h2>
            <p className="text-slate-400">Verify your email with an OTP</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={requestOtp}>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your account email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
              <Input
                label="OTP"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={(e) => handleChange("otp", e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                required
              />

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="mt-4 w-full text-sm text-slate-400 transition hover:text-brand"
              >
                Use a different email
              </button>
            </form>
          )}

          <Link to="/signin" className="mt-6 block text-center text-sm text-slate-500 transition hover:text-white">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
