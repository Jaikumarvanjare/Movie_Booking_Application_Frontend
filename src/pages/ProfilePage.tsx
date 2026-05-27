import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateCurrentProfile } from "../api/userApi";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../hooks/useAuth";
import { appRoutes } from "../utils/routes";

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
    <div className="mx-auto max-w-5xl py-10">
      <section className="mb-8 rounded-2xl border border-slate-800/70 bg-[linear-gradient(135deg,_rgba(17,24,39,0.95),_rgba(15,23,42,0.95),_rgba(42,15,29,0.9))] p-6 shadow-2xl shadow-brand/5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {formData.profilePhotoUrl ? (
              <img
                src={formData.profilePhotoUrl}
                alt={formData.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-brand/20"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-xl font-black text-white ring-4 ring-brand/20">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-white">{formData.name || "CineBook User"}</h1>
              <p className="mt-1 text-slate-300">{user?.email}</p>
            </div>
          </div>
          <a
            href="#edit-profile"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:from-brand-dark hover:to-brand hover:shadow-brand/40"
          >
            Edit profile
          </a>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form id="edit-profile" onSubmit={handleSubmit} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Edit profile</h2>
            <p className="mt-1 text-sm text-slate-400">Update your name, about, and photo.</p>
          </div>

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
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-brand focus:bg-slate-800 focus:shadow-[0_0_0_3px_rgba(225,29,72,0.1)]"
              placeholder="Tell people a little about yourself"
            />
            <p className="mt-1.5 text-right text-xs text-slate-500">{formData.about.length}/500</p>
          </div>

          <label className="mb-5 flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-700">
            <span>Upload profile photo</span>
            <span className="font-semibold text-brand">Choose file</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>

          {formData.profilePhotoUrl && (
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, profilePhotoUrl: "" }))}
              className="mb-5 text-sm text-slate-500 transition hover:text-red-400"
            >
              Remove photo
            </button>
          )}

          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-5">
            <h2 className="mb-4 text-xl font-bold text-white">Account</h2>
            <Link
              to={appRoutes.resetPassword}
              className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:border-brand/40 hover:text-white"
            >
              <span>Reset with OTP</span>
              <span className="text-brand">→</span>
            </Link>
            <Link
              to={appRoutes.payments}
              className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:border-brand/40 hover:text-white"
            >
              <span>Payment history</span>
              <span className="text-brand">→</span>
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
