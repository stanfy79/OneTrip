import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../context/Context";
import NavBar from "../components/NavBar";
import {
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  Timer,
  Settings,
  CircleDollarSign,
  ArrowLeftRight,
  Target,
} from "lucide-react";

function Dashboard() {
  const { user, submittedData } = useContext(DataContext);

  const [dashboardData] = useState({
    point: 120,
    totalFareSpent: 14000,
    badges: ["Elite Scout"],
    rankings: {
      position: 1,
      topRoutes: 0,
      routesSubmitted: 28,
      followers: 0,
    },
    topPeers: [
      {
        id: 1,
        name: "Alex Johnson",
        avatar: "👤",
        score: 2500,
        routes: 35,
      },
      {
        id: 2,
        name: "Maria Garcia",
        avatar: "👤",
        score: 2300,
        routes: 32,
      },
      {
        id: 3,
        name: "James Chen",
        avatar: "👤",
        score: 2100,
        routes: 28,
      },
    ],
    recentSubmissions: [
      {
        id: 1,
        title: "Opeolu to Ikoyi - Faster",
        timestamp: "2 days ago",
        status: "verified",
      },
      {
        id: 2,
        title: "Ajah Bypass + BGT",
        timestamp: "3 days ago",
        status: "verified",
      },
      {
        id: 3,
        title: "Lekki - Epe Expressway",
        timestamp: "5 days ago",
        status: "verified",
      },
    ],
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-br from-neutral-900 to-slate-800 p-6">
        {/* Profile Header */}
        <div className="mb-10 mt-20">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full text-white bg-[#111412] font-extrabold flex items-center justify-center text-3xl border-2 border-[#719672b9]">
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

              {/* User Info */}
              <div className="pt-2">
                <h1 className="text-white text-2xl font-bold">
                  {user?.username || "User"}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Exploring routes through data, intelligence, & infrastructure
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="bg-[#6dbb71] text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                    Elite Scout
                  </span>
                </div>
              </div>
            </div>
            <Link to="/settings">
              <div className="flex gap-2 items-center hover:bg-[#6dbb711c] transition-colors p-2 rounded-full">
                <Settings size={30} color="#6dbb71" />
              </div>
            </Link>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Primary Balance Card */}
          <div className="lg:col-span-1 rounded-xl p-6 border border-[#6dbb71] shadow-xl">
            <p className="text-gray-400 text-sm font-semibold mb-2">
              TOTAL EARNINGS
            </p>
            <h2 className="text-white text-4xl font-bold mb-4 audiowide">
              ✨ {user?.points || 0}
            </h2>
            <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
              <div
                className="bg-[#6dbb71] h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-[#99a39a] text-xs flex items-center gap-1">
              <TrendingUp size={14} /> Reach 1000 points to unlock Tier 4
              rewards
            </p>
          </div>

          {/* Elite Scout Badge Card */}
          <div className="lg:col-span-1 bg-[#6dbb71] rounded-xl p-6 shadow-xl transform hover:scale-105 transition-transform">
            <Award size={32} className="text-green-900 mb-3" />
            <h3 className="text-green-900 text-lg font-bold">Elite Scout</h3>
            <p className="text-green-800 text-sm mt-2">
              Top contributor status unlocked for excellent route submissions
            </p>
            <div className="mt-4 text-green-900 text-sm font-semibold">
              Tier 3 • 🏆
            </div>
          </div>

          {/* Total Spent */}
          <div className="lg:col-span-1 rounded-xl p-6 border border-[#6dbb71] shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold mb-2">
                  TOTAL FARE SPENT
                </p>
                <h2 className="text-white text-3xl audiowide font-bold">
                  ₦{user?.totalSpent?.toLocaleString()}
                </h2>
                <p className="text-gray-400 text-xs mt-2">
                  Total amount spent on rides
                </p>
              </div>
              <CircleDollarSign
                size={48}
                className="text-[#6dbb71] opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Rankings and Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#00000049] rounded-lg p-4 border border-slate-700">
            <p className="text-gray-400 text-xs font-semibold mb-2">
              YOUR RANK
            </p>
            <p className="text-[#6dbb71] text-2xl font-bold">
              #{dashboardData.rankings.position}
            </p>
            <p className="text-gray-500 text-xs mt-1">Global</p>
          </div>

          <div className="bg-[#00000049] rounded-lg p-4 border border-slate-700">
            <p className="text-gray-400 text-xs font-semibold mb-2">
              TOP ROUTES
            </p>
            <p className="text-[#6dbb71] text-2xl font-bold">
              #{dashboardData.rankings.topRoutes}
            </p>
            <p className="text-gray-500 text-xs mt-1">Popular</p>
          </div>

          <div className="bg-[#00000049] rounded-lg p-4 border border-slate-700">
            <p className="text-gray-400 text-xs font-semibold mb-2">
              SUBMISSIONS
            </p>
            <p className="text-[#6dbb71] text-2xl font-bold">
              #{user?.contribution}
            </p>
            <p className="text-gray-500 text-xs mt-1">Total</p>
          </div>

          <div className="bg-[#00000049] rounded-lg p-4 border border-slate-700">
            <p className="text-gray-400 text-xs font-semibold mb-2">
              FOLLOWERS
            </p>
            <p className="text-[#6dbb71] text-2xl font-bold">
              {(dashboardData.rankings.followers / 1000).toFixed(1)}k
            </p>
            <p className="text-gray-500 text-xs mt-1">Community</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Peers */}
          <div className="bg-[#00000049] rounded-xl p-6 border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
              <Users size={20} className="text-[#6dbb71]" />
              <h3 className="text-white font-bold text-lg">Top Peers</h3>
            </div>

            <div className="space-y-4">
              {dashboardData.topPeers.map((peer, index) => (
                <div
                  key={peer.id}
                  className="flex items-center justify-between p-3 bg-[#7b7b7b1e] rounded-lg hover:bg-[#7b7b7b3a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6dbb71] flex items-center justify-center text-sm font-bold text-green-900">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {peer.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {peer.routes} routes
                      </p>
                    </div>
                  </div>
                  <p className="text-[#6dbb71] font-bold">
                    {peer.score.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Verified Submissions */}
          <div className="bg-tranparent rounded-xl p-3 border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle size={20} className="text-[#6dbb71]" />
              <h3 className="text-white font-bold text-lg">
                Recent Verified Submissions
              </h3>
            </div>

            <div className="">
              {submittedData
                .filter((entry) => entry.contributor === user?.username)
                .slice(0, 5)
                .toReversed()
                .map((entry, key) => (
                  <div
                    key={key}
                    className="relative p-3 bg-[#00000049] border border-[#6dbb7163] rounded-2xl flex flex-col max-w-[700px] w-full hover:bg-[#00000069]/60 hover:scale-90 transition scale-85"
                  >
                    <div className="flex gap-2 items-center text-zinc-300 text-[12px]">
                      <Timer size={15} color="#6dbb71" />
                      <p className="flex gap-3 items-center">
                        {entry?.timeOfTrip?.duration?.hours > 0
                          ? `${entry?.timeOfTrip?.duration?.hours} hr, `
                          : ""}
                        {entry?.timeOfTrip?.duration?.minutes} min
                      </p>
                      <span className="absolute right-3 top-2 bg-[#6dbb7140] text-[#6dbb71] text-xs px-2 py-1 rounded font-semibold">
                        ✓ Verified
                      </span>
                    </div>

                    <div className="w-full flex justify-between items-center">
                      <div className="w-[70%] flex flex-col py-2">
                        <div className="w-full flex justify-between items-center text-[#a4b5a4] text-[12px]">
                          <p className="">{entry?.from}</p>
                          <ArrowLeftRight
                            size={30}
                            color="#b14b6f"
                            className="w-full"
                          />
                          <p className="">{entry?.to}</p>
                        </div>
                      </div>
                      <div className="text-[#a4b5a4] text-[16px] audiowide">
                        Cost:
                        <span className="text-[#6dbb71] text-[16px] audiowide ml-2">
                          ₦{entry?.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
