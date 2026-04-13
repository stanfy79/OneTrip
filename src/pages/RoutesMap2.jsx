import React, { useState, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { DataContext } from "../context/Context";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Bus,
  Timer,
  Motorbike,
  Forklift,
  Road,
} from "lucide-react";
import BackButton from "../components/BackButton";
import NavBar from "../components/NavBar";

function RoutesMap() {
  const location = useLocation();
  const mapContainerRef = useRef();
  const [mapInfo, setMapInfo] = useState(null);
  const mapRef = useRef(null);
  const [distance, setDistance] = useState("-- km");
  const [routeData, setRouteData] = useState(null);
  const [coordinates, setCoordinates] = useState({
    current: null,
    destination: null,
  });
  const { fetchCoordinates, getRouteInfo } = useContext(DataContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jsonString = params.get("key");

    if (jsonString) {
      try {
        // URLSearchParams already handled the %22 -> " conversion.
        // Just parse the string directly.
        const data = JSON.parse(jsonString);
        setRouteData(data);
        console.log("Decoded Object:", data);
      } catch (error) {
        console.error("Failed to parse route key:", error);
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (!routeData) return;

    const getCoordinates = async () => {
      const coords = await fetchCoordinates(
        routeData.from.toLowerCase(),
        routeData.to.toLowerCase(),
      );
      setCoordinates(coords);
      console.log("Coordinates:", coords);
    };
    getCoordinates();
  }, [routeData]);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/builddude/cmnkaxe5a004j01sae913d904",
      center: [3.340787, 6.5960605],
      zoom: 12,
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !coordinates?.current || !coordinates?.destination) return;

    const getRoute = async () => {
      const start = coordinates.current[0];
      const end = coordinates.destination[0];

      if (!start || !end) return;

      try {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${start?.lon},${start?.lat};${end?.lon},${end?.lat}?steps=false&annotations=distance%2Cduration&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        );
        const json = await query.json();
        const data = json.routes[0];

        console.log("MapInfo Data:", data);
        const distanceKm = (data.distance / 1000).toFixed(1);
        setDistance(distanceKm + " km");

        const geojson = {
          type: "Feature",
          properties: {},
          geometry: data.geometry,
        };

        if (!map.isStyleLoaded()) {
          map.once("style.load", () => updateMapSource(map, geojson));
        } else {
          updateMapSource(map, geojson);
        }

        map.flyTo({ center: start, zoom: 13 });
      } catch (error) {
        console.error("Route fetching error:", error);
      }
      new mapboxgl.Marker().setLngLat(start).addTo(map);

      new mapboxgl.Marker().setLngLat(end).addTo(map);
    };

    getRoute();
  }, [coordinates]);

  const updateMapSource = (map, geojson) => {
    if (map.getSource("route")) {
      map.getSource("route").setData(geojson);
    } else {
      map.addLayer({
        id: "route",
        type: "line",
        source: { type: "geojson", data: geojson },
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#6dbb71", "line-width": 10, "line-opacity": 1 },
      });
    }
  };

  useEffect(() => {
    if (coordinates?.current && coordinates?.destination) {
      mapContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [coordinates]);

  window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#050c1d] text-white">
      <NavBar />
      <main className="px-5 py-8 lg:px-10 xl:px-16">
        <section className="mx-auto max-w-7xl my-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-[#6dbb71]/30 bg-[#6dbb71]/10 px-4 py-2 text-sm uppercase tracking-[0.24em] text-[#a8d5ab] shadow-sm">
                Route preview
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Route map & insights
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9aa1b2] md:text-base">
                Visualize the journey, review distance and duration, and compare cost information.
              </p>
               <BackButton />
            </div>
            <div className="rounded-2xl border border-[#6dbb71]/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#6dbb71]">
                Current focus
              </p>
              <p className="mt-2 text-md font-semibold text-white">
                {routeData?.from ?? "Start"} → {routeData?.to ?? "Destination"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-2xl border border-[#6dbb71]/15 bg-[#0d1325]/95">
              <div className="overflow-hidden rounded-3xl bg-[#08111f]">
                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-[#6dbb71]">
                        Route overview
                      </p>
                      <h2 className="mt-3 md:text-3xl font-bold text-white">
                        {routeData?.from ? `${routeData.from} → ${routeData.to}` : "No route selected"}
                      </h2>
                    </div>
                  </div>
                </div>
                <div id="map-container" ref={mapContainerRef} className="w-full" style={{ height: "400px", width: "100%" }} />
              </div>
            </div>

            <aside className="space-y-6 rounded-4xl border border-[#6dbb71]/15 bg-[#0d1325]/95 p-6">
              <div className="rounded-3xl">
                <p className="text-xs uppercase tracking-[0.24em] text-[#6dbb71]">
                  Travel metrics
                </p>
                <div className="mt-5 grid gap-4 max-w-md">
                  <div className="rounded-3xl border border-[#6dbb71]/10 bg-[#08111f]/90 p-4">
                    <p className="text-sm text-[#9aa1b2]">Distance</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {distance}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[#6dbb71]/10 bg-[#08111f]/90 p-4">
                    <p className="text-sm text-[#9aa1b2]">Duration</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {routeData?.timeOfTrip?.duration.hours}h {routeData?.timeOfTrip?.duration.minutes}m
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[#6dbb71]/10 bg-[#08111f]/90 p-4">
                    <p className="text-sm text-[#9aa1b2]">Estimated cost</p>
                    <p className="mt-2 text-2xl font-semibold text-[#6dbb71] audiowide">
                      ₦{routeData?.amount ?? "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#6dbb71]/10 bg-[#08111f]/90 p-5 max-w-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6dbb71]/15 text-[#6dbb71]">
                      {routeData?.transportMode === "BIKE" ? (
                        <Motorbike size={20} />
                      ) : routeData?.transportMode === "KEKE" ? (
                        <Forklift size={20} />
                      ) : (
                        <Bus size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-[#9aa1b2]">Mode</p>
                      <p className="text-sm font-semibold text-[#6dbb71]">
                        {routeData?.transportMode ?? "N/A"}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#6dbb71]/10 px-3 py-1 text-sm text-[#a8d5ab]">
                    Start: {routeData?.timeOfTrip?.start ? `${routeData.timeOfTrip.start} - ` : "N/A"}
                    End: {routeData?.timeOfTrip?.end ? ` ${routeData.timeOfTrip.end}` : " N/A"}
                  </span>
                </div>
                <div className="mt-6 rounded-3xl border border-[#ffffff]/10 bg-[#0d1325]/95 p-4">
                  <p className="text-sm text-[#9aa1b2]">Contributed by</p>
                  <p className="mt-2 text-sm font-semibold text-[#6dbb71]">
                    {routeData?.contributor ?? "Anonymous"}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RoutesMap;
