import { Link } from "react-router-dom";
import {
  House,
  Map,
  UserRound,
  BadgePlus,
  LogOut,
  ArrowUpRight,
  Settings,
} from "lucide-react";
import "../App.css";
import { useContext, useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { DataContext } from "../context/Context";

function NavBar() {
  const { auth, logout } = useAuth();
  const { user } = useContext(DataContext);
  const [showProfile, setShowProfile] = useState(false);
  // const [user, setUser] = useState(null);
  const activeTab = window.location.pathname;
  const menuRef = useRef(null);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfile &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    // document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="w-[100%] fixed flex justify-between items-center md:hidden top-0 z-30 px-5 h-18 bg-[#00000000] backdrop-blur-[10px]">
        <div className="flex flex-col place-items-start">
          <h2 className="text-[#6dbb71] text-2xl font-extrabold audiowide">
            OneTrip
          </h2>
          <p className="text-[#808387] text-[10px]">The Fastest Route</p>
        </div>

        <div className="flex gap-3.5 py-2 rounded-[50px] bg-[#9a9da314] place-items-center scale-75 -mr-6">
          {auth.token ? (
            <div
              className="flex gap-3.5 py-2 px-4 rounded-[50px] bg-[#9a9da30f] place-items-center hover:scale-102 cursor-pointer transition-transform"
              onClick={() => setShowProfile(true)}
            >
              <div className="w-15 h-15 rounded-full text-white bg-[#111412] font-semibold flex items-center justify-center text-3xl shadow-md shadow-[#6dbb7167] border-2 border-[#719672b9]">
                {user?.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  user?.username?.charAt(0)
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-[#ffffff] text-[14px]">
                  {user?.username || "User"}
                </p>
                <span className="text-[10px] text-[#808387]">
                  Rank ({user?.rank || 0})
                </span>
              </div>
              {showProfile && (
                <div
                  className="absolute top-20 right-0 w-40 bg-[#000000da] rounded-lg p-3 gap-3 flex flex-col gap-2 text-[14px]"
                  ref={menuRef}
                >
                  <span className="text-[#6dbb71] audiowide p-3">
                    ✨{user?.points} Points
                  </span>
                  <Link to="/dashboard">
                    <span className="text-[#9a9da3] flex gap-2 hover:text-[#6dbb71] w-full rounded-lg hover:bg-[#c9e3ca34] p-2">
                      Dashboard <ArrowUpRight />
                    </span>
                  </Link>
                  <Link to="/settings">
                    <span className="text-[#9a9da3] flex gap-2 hover:text-[#6dbb71] w-full rounded-lg hover:bg-[#c9e3ca34] p-2">
                      Settings <Settings />
                    </span>
                  </Link>
                  <span
                    className="text-[#9a9da3] flex gap-2 hover:text-[#6dbb71] w-full rounded-lg hover:bg-[#c9e3ca34] p-2 mt-5"
                    onClick={() => logout()}
                  >
                    <LogOut color="#b14b6f" /> Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <span className="text-[#ffffff] rounded-2xl bg-[#6dbb71] hover:text-[#000000] p-4">
                Login
              </span>
            </Link>
          )}
        </div>
      </div>

      <div className="w-[100%] flex flex-row justify-between place-items-center fixed bottom-0 md:top-0 px-1 md:px-5 py-2 backdrop-blur-[5px] bg-[#00000099] md:bg-[#6dbb7122] z-50 h-18">
        <div className="hidden md:flex flex-col place-items-start">
          <h2 className="text-[#6dbb71] text-2xl font-extrabold audiowide">
            OneTrip
          </h2>
          <p className="text-[#808387] text-[10px]">The Fastest Route</p>
        </div>
        <div className="flex flex-row w-full md:w-auto justify-between text-[14px] md:gap-2 text-[#9a9da3]">
          <Link to="/">
            <span
              className={`flex flex-col place-items-center md:flex-row gap-0 md:gap-2.5 rounded-4xl font-semibold py-2.5 px-5.5 hover:bg-[#c9e3ca29] ${activeTab === "/" ? "md:bg-[#2e7d325f] text-[#6dbb71]" : ""}`}
              onClick={scrollToTop}
            >
              <House size={"20"} />
              <p className="">Home</p>
            </span>
          </Link>
          <Link to="/routes">
            <span
              className={`flex flex-col place-items-center md:flex-row gap-0 md:gap-2.5 rounded-4xl font-semibold py-2.5 px-5.5 hover:bg-[#c9e3ca29] ${activeTab === "/routes" ? "md:bg-[#2e7d325f] text-[#6dbb71]" : ""}`}
              onClick={scrollToTop}
            >
              <Map size={"20"} />
              <p>Routes</p>
            </span>
          </Link>
          <Link to="/submit">
            <span
              className={`flex flex-col place-items-center md:flex-row gap-0 md:gap-2.5 rounded-4xl font-semibold py-2.5 px-5.5 hover:bg-[#c9e3ca29] ${activeTab === "/submit" ? "md:bg-[#2e7d325f] text-[#6dbb71]" : ""}`}
              onClick={scrollToTop}
            >
              <BadgePlus size={"20"} />
              <p>Submit</p>
            </span>
          </Link>
          <Link to="/dashboard">
            <span
              className={`flex flex-col place-items-center md:flex-row gap-0 md:gap-2.5 rounded-4xl font-semibold py-2.5 px-5.5 hover:bg-[#c9e3ca29] ${activeTab === "/dashboard" ? "md:bg-[#2e7d325f] text-[#6dbb71]" : ""}`}
              onClick={scrollToTop}
            >
              <UserRound size={"20"} />
              <p>Profile</p>
            </span>
          </Link>
        </div>
        <div className="flex gap-3.5 py-2 px-4 rounded-[50px] bg-[#9a9da31a] hidden md:flex place-items-center">
          {auth.token ? (
            <div
              className="cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              <div className="flex flex-col">
                <p className="text-[#ffffff] text-[14px]">
                  {user?.username || "User"}
                </p>
                <span className="text-[10px] text-[#808387]">
                  Rank ({user?.rank || 0})
                </span>
              </div>
              {showProfile && (
                <div
                  className="absolute top-20 right-0 w-40 bg-[#000000da] rounded-lg p-3 gap-3 flex flex-col gap-2 text-[14px]"
                  ref={menuRef}
                >
                  <span className="text-[#6dbb71] audiowide p-3">
                    ✨{user?.points} Points
                  </span>
                  <Link to="/dashboard">
                    <span className="text-[#9a9da3] flex gap-2 hover:text-[#6dbb71] w-full rounded-lg hover:bg-[#c9e3ca34] p-2">
                      Dashboard <ArrowUpRight />
                    </span>
                  </Link>
                  <Link to="/settings">
                    <span className="text-[#9a9da3] flex gap-2 hover:text-[#6dbb71] w-full rounded-lg hover:bg-[#c9e3ca34] p-2">
                      Settings <Settings />
                    </span>
                  </Link>
                  <span
                    className="text-[#9a9da3] flex gap-2 hover:text-[#6dbb71] w-full rounded-lg hover:bg-[#c9e3ca34] p-2 mt-5"
                    onClick={() => logout()}
                  >
                    <LogOut color="#b14b6f" /> Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <span className="text-[#ffffff] rounded-3xl bg-[#6dbb71] hover:text-[#000000] p-4">
                Login
              </span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default NavBar;
