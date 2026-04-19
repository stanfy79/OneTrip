import React, { useContext, useRef, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import CheckRoute from "../components/CheckRoute";
import PopularRoutes from "../components/PopularRoutes";
import {
  useScrollReveal,
  useMultipleScrollReveal,
} from "../hooks/useScrollReveal.js";
import { Map } from "../components/MapBox.jsx";
import { DataContext } from "../context/Context";
import bgImage from "../assets/hero-bg.png";
import busImage from "../assets/green-bus.png";
import kekeImage from "../assets/green-bike.png";

function Home() {
  const { submittedData, getFareData, getAllUsers } = useContext(DataContext);
  const elementRef = useRef(null);
  const inViewRef = useRef(false);
  const lastScrollY = useRef(0);
  const heroReveal = useScrollReveal();
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    getAllUsers();
    
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

  return (
    <div className="flex flex-col mb-30">
      <NavBar />
      <div className="p-6 mt-10 w-full">
        <section>
          <div
            ref={heroReveal.elementRef}
            className="mt-20 p-10 rounded-3xl flex flex-col gap-6 items-start reveal-up js-observe"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundPosition: "start",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundBlendMode: "color-dodge",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <h1 className="text-white text-6xl nunito-sans">
              Smart travel for
            </h1>
            <h1 className="text-[#6dbb71] text-5xl nunito-sans">
              modern curator.
            </h1>
            <p className="text-[#879286] text-[15px]">
              Compare transport fares, and discover optimized routes, <br />
              and navigate Nigeria's transit landscape with precision.
            </p>

            <p className="text-[16px] text-white mt-12">
              <span className="text-5xl text-[#b14b6f] audiowide">
                +{submittedData?.length || 0}
              </span>{" "}
              Total Contributions
            </p>
            <p className=" text-[16px] text-white mt-2">
              <span className="text-5xl text-[#b14b6f] audiowide">
                ₦
                {(submittedData?.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0) || 0).toLocaleString()}
              </span>{" "}
              Total Spent by Commuters
            </p>
          </div>

          <div className="flex relative justify-center gap-10 mt-20">
            <div
              ref={elementRef}
              className="absolute top-50 left-0 md:top-0 md:relative w-[40%]"
            >
              <img
                src={busImage}
                alt="Green Bus"
                className="w-[250px] absolute top-5 left-20 reveal-left js-observe"
              />
              <img
                src={kekeImage}
                alt="Green Bike"
                className="w-[250px] absolute bottom-0 left-0 reveal-up js-observe"
              />
            </div>
            <CheckRoute />
          </div>
        </section>

        <section className="mt-30 border-t-2 border-[#6dbb7174] pt-10">
          <Map />
          <div className="mt-30">
            <PopularRoutes />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
