import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Disc, MapPin } from "lucide-react";
import { DataContext } from "../context/Context";
import LoaderImg from "../assets/loader-gif.png";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_KEY;

function CheckRoute() {
  const { fetchCoordinates, getRouteInfo, newRouteEntry, user, searchResult } =
    useContext(DataContext);
  const [current, setCurrent] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState({ origin: [], dest: [] });
  const [showSuggest, setShowSuggest] = useState({
    origin: false,
    dest: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const fetchSuggestions = async (query, type) => {
    if (query.length < 3) {
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
      return;
    }

    try {
      const res = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}&language=en&access_token=${MAPBOX_TOKEN}&session_token=12345&limit=5&country=ng`,
      );
      const data = await res.json();
      setSuggestions((prev) => ({ ...prev, [type]: data.suggestions || [] }));
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(
      () => fetchSuggestions(current, "origin"),
      300,
    );
    return () => clearTimeout(timeoutId);
  }, [current]);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => fetchSuggestions(destination, "dest"),
      300,
    );
    return () => clearTimeout(timeoutId);
  }, [destination]);

  const handleSelect = (name, type) => {
    if (type === "origin") {
      setCurrent(name);
      setShowSuggest((prev) => ({ ...prev, origin: false }));
    } else {
      setDestination(name);
      setShowSuggest((prev) => ({ ...prev, dest: false }));
    }
  };


  const getRoute = async (e) => {
    e.preventDefault();
    if (!current || !destination) return;
    setLoading(true);

    try {
      const coords = await fetchCoordinates(current, destination);
      const start = coords?.current?.[0];
      const end = coords?.destination?.[0];

      if (!start || !end) {
        throw new Error("Unable to resolve route coordinates.");
      }

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lon},${start.lat};${end.lon},${end.lat}?steps=false&annotations=distance%2Cduration&geometries=geojson&access_token=${MAPBOX_TOKEN}`,
      );
      const json = await query.json();
      const data = json.routes[0];

      if (!data) {
        throw new Error("Unable to fetch route details.");
      }

      const distanceKm = (data.distance / 1000).toFixed(1);
      const hours = parseInt(Math.floor(data.duration / 3600));
      const minutes = parseInt(Math.floor((data.duration % 3600) / 60));
      const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
      const routeDetails = getRouteInfo(parseInt(distanceKm), duration);

      const key = Math.random().toString(36).substring(2, 8).toUpperCase();
      const now = new Date();

      const newEntry = {
        from: current.toUpperCase(),
        to: destination.toUpperCase(),
        date: now.toLocaleDateString("en-NG", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        time: now
          .toLocaleTimeString("en-NG", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toUpperCase(),
        routeDetails,
        Key: key,
        contributor: user.username || "Anonymous",
      };
      newRouteEntry(newEntry);

      navigate(`/search-result?key=${key}`);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-[400px] w-[90%] bg-[#00000090] backdrop-blur-sm rounded-3xl z-20">
      <h2 className="text-3xl text-white">
        Where are you <br />
        headed today?
      </h2>
      <form className="flex flex-col gap-2 mt-7" onSubmit={getRoute}>
        {/* ORIGIN */}
        <label className="text-[#6dbb71] text-[10px]">ORIGIN</label>
        <div className="relative">
          <div className="flex gap-4 p-3.5 bg-[#232b3d] rounded-3xl">
            <Disc size={"20"} color="#6dbb71" />
            <input
              type="text"
              value={current}
              placeholder="Current Location (Yaba)"
              className="text-white bg-transparent border-none outline-none w-full"
              onChange={(e) => {
                setCurrent(e.target.value);
                setShowSuggest({ ...showSuggest, origin: true });
              }}
            />
          </div>
          {showSuggest.origin && suggestions.origin.length > 0 && (
            <ul className="absolute z-50 w-full bg-[#1a2130] mt-2 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
              {suggestions.origin.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(s.name, "origin")}
                  className="p-3 text-sm text-gray-200 hover:bg-[#6dbb71] hover:text-black cursor-pointer border-b border-gray-800 last:border-none"
                >
                  {s.name}{" "}
                  <span className="text-[10px] opacity-60 block">
                    {s.full_address}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* DESTINATION */}
        <label className="text-[#6dbb71] text-[10px]">DESTINATION</label>
        <div className="relative">
          <div className="flex gap-4 p-3.5 bg-[#232b3d] rounded-3xl">
            <MapPin size={"20"} color="#6dbb71" />
            <input
              type="text"
              value={destination}
              placeholder="Where to? (Oshodi)"
              className="text-white bg-transparent border-none outline-none w-full"
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggest({ ...showSuggest, dest: true });
              }}
            />
          </div>
          {showSuggest.dest && suggestions.dest.length > 0 && (
            <ul className="absolute z-50 w-full bg-[#1a2130] mt-2 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
              {suggestions.dest.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(s.name, "dest")}
                  className="p-3 text-sm text-gray-200 hover:bg-[#6dbb71] hover:text-black cursor-pointer border-b border-gray-800 last:border-none"
                >
                  {s.name}{" "}
                  <span className="text-[10px] opacity-60 block">
                    {s.full_address}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="p-3.5 bg-[#6dbb71] text-black flex gap-3 justify-center items-center rounded-3xl mt-3 font-bold"
        >
          {loading ? (
            <img src={LoaderImg} className="w-[25px]" alt="..." />
          ) : (
            "Check Fare"
          )}
          <Search size={"20"} />
        </button>
      </form>
    </div>
  );
}

export default CheckRoute;
