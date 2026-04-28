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
  User,
  MessageSquare,
  Send,
} from "lucide-react";
import NavBar from "../components/NavBar";
import BackButton from "../components/BackButton";
import CommentList from "../components/CommentList";

function RoutesMap() {
  const location = useLocation();
  const mapContainerRef = useRef();
  const [mapInfo, setMapInfo] = useState(null);
  const mapRef = useRef(null);
  const [routeData, setRouteData] = useState(null);
  const [coordinates, setCoordinates] = useState({
    current: null,
    destination: null,
  });
  const [input, setInput] = useState("");
  const [comment, setComment] = useState();
  const { fetchCoordinates, user, getRouteInfo, getAllUsers, postComment, getComments, allComments } = useContext(DataContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const routeId = JSON.parse(params.get("key"));

    getComments(routeId._id);
    getAllUsers();
  }, []);

  const generateSecureToken = (length = 32) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);

    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!input.trim()) return;

      const params = new URLSearchParams(location.search);
      const routeId = JSON.parse(params.get("key"));
      const id = generateSecureToken(16);

      const commentData = {
        content: input,
        routeId: routeId._id,
        username: user.username || "Anonymous",
        profileUrl: user.profileUrl,
      };

      setComment(commentData);
      postComment(commentData);
      console.log("Submitting comment:", JSON.stringify(comment));
      setInput("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jsonString = params.get("key");

    if (jsonString) {
      try {
        const data = JSON.parse(jsonString);
        setRouteData(data);
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

        // console.log("MapInfo Data:", data);

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

  // window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#050c1d] text-white">
      <NavBar />
      <main className="">
        <section className="mx-auto max-w-7xl mt-20 px-5 py-8 lg:px-10 xl:px-16">
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
                <div id="map-container" ref={mapContainerRef} className="w-[400px" style={{ height: "400px", width: "100%" }} />
              </div>
            </div>

            <aside className="space-y-6 rounded-4xl border border-[#6dbb71]/15 bg-[#0d1325]/95 p-6">
              <div className="rounded-3xl">
                <p className="text-xs uppercase tracking-[0.24em] text-[#6dbb71]">
                  Travel metrics
                </p>
                <div className="mt-5 grid gap-4 max-w-lg">
                  <div className="rounded-3xl border border-[#6dbb71]/10 bg-[#08111f]/90 p-4">
                    <p className="text-sm text-[#9aa1b2]">Distance</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {routeData?.routeDetails?.distance ?? "--"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[#6dbb71]/10 bg-[#08111f]/90 p-4">
                    <p className="text-sm text-[#9aa1b2]">Duration</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {routeData?.routeDetails?.duration ?? "--"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[#6dbb71]/10 bg-[#08111f]/90 p-4">
                    <p className="text-sm text-[#9aa1b2]">Estimated cost</p>
                    <p className="mt-2 text-2xl font-semibold text-[#6dbb71] audiowide">
                      ₦{routeData?.routeDetails?.estimatedCost ?? "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#6dbb71]/10 bg-[#08111f]/90 p-5 max-w-lg">
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
                      <p className="text-lg font-semibold text-white">
                        {routeData?.transportMode ?? "N/A"}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#6dbb71]/10 px-3 py-1 text-sm text-[#a8d5ab]">
                    {routeData?.date ?? "No date"}
                  </span>
                </div>
                <div className="mt-6 rounded-3xl border border-[#ffffff]/10 bg-[#0d1325]/95 p-4">
                  <p className="text-sm text-[#9aa1b2]">Contributed by</p>
                  <p className="mt-2 text-sm font-semibold text-[#6dbb71]">
                    {routeData?.contributor ?? "Unknown"}
                  </p>
                </div>
              </div>
            </aside>

            <form onSubmit={handleCommentSubmit} className="mt-6 border-t border-slate-100 pt-4">
              <label className="mb-2 block text-sm font-semibold text-slate-400">
                Add a Note or Feedback
              </label>

              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Is the traffic bad? Road closed? Let others know..."
                  rows="5"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-gray-700 px-4 py-3 text-sm text-white transition focus:border-[#6dbb71] focus:outline-none focus:ring-2 focus:ring-[#6dbb71]/30"
                />

                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#6dbb71] text-white transition hover:bg-[#5aa85e] disabled:bg-slate-300 shadow-lg shadow-[#6dbb71]/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </section>

        <div className="bg-gray-800 my-20">
          {comment && (
            <div
              key={comment.CommentId || comment._id}
              className="flex gap-3 bg-slate-900 p-4 shadow-sm border-slate-100 transition hover:bg-slate-900/60 min-h-25"
            >
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                {comment.profileUrl ? (
                  <img
                    src={comment.profileUrl}
                    alt={comment.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">
                    {comment.username}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {new Date(new Date().toISOString()).toLocaleDateString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="mt-1 text-sm leading-relaxed text-slate-300 max-w-130">
                  {comment.content}
                </p>
              </div>
            </div>
          )}
          <CommentList comments={allComments} />
        </div>
      </main>
    </div>
  );
}

export default RoutesMap;
