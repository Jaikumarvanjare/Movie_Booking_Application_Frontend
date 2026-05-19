import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { updateCurrentProfile } from "../api/userApi";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../hooks/useAuth";

const ProfilePage = () => {
  const { user, updateCurrentUser } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    profilePhotoUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        about: user.about || "",
        profilePhotoUrl: user.profilePhotoUrl || "",
      });
    }
  }, [user]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Profile photo must be 1MB or smaller");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, profilePhotoUrl: String(reader.result || "") }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await updateCurrentProfile(formData);
      updateCurrentUser(response.data.user);
      showToast("Profile updated successfully", "success");
    } catch (err: any) {
      setError(err?.response?.data?.err || err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const initials = formData.name.charAt(0).toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Profile</h1>
        <p className="mt-2 text-slate-400">Manage your personal details and public about section.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <section className="glass rounded-2xl p-6">
          <div className="flex flex-col items-center text-center">
            {formData.profilePhotoUrl ? (
              <img
                src={formData.profilePhotoUrl}
                alt={formData.name}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-brand/20"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-brand/20 text-4xl font-bold text-brand ring-4 ring-brand/20">
                {initials}
              </div>
            )}

            <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700">
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>

            {formData.profilePhotoUrl && (
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, profilePhotoUrl: "" }))}
                className="mt-3 text-sm text-slate-500 transition hover:text-red-400"
              >
                Remove photo
              </button>
            )}
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Input
            label="Name"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            required
          />

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-300">About</label>
            <textarea
              value={formData.about}
              onChange={(event) => setFormData((prev) => ({ ...prev, about: event.target.value }))}
              maxLength={500}
              rows={7}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-brand focus:bg-slate-800 focus:shadow-[0_0_0_3px_rgba(225,29,72,0.1)]"
              placeholder="Tell people a little about yourself"
            />
            <p className="mt-1.5 text-right text-xs text-slate-500">{formData.about.length}/500</p>
          </div>

          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </section>
      </form>
    </div>
  );
};

export default ProfilePage;
