import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import DeleteModal from "../components/DeleteModal";
import LogoutModal from "../components/LogoutModal";
import { DataContext } from "../context/Context";
import {
  ShieldCheck,
  Bell,
  Moon,
  Sun,
  Trash2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

function Settings() {
  const { auth, updateUser, updatePassword, deleteAccount, logout } = useAuth();
  const { user, getAllUsers } = useContext(DataContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    email: user?.email || "",
    username: user?.username || "",
    profileUrl: user?.profileUrl || "",
  });

  const [security, setSecurity] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || "dark",
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      routeAlerts: user?.preferences?.notifications?.routeAlerts ?? true,
      productUpdates: user?.preferences?.notifications?.productUpdates ?? true,
    },
    privacy: {
      showProfile: user?.preferences?.privacy?.showProfile ?? true,
      shareActivity: user?.preferences?.privacy?.shareActivity ?? false,
    },
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    getAllUsers()
  }, []);

  useEffect(() => {
    if (!auth?.token) {
      navigate("/auth?mode=login");
    }
  }, [auth, navigate]);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  function handleSecurityChange(e) {
    const { name, value } = e.target;
    setSecurity((prev) => ({ ...prev, [name]: value }));
  }

  function handleToggle(group, key) {
    setPreferences((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !prev[group][key],
      },
    }));
  }

  function handleThemeChange(value) {
    setPreferences((prev) => ({ ...prev, theme: value }));
  }

  function handleSaveSettings(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const updatedFields = {
      email: profile.email,
      preferences,
      profileUrl: profile.profileUrl,
    };

    if (security.newPassword) {
      updatedFields.password = security.newPassword;
    }

    updateUser(updatedFields);
    setMessage("Settings saved successfully.");
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setSaving(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleUpdatePassword(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    if (security.newPassword || security.confirmPassword) {
      if (security.newPassword !== security.confirmPassword) {
        setError("New password and confirmation do not match.");
        setSaving(false);
        return;
      }
    }

    const updatedFields = {
      password: profile.email,
    };

    if (security.newPassword) {
      updatedFields.password = security.newPassword;
    }

    updatePassword(updatedFields);
    setMessage("Settings saved successfully.");
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setSaving(false);
  }

  const handleDeleteBtn = () => {
    setIsDeleteModalOpen(true);
  };

  const handleLogoutBtn = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    deleteAccount();
    setIsDeleteModalOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setIsModalOpen(false);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-slate-800 px-2 py-6 md:px-6 pt-24 text-slate-100">
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />

        <LogoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmLogout}
        />

        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex px-4 flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#6dbb71] font-semibold">
                Account settings
              </p>
              <h1 className="text-3xl font-bold text-white mt-3">
                Manage your profile & preferences
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-2xl">
                Update your personal details, tighten account security, and
                choose the notifications and privacy settings that fit your
                travel style.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#6dbb71] bg-[#09120d] px-4 py-3 text-sm text-[#6dbb71] transition hover:bg-[#6dbb71]/10"
              >
                <ArrowLeft size={16} /> Back to dashboard
              </Link>
              <button
                type="button"
                onClick={() => handleLogoutBtn()}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#6dbb71] px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#c34343]"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <form
              onSubmit={handleSaveSettings}
              className="space-y-6 rounded-3xl border border-[#2f4e33] bg-[#08100f] p-6 shadow-xl shadow-[#00000080]"
            >
              <div className="space-y-5 max-w-2xl mx-auto">
                <div className="rounded-3xl border border-slate-700 bg-[#0d1714] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Profile & account
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Edit the information used to identify your account.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-[#13241d] px-3 py-2 text-sm text-[#6dbb71]">
                      <ShieldCheck size={18} /> Secure
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <label className="block text-sm text-slate-300">
                      Username
                      <input
                        name="username"
                        value={profile.username}
                        onChange={handleProfileChange}
                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#07110f] px-4 py-3 text-slate-100 outline-none focus:border-[#6dbb71] focus:ring-2 focus:ring-[#6dbb71]/20"
                        placeholder="Username"
                        disabled
                        required
                      />
                    </label>
                    <label className="block text-sm text-slate-300 md:col-span-2">
                      Email address
                      <input
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#07110f] px-4 py-3 text-slate-100 outline-none focus:border-[#6dbb71] focus:ring-2 focus:ring-[#6dbb71]/20"
                        placeholder="you@example.com"
                        required
                      />
                    </label>
                    <label className="block text-sm text-slate-300 md:col-span-2">
                      Update profile picture
                      <input
                        name="profileUrl"
                        type="text"
                        accept="image/*"
                        value={profile.profileUrl}
                        onChange={(e) => handleProfileChange(e, "profileUrl")}
                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#07110f] px-4 py-3 text-slate-100 outline-none cursor-pointer focus:border-[#6dbb71] focus:ring-2 focus:ring-[#6dbb71]/20"
                        placeholder="Paste Image URL"
                      />
                      <p className="mt-5 text-[#96d799]">Preview:</p>
                      <p>
                        {profile.profileUrl && (
                          <img
                            src={profile.profileUrl}
                            alt="Profile"
                            className="mt-2 w-30 h-30 object-cover border-2 border-[#6dbb71] rounded-full"
                          />
                        )}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-700 bg-[#0d1714] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Notifications
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Choose how you want to hear about route updates and
                        product news.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-[#13241d] px-3 py-2 text-sm text-[#6dbb71]">
                      <Bell size={18} /> Alerts
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {[
                      { label: "Email notifications", key: "email" },
                      { label: "Route alerts", key: "routeAlerts" },
                      { label: "Product updates", key: "productUpdates" },
                    ].map((option) => (
                      <label
                        key={option.key}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-[#07110f] p-4 text-sm text-slate-300"
                      >
                        <span>{option.label}</span>
                        <input
                          type="checkbox"
                          checked={preferences.notifications[option.key]}
                          onChange={() =>
                            handleToggle("notifications", option.key)
                          }
                          className="h-5 w-5 rounded border-slate-500 text-[#6dbb71] focus:ring-[#6dbb71]/70"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-2xl mx-auto">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-300">
                    Preferred theme
                  </p>
                  <p className="text-xs text-slate-500">
                    This value is saved for your account.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Dark", value: "dark", icon: Moon },
                    { label: "Light", value: "light", icon: Sun },
                    { label: "Auto", value: "auto", icon: ArrowLeft },
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = preferences.theme === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleThemeChange(item.value)}
                        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition ${
                          active
                            ? "border-[#6dbb71] bg-[#6dbb71]/15 text-[#c3f6ba]"
                            : "border-slate-700 bg-[#081010] text-slate-300 hover:border-[#6dbb71]/70 hover:bg-[#141f19]"
                        }`}
                      >
                        <Icon size={16} /> {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-[#7a2b2b] px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-2xl bg-[#1f4627] px-4 py-3 text-sm text-emerald-200">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6dbb71] px-5 py-4 text-sm font-semibold text-slate-900 transition hover:bg-[#5daa60] disabled:cursor-not-allowed disabled:opacity-70 max-w-2xl mx-auto"
              >
                <CheckCircle2 size={18} />{" "}
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>

            <aside className="space-y-6 max-w-2xl mx-auto">
              <div className="rounded-3xl border border-slate-700 bg-[#0d1714] p-6 shadow-xl shadow-[#00000080]">
                <div className="rounded-3xl mb-8 border border-slate-700 bg-[#0d1714] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Security
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Change your password and keep your account locked down.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-[#13241d] px-3 py-2 text-sm text-[#6dbb71]">
                      <LockIcon />
                      Password
                    </div>
                  </div>

                  <div className="">
                    <form onSubmit={handleUpdatePassword}
                    className="mt-6 flex flex-col gap-4">
                      <label className="block text-sm text-slate-300">
                        New password
                        <input
                          name="newPassword"
                          type="password"
                          required
                          value={security.newPassword}
                          onChange={handleSecurityChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#07110f] px-4 py-3 text-slate-100 outline-none focus:border-[#6dbb71] focus:ring-2 focus:ring-[#6dbb71]/20"
                          placeholder="New password"
                        />
                      </label>
                      <label className="block text-sm text-slate-300">
                        Confirm password
                        <input
                          name="confirmPassword"
                          type="password"
                          required
                          value={security.confirmPassword}
                          onChange={handleSecurityChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#07110f] px-4 py-3 text-slate-100 outline-none focus:border-[#6dbb71] focus:ring-2 focus:ring-[#6dbb71]/20"
                          placeholder="Confirm new password"
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6dbb71] px-5 py-4 text-sm font-semibold text-slate-900 transition hover:bg-[#5daa60] disabled:cursor-not-allowed disabled:opacity-70 max-w-2xl mx-auto"
                      >
                        <CheckCircle2 size={18} />{" "}
                        {saving ? "Changing..." : "Change Password"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#15271f] text-[#6dbb71]">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Privacy & sharing
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Control whether your contributions are visible and who can
                      find your profile.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-[#07110f] p-4 text-sm text-slate-300">
                    <div>
                      <p>Allow public profile</p>
                      <span className="text-xs text-slate-500">
                        Show your rank and route activity.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.showProfile}
                      onChange={() => handleToggle("privacy", "showProfile")}
                      className="h-5 w-5 rounded border-slate-500 text-[#6dbb71] focus:ring-[#6dbb71]/70"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-[#07110f] p-4 text-sm text-slate-300">
                    <div>
                      <p>Share activity anonymously</p>
                      <span className="text-xs text-slate-500">
                        Keep your route choices private while still contributing
                        insights.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.shareActivity}
                      onChange={() => handleToggle("privacy", "shareActivity")}
                      className="h-5 w-5 rounded border-slate-500 text-[#6dbb71] focus:ring-[#6dbb71]/70"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-[#7a2b2b] bg-[#160f11] p-6 shadow-xl shadow-[#00000080]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#3c1b1e] text-[#f96b6b]">
                    <Trash2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Danger zone
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Permanently remove your account and saved preferences.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 rounded-3xl bg-[#0d1012] p-4 text-sm text-slate-300">
                  <p>
                    Deleting your account will sign you out immediately and
                    clear stored account data from this browser.
                  </p>
                  <button
                    type="button"
                    onClick={handleDeleteBtn}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#b33a45] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a73944]"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

function LockIcon() {
  return <ShieldCheck size={18} className="text-[#6dbb71]" />;
}

export default Settings;
