import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth, signup } = useAuth();

  function confirmPassword() {
    if (password !== confPassword) {
      setError("New password and confirmation do not match.");
      setIsSubmitting(false);
      return;
    }
    setError("");
  }

  async function handleSignup(e) {
    e.preventDefault();
    confirmPassword();
    if (error) return;
    
    setIsSubmitting(true);
    
    const userId = crypto.randomUUID();
    const data = {
      email: email,
      username: username,
      password: password,
      id: userId
    };
    
    await signup(data);
    
    if (auth?.token) {
      setIsSubmitting(false);
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.34em] text-[#6dbb71] mt-5 ml-5">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6dbb71]/50 text-[#6dbb71] shadow-sm">
          O
        </span>
        OneTrip
      </div>
      <div className="w-[85%] mx-auto px-8 md:px-10 xl:px-12 scale-90">
        <h1 className="text-2xl font-semibold text-white md:text-4xl">
          Welcome back
        </h1>
        <p className="mt-4 max-w-xl text-[14px] leading-7 text-slate-500">
          Please enter your details to access your route dashboard, compare
          fares, and continue your journey.
        </p>

        <form onSubmit={handleSignup} className="mt-10 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-[#6dbb71] focus:outline-none focus:ring-2 focus:ring-[#6dbb71]/30"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Marcaulay"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-[#6dbb71] focus:outline-none focus:ring-2 focus:ring-[#6dbb71]/30"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Create Password
            </label>
            <div className="relative">
              {" "}
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-[#6dbb71] focus:outline-none focus:ring-2 focus:ring-[#6dbb71]/30 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6dbb71] transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Confirm Password
            </label>
            <div className="relative">
              {" "}
              <input
                type={showPassword2 ? "text" : "password"}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Enter your password again"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-[#6dbb71] focus:outline-none focus:ring-2 focus:ring-[#6dbb71]/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6dbb71] transition"
              >
                {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-sm text-rose-300 p-2">{error}</p>}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-[#6dbb71] focus:ring-[#6dbb71]/60"
              />
              Remember for 30 days
            </label>
            {/* <a
              href="#"
              className="text-sm font-medium text-[#6dbb71] hover:text-[#5daa60]"
            >
              Forgot password?
            </a> */}
          </div>

          {auth?.message && <p className="text-sm text-rose-300 font-medium bg-rose-500/10 p-3 rounded-lg">{auth?.message}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-2xl bg-[#6dbb71] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-[#6dbb71]/20 transition hover:bg-[#5daa60]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200/80 pt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth?mode=login"
            className="font-semibold text-[#6dbb71] hover:text-[#5daa60]"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
}

export default Signup;
