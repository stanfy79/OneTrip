import React, { useContext, useRef, useState, useEffect } from "react";
import {
  useScrollReveal,
  useMultipleScrollReveal,
} from "../hooks/useScrollReveal.js";
import {
  ArrowUpRight,
  MoveRight,
  Route,
  Timer,
  ArrowLeftRight,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map } from "./MapBox.jsx";
import { Link } from "react-router-dom";
import { DataContext } from "../context/Context";

function PopularRoutes() {
  const inViewRef = useRef(false);
  const lastScrollY = useRef(0);
  const { getRouteData } = useContext(DataContext);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("revealed");
          } else {
            el.classList.remove("revealed");
          }

          if (el.classList.contains("observed-rotate")) {
            inViewRef.current = entry.isIntersecting;
          }
        });
      },
      { threshold: 0.3 },
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const routeData = getRouteData();

  return (
    <div className="">
      <div className="flex flex-row justify-between">
        <div className="">
          <h2 className="text-2xl text-white">Popular Routes</h2>
          <p className="text-[#607f5b] text-[12px]">
            See the most traveled paths in Nigeria
          </p>
        </div>
        <Link to="/popular-routes">
          <button className="p-4 hover:bg-[#6dbb7142] text-[#6dbb71] text-[12px] flex justify-center gap-2.5 align-middle rounded-3xl">
            View More <ArrowUpRight size={20} />
          </button>
        </Link>
      </div>
      <div className="relative grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-5 mt-5 mb-5 overflow-y-hidden">
        {routeData && routeData.length > 0 ?
          routeData
            ?.slice()
            .reverse()
            .map((routes, key) => (
              <div
              className="p-3 border-2 border-[#6dbb7142] rounded-2xl w-full min-w-[250px] reveal-scale js-observe"
              key={key}
            >
              <div className="w-full h-50 bg-[#043e0763] rounded-lg justify-center flex items-center">
                <Route size={50} color="white" />
              </div>
              <div className="py-3">
                <div className="flex gap-2 items-center text-zinc-300 text-[12px]">
                  <p className="flex gap-3 items-center">
                    TIME <MoveRight />
                    {routes?.time}
                  </p>
                  <p className="text-[#6dbb71] py-[6px] px-[10px] bg-[#6dbb7145] rounded-[4px] ml-5 text-[14px]">
                    {routes?.date}
                  </p>
                </div>
                <div className="flex mt-3 gap-y-4 flex-col justify-between items-center">
                  <div className="w-full flex flex-col gap-3">
                    <div className="w-full flex justify-between items-center text-[#a4b5a4] text-[14px]">
                      <p className="">{routes?.from}</p>
                      <ArrowLeftRight
                        size={30}
                        color="#b14b6f"
                        className="w-full"
                      />
                      <p className="">{routes?.to}</p>
                    </div>
                    <div className="w-full flex gap-3 text-[#6bdd71] text-[16px]">
                      <p className="">{routes?.routeDetails?.distance}</p>
                      <Timer size={20} color="#6dbb71" />
                      <p className="">{routes?.routeDetails?.duration}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center w-full">
                    <p className="text-gray-500 text-[12px]">Estimated cost</p>
                    <p className="text-[#6dbb71] text-[20px] audiowide">
                      ₦{routes?.routeDetails?.estimatedCost}
                    </p>

                    <Link to={`/map?key=${encodeURIComponent(JSON.stringify(routes))}`}>
                      <button className="absolute p-3 bg-[#6dbb71] text-[14px] text-white bottom-4 right-3 rounded-3xl hover:bg-[#599b5c]">
                        Veiw Map
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )): <p className="text-white">No popular routes available.</p> }
      </div>
    </div>
  );
}

export default PopularRoutes;
