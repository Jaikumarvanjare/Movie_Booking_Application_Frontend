import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Theatre } from "../../types/theatre";

const CreateTheatrePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<Partial<Theatre>>({
    name: "",
    description: "",
    city: "",
    pincode: undefined,
    address: ""
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await apiClient.post("/theatres", {
        ...formData,
        pincode: Number(formData.pincode)
      });
      setSuccess("Theatre created successfully!");
      setTimeout(() => navigate("/theatres"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create theatre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">Create New Theatre</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Theatre Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Description</label>
          <textarea
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none focus:border-rose-600"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <Input
          label="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />

        <Input
          label="Pincode"
          type="number"
          value={formData.pincode || ""}
          onChange={(e) => setFormData({ ...formData, pincode: parseInt(e.target.value) })}
          required
        />

        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Theatre"}
        </Button>
      </form>
    </div>
  );
};

export default CreateTheatrePage;