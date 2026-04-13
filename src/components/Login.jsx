import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth, login } = useAuth();

  function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    if (auth?.user?.email === email && auth?.user?.password === password) {
      setMessage("Login successful!");
      const loginData = {
        email,
        password,
      };
      login(loginData);
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    return setMessage("incorrect email or password");
  }

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

        <form onSubmit={handleLogin} className="mt-10 space-y-4">
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-[#6dbb71] focus:outline-none focus:ring-2 focus:ring-[#6dbb71]/30"
              required
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-[#6dbb71] focus:ring-[#6dbb71]/60"
              />
              Remember for 30 days
            </label>
            <a
              href="#"
              className="text-sm font-medium text-[#6dbb71] hover:text-[#5daa60]"
            >
              Forgot password?
            </a>
          </div>

          {message && <p className="text-sm text-blue-300">{message}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-2xl bg-[#6dbb71] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-[#6dbb71]/20 transition hover:bg-[#5daa60]"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200/80 pt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth?mode=signup"
            className="font-semibold text-[#6dbb71] hover:text-[#5daa60]"
          >
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
