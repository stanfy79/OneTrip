import React, { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import { DataContext } from "../context/Context";
import {
  useScrollReveal,
  useMultipleScrollReveal,
} from "../hooks/useScrollReveal.js";
import {
  MoveRight,
  Disc,
  MapPin,
  Bus,
  Timer,
  Motorbike,
  Forklift,
  MoveHorizontal,
  ArrowRight,
  ArrowLeftRight,
} from "lucide-react";
import bgImage from "../assets/hero-bg.png";
import roadImage from "../assets/road-image.jpg";

function Trips() {
  const { getFareData } = useContext(DataContext);
  const elementRef = useRef(null);
  const inViewRef = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          // reveal animation
          if (entry.isIntersecting) {
            el.classList.add("revealed");
          } else {
            el.classList.remove("revealed");
          }

          // only update rotation visibility for the rotating container
          if (el.classList.contains("observed-rotate")) {
            inViewRef.current = entry.isIntersecting;
          }
        });
      },
      { threshold: 0.2 },
    );

    // observe all matching elements
    const nodes = document.querySelectorAll(".js-observe");
    nodes.forEach((node) => observer.observe(node));

    let ticking = false;

    const handleScroll = () => {
      if (!inViewRef.current) return;
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setRotation((r) => r + delta * 0.5);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fareData = getFareData()
    .toReversed()
    .map((entry, index) => (
      <div
        key={index}
        className="relative p-5 bg-[#00000069] border border-[#6dbb7163] rounded-2xl flex flex-col gap-2 max-w-[700px] w-full reveal-scale js-observe"
      >
        <div className="flex gap-2 items-center text-zinc-300 text-[12px]">
          <Timer size={15} color="#6dbb71" />
          <p className="flex gap-3 items-center">
            DURATION <MoveRight />
            {entry?.timeOfTrip?.duration?.hours > 0
              ? `${entry?.timeOfTrip?.duration?.hours} hr, `
              : ""}
            {entry?.timeOfTrip?.duration?.minutes} min
          </p>
        </div>
        <Link to={`/map2?key=${encodeURIComponent(JSON.stringify(entry))}`}>
          <button className="absolute py-2 px-3 bg-[#86a78892] text-[14px] text-white top-4 right-3 rounded-3xl hover:bg-[#599b5c]">
            View Map
          </button>
        </Link>
        <div className="w-full flex flex-col md:flex-row justify-between gap-y-5">
          <div className="w-[100%] md:w-[70%] flex flex-col gap-2 py-2">
            <div className="w-full flex justify-between items-center border-b-2 border-[#6dbb7174] pb-2 vina-sans">
              <h1 className="text-white text-[30px]">
                {entry?.timeOfTrip?.start}
              </h1>
              <ArrowLeftRight size={30} color="#b14b6f" className="w-full" />
              <h1 className="text-white text-[30px]">
                {entry?.timeOfTrip?.end}
              </h1>
            </div>
            <div className="w-full flex justify-between items-center text-[#a4b5a4] text-[16px]">
              <p className="">{entry?.from}</p>
              <p className="">{entry?.to}</p>
            </div>
          </div>
          <div className="">
            <p className="text-[#6dbb71] text-[25px] audiowide">
              ₦{entry?.amount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {entry?.transportMode === "DANFO" ? (
            <Bus size={"25"} color="#6dbb71" />
          ) : entry?.transportMode === "KEKE" ? (
            <Forklift size={"25"} color="#6dbb71" />
          ) : (
            <Motorbike size={"25"} color="#6dbb71" />
          )}
          <p className="text-[#9a9da3] text-[14px]">{entry?.transportMode}</p>
          <p className="text-[#6dbb71] py-[6px] px-[10px] bg-[#6dbb7145] rounded-[4px] ml-5 text-[14px]">
            {entry?.timeOfDay}
          </p>
          <p className="text-[#9a9da3] text-[14px] absolute right-5">
            Contributed By:{" "}
            <span className="text-[#6dbb71]">{entry?.contributor}</span>
          </p>
        </div>
      </div>
    ));

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-row mb-20">
      <NavBar />
      <div className="p-6 mt-30 w-full">
        <h1 className="text-white text-4xl audiowide">Available Routes</h1>
        <p className="text-[#607f5b] text-[14px]">
          Check possible routes and fares may take to get to your desired
          destination.
        </p>

        <div className="flex flex-col md:flex-row gap-10 mt-20">
          <div className="w-full md:w-[40%] md:max-w-[400px] flex flex-col gap-10">
            <div
              className="relative h-[300px] w-full p-5 rounded-3xl flex reveal-left js-observe"
              style={{
                backgroundImage: `url(${roadImage})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "color-dodge",
                backgroundColor: "rgba(0, 20, 0, 0.6)",
              }}
            >
              <h2 className="text-white text-[18px] audiowide mt-10">
                Contribute to our verse network of route data curated from
                commuters
              </h2>
              <Link to="/submit">
                <button className="absolute flex gap-2 bottom-6 right-5 text-[#6dbb71] py-[6px] px-[15px] bg-[#6dbb7145] rounded-[20px] ml-5 text-[14px] hover:gap-4">
                  Contribute
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
            <div
              className="relative h-[300px] w-full p-5 rounded-3xl flex reveal-left js-observe"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "color-dodge",
                backgroundColor: "rgba(0, 30, 0, 0.6)",
              }}
            >
              <h2
                className="text-white text-[18px] audiowide mt-10"
                onClick={scrollToTop}
              >
                Contribute to our verse network of route data curated from
                commuters
              </h2>
              <Link to="/submit">
                <button
                  className="absolute flex gap-2 bottom-6 right-5 text-[#6dbb71] py-[6px] px-[15px] bg-[#6dbb7145] rounded-[20px] ml-5 text-[14px] hover:gap-4"
                  onClick={scrollToTop}
                >
                  Contribute
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-30 md:mt-0 w-full items-center relative">
            <div className="absolute flex gap-3 right-6 -top-15 text-white">
              <button
                className="p-2 w-[80px] rounded-3xl bg-[#6dbb7152] hover:bg-[#6dbb71]"
                onClick={scrollToTop}
              >
                Filter
              </button>
              <button
                className="p-2 w-[80px] rounded-3xl bg-[#6dbb71] hover:bg-[#6dbb7145]"
                onClick={scrollToTop}
              >
                Sort
              </button>
            </div>
            {fareData}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trips;
