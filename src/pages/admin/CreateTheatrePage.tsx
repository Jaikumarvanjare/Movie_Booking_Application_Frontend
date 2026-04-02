import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheatre } from "../../api/theatreApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useToast } from "../../context/ToastContext";

const CreateTheatrePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    pincode: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createTheatre({
        name: formData.name,
        description: formData.description || undefined,
        city: formData.city,
        pincode: parseInt(formData.pincode),
        address: formData.address || undefined,
      });

      showToast("Theatre created successfully!", "success");
      navigate("/theatres");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create theatre");
      showToast("Failed to create theatre", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl animate-fade-in-up">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Add New Theatre</h1>
        <p className="text-slate-400">Register a new theatre on CineBook</p>
      </div>

      <div className="glass rounded-2xl p-8 shadow-2xl">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1">
          <Input
            label="Theatre Name"
            type="text"
            placeholder="e.g., PVR Cinemas"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description (optional)
            </label>
            <textarea
              placeholder="Theatre description..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(225,29,72,0.1)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="City"
              type="text"
              placeholder="e.g., DELHI"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              required
            />
            <Input
              label="Pincode"
              type="number"
              placeholder="e.g., 110001"
              value={formData.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              required
            />
          </div>

          <Input
            label="Address (optional)"
            type="text"
            placeholder="e.g., Connaught Place"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating Theatre..." : "Create Theatre"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTheatrePage;
