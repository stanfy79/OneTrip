import React, { use, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Signup from '../components/Signup';
import Login from '../components/Login';
import NavBar from "../components/NavBar";
import { useAuth } from '../context/AuthContext';
import busImage from "../assets/green-bus.png";
import kekeImage from "../assets/green-bike.png";

function AuthPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth?.token) {
      return navigate('/dashboard');
    }
  }, [auth])
  const searchParams = new URLSearchParams(window.location.search);
  const mode = searchParams.get("mode") || 'login';
  

  return (
    <div className="min-h-screen bg-[#080d21]">
      <NavBar />
      <div className="flex flex-col mt-18 md:flex-row">
        <div className="bg-[#080d21] w-full">
          {mode === "signup" ? <Signup /> : <Login />}
        </div>

        <div
          className="relative w-full min-h-130 md:min-h-screen bg-linear-to-br from-[#092d0b] via-[#103913] to-[#0e3f10] p-8 text-white sm:px-10 xl:p-12"
        >
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at top left, rgba(255,255,255,0.25), transparent 25%)" }} />
          <div className="absolute -left-12 top-16 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -right-16 bottom-12 h-44 w-44 rounded-full bg-white/20 blur-3xl" />

          <div className="relative flex h-full flex-col gap-8 scale-95">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/75">
                Secure access
              </p>
              <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-4xl">
                Smart sign in for modern travelers
              </h2>
              <p className="mt-3 max-w-xl text-[14px] leading-7 text-white/80">
                All you need to access a network of trusted routes. Sign up or log in to explore the world with confidence.
              </p>
            </div>

            <div className="relative">
              <img src={busImage} alt="Bus" className='w-[40%] absolute left-0 top-0' />
              <img src={kekeImage} alt="Keke" className='w-[50%] absolute right-0 top-20' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
