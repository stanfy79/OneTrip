import { useState, useContext, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { DataContext } from "../context/Context";
import NavBar from "../components/NavBar";
import {
  Search,
  Disc,
  MapPin,
  Bus,
  Timer,
  Motorbike,
  Forklift,
  CircleCheckBig,
} from "lucide-react";
import PopularRoutes from "../components/PopularRoutes";
import { useAuth } from "../context/AuthContext";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnVpbGRkdWRlIiwiYSI6ImNtbms4bTg5czBubjMycHFybjJ6OXlvbzkifQ.1ZXXfIP8Z3Ee_YSJ-GtQZQ";

function SubmitRoute() {
  const { getFareData, newDataEntry, user, submitStatus, setUserActivities } =
    useContext(DataContext);
  const [transportMode, setTransportMode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [current, setCurrent] = useState("");
  const [destination, setDestination] = useState("");
  const [timeUnit, setTimeUnit] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [validationError, setValidationError] = useState("");
  const [suggestions, setSuggestions] = useState({ origin: [], dest: [] });
  const [showSuggest, setShowSuggest] = useState({
    origin: false,
    dest: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useAuth();
  const dialogReff = useRef();

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

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    if (!auth.token) {
      setValidationError("Please login to submit a contribution.");
      setIsSubmitting(false);
      return <Navigate to="/auth?mode=login" />;
    }
    if (!transportMode || !selectedTime) {
      setValidationError(
        "Please select a transport mode, time of trip, and time unit.",
      );
      setIsSubmitting(false);
      return;
    }

    function getDuration(start, end) {
      const [startH, startM] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);

      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      const diff = endTotal - startTotal;

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      return { hours, minutes };
    }
    const duration = getDuration(startTime, endTime);

    const form = e.target;
    const newEntry = {
      from: form.origin.value.toUpperCase(),
      to: form.destination.value.toUpperCase(),
      transportMode: transportMode.toUpperCase(),
      amount: form.amount.value,
      contributor: user.username || "Anonymous",
      timeOfTrip: {
        start: startTime,
        end: endTime,
        timeUnit: timeUnit,
        duration: duration,
      },
      timeOfDay: selectedTime,
    };
    setValidationError("");
    // form.reset();
    newDataEntry(newEntry);
    setUserActivities()
    console.log(submitStatus)
    if (submitStatus) {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-row mb-30">
      <NavBar />
      <div className="p-6 mt-30 w-full flex flex-col items-center">
        {isSubmitted && (
          <div
            className="fixed w-[95%] max-w-90 h-50 rounded-3xl bg-[#6dbb71]/20 backdrop-blur-[5px] border border-[#6dbb71]/30 flex flex-col items-center justify-center gap-4 z-10 reveal-up revealed"
            ref={dialogReff}
          >
            <CircleCheckBig size={50} color="#6dbb71" />
            <span className="text-white font-mono text-lg">
              Contribution Submitted!
            </span>
            <button
              type="button"
              className="w-[90%] text-white bg-[#6dbb71] hover:bg-[#5ca961] py-2 px-4 rounded-lg"
              onClick={() => (dialogReff.current.style.display = "none")}
            >
              Continue
            </button>
          </div>
        )}

        <h1 className="text-white text-4xl audiowide">
          Contribute to FareData
        </h1>
        <p className="text-[#808387] text-[14px]">
          Help fellow commuters by sharing what you paid today.
        </p>

        <div className="w-[100%] max-w-[500px] mt-10 text-[14px]">
          <form
            className="p-5 rounded-3xl flex flex-col gap-2 mt-7 bg-[#6dbb71]/20 backdrop-blur-[50px] border-[#6dbb7177] border-[1px]"
            onSubmit={handleSubmit}
          >
            <label htmlFor="origin" className="text-[#6dbb71] text-[10px]">
              ORIGIN
            </label>
            <div className="relative">
              <div className="flex gap-4 p-3.5 bg-[#000000] rounded-3xl">
                <Disc size={"20"} color="#6dbb71" />
                <input
                  type="text"
                  name="origin"
                  value={current}
                  placeholder="Current Location (Yaba)"
                  className="text-[#ffffff] border-none outline-none w-full"
                  onChange={(e) => {
                    setCurrent(e.target.value);
                    setShowSuggest({ ...showSuggest, origin: true });
                  }}
                  required
                />
                {showSuggest.origin && suggestions.origin.length > 0 && (
                  <ul className="absolute z-50 w-full bg-[#1a2130] mt-10 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
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
            </div>

            <label htmlFor="destination" className="text-[#6dbb71] text-[10px]">
              DESTINATION
            </label>
            <div className="relative">
              <div className="flex gap-4 p-3.5 bg-[#000000] rounded-3xl">
                <MapPin size={"20"} color="#6dbb71" />
                <input
                  type="text"
                  placeholder="Where to? (Oshodi)"
                  value={destination}
                  name="destination"
                  className="text-white border-none outline-none w-full"
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggest({ ...showSuggest, dest: true });
                  }}
                  required
                />
                {showSuggest.dest && suggestions.dest.length > 0 && (
                  <ul className="absolute z-20 w-full bg-[#1a2130] mt-10 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
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
            </div>

            <label
              htmlFor="transport-mode"
              className="text-[#6dbb71] text-[10px] mt-10"
            >
              TRANSPORT MODE
            </label>
            <div className="flex gap-4 rounded-3xl text-[14px]">
              <div
                className={`w-full h-20 border-[#6dbb7177] bg-[#0F172A] text-white ${transportMode === "Danfo" ? "border-2" : "border-none"} rounded-3xl justify-center flex flex-col items-center hover:bg-[#141d3077] cursor-pointer gap-2`}
                onClick={() => setTransportMode("Danfo")}
              >
                <Bus size={30} color="#6dbb71" />
                Danfo
              </div>
              <div
                className={`w-full h-20 border-[#6dbb7177] bg-[#0F172A] text-white ${transportMode === "Keke" ? "border-2" : "border-none"} rounded-3xl justify-center flex flex-col items-center hover:bg-[#141d3077] cursor-pointer gap-2`}
                onClick={() => setTransportMode("Keke")}
              >
                <Forklift size={30} color="#6dbb71" />
                Keke
              </div>
              <div
                className={`w-full h-20 border-[#6dbb7177] bg-[#0F172A] text-white ${transportMode === "Bike" ? "border-2" : "border-none"} rounded-3xl justify-center flex flex-col items-center hover:bg-[#141d3077] cursor-pointer gap-2`}
                onClick={() => setTransportMode("Bike")}
              >
                <Motorbike size={30} color="#6dbb71" />
                Bike
              </div>
            </div>

            <label
              htmlFor="amount"
              className="text-[#6dbb71] text-[10px] mt-10"
            >
              FARE AMOUNT
            </label>
            <div className="flex place-items-center gap-4 px-4 bg-[#0f172a] text-[#6dbb71] text-2xl rounded-3xl">
              ₦
              <input
                type="number"
                placeholder="0.00"
                name="amount"
                className="text-white text-[25px] border-none outline-none no-scrollbar py-4 w-full"
                required
              />
            </div>

            <label
              htmlFor="transport-mode"
              className="text-[#6dbb71] text-[10px] mt-10"
            >
              TIME TAKEN
            </label>
            <div className="place-items-center p-4 bg-[#0F172A] rounded-3xl">
              <span className="text-[#bfc9bf] text-[15px] gap-2 flex items-center ml-2 float-left">
                <Timer size={"25"} color="#6dbb71" />
                Start time - End time
              </span>
              <div className="flex gap-4 place-items-center w-full mt-3">
                <input
                  type="time"
                  placeholder="10:00 AM"
                  name="timeTaken"
                  className="text-white text-[18px] border-b border-[#6dbb7177] border-b-2   outline-none no-scrollbar py-2 w-full"
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
                <input
                  type="time"
                  placeholder="10:45 AM"
                  name="timeTaken"
                  className="text-white text-[18px] border-b border-[#6dbb7177] border-b-2   outline-none no-scrollbar py-2 w-full"
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <label
              htmlFor="transport-mode"
              className="text-[#6dbb71] text-[10px] mt-10"
            >
              TIME OF TRIP
            </label>
            <div className="flex gap-4 p-3.5 bg-[#0F172A] rounded-3xl">
              <div
                className={`w-full border-[#6dbb71] ${selectedTime === "Morning" ? "bg-[#6dbb71] text-black" : "text-[#bfc9bf]"} rounded-3xl p-2 justify-center flex flex-col items-center hover:bg-[#313f5da4] hover:text-[#6dbb71] cursor-pointer gap-2`}
                onClick={() => setSelectedTime("Morning")}
              >
                Morning
              </div>
              <div
                className={`w-full border-[#6dbb71] ${selectedTime === "Afternoon" ? "bg-[#6dbb71] text-black" : "text-[#bfc9bf]"} rounded-3xl p-2 justify-center flex flex-col items-center hover:bg-[#313f5da4] hover:text-[#6dbb71] cursor-pointer gap-2`}
                onClick={() => setSelectedTime("Afternoon")}
              >
                Afternoon
              </div>
              <div
                className={`w-full border-[#6dbb71] ${selectedTime === "Evening" ? "bg-[#6dbb71] text-black" : "text-[#bfc9bf]"} rounded-3xl p-2 justify-center flex flex-col items-center hover:bg-[#313f5da4] hover:text-[#6dbb71] cursor-pointer gap-2`}
                onClick={() => setSelectedTime("Evening")}
              >
                Evening
              </div>
            </div>

            {validationError && (
              <p className="text-red-300 mt-2.5 text-[12px] mt-2">
                {validationError}
              </p>
            )}

            <button
              type="submit"
              className="p-3.5 bg-transparent border-2 border-[#6dbb71] text-white font-bold rounded-3xl mt-5 hover:bg-[#447a4782] cursor-pointer"
            >
              {auth.token
                ? isSubmitting
                  ? "Submitting..."
                  : "Submit Contribution"
                : "Login to Submit"}
            </button>
          </form>
        </div>
        <div className="mt-30 border-t-2 border-[#6dbb7174] pt-10 w-full">
          <PopularRoutes />
        </div>
      </div>
    </div>
  );
}

export default SubmitRoute;
