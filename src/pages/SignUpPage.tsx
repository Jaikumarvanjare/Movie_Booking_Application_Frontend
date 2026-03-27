import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { signUp } from "../api/authApi";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userRole: "CUSTOMER"
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await signUp(formData as any);
      setSuccessMessage(response.message || "Account created successfully");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-white">Create Account</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
        />

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">
            User Role
          </label>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none focus:border-rose-600"
            value={formData.userRole}
            onChange={(e) => handleChange("userRole", e.target.value)}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="CLIENT">Client (Theatre Owner)</option>
          </select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/signin" className="text-rose-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;