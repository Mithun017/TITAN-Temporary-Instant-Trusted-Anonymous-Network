"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUserProfileStore } from "@/stores/userProfileStore";
import { TopBar } from "@/components/shell/TopBar";
import {
  MapPin,
  Globe,
  Github,
  Linkedin,
  Share2,
  Eye,
  CheckSquare,
  MessageSquare,
  Star,
  ChevronRight,
  Shield,
  Award,
  Flame,
  Calendar,
  ExternalLink,
  Edit3,
} from "lucide-react";

export function UserProfileView({ usernameParam }: { usernameParam?: string }) {
  const profile = useUserProfileStore();
  const { openModal } = profile;
  const [activeTab, setActiveTab] = useState<"recent" | "list" | "solutions" | "discuss">("recent");

  // Heatmap generation: 52 weeks x 7 days
  const weeks = 52;
  const days = 7;
  const generateTile = (w: number, d: number) => {
    // Generate realistic active distribution matching ~332 active days
    const seed = (w * 7 + d * 13) % 100;
    if (seed < 20) return "bg-[#282828]"; // inactive
    if (seed < 45) return "bg-[#0e4429]"; // level 1
    if (seed < 70) return "bg-[#006d32]"; // level 2
    if (seed < 90) return "bg-[#26a641]"; // level 3
    return "bg-[#39d353]"; // level 4
  };

  const currentUsername = usernameParam || profile.username || "Mithun1706";

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f3] select-none font-sans">
      <TopBar />

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* ================= LEFT COLUMN: User Card & Bio ================= */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-4">
          {/* Main User Card */}
          <div className="bg-[#242424] border border-[#333333] rounded-2xl p-5 space-y-4">
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#444] bg-[#2d2d2d] shrink-0 shadow-md">
                <img
                  src={profile.avatarUrl || "/avatar.png"}
                  alt={profile.realName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).src = "https://assets.leetcode.com/users/avatars/avatar_default.png";
                  }}
                />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-base text-white truncate">{profile.realName}</h1>
                  <span className="text-cyan-400 text-xs">💎</span>
                </div>
                <div className="text-xs text-[#8a8a8a]">{profile.username}</div>
                <div className="text-xs text-white font-medium pt-1.5 flex items-center gap-1">
                  <span className="text-[#8a8a8a]">Rank</span>
                  <span>{profile.rank}</span>
                </div>
              </div>
            </div>

            {/* Followers Row */}
            <div className="flex items-center gap-4 text-xs text-[#8a8a8a] pt-1">
              <div>
                <span className="font-semibold text-white">{profile.following}</span> Following
              </div>
              <div>
                <span className="font-semibold text-white">{profile.followers}</span> Followers
              </div>
            </div>

            {/* Edit / Switch Profile Button */}
            <button
              onClick={openModal}
              className="w-full py-2 px-3 rounded-xl bg-[#2ebd59]/15 hover:bg-[#2ebd59]/25 text-[#2ebd59] border border-[#2ebd59]/30 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile / Switch Account</span>
            </button>

            {/* Links & Location */}
            <div className="space-y-2.5 pt-2 border-t border-[#333333] text-xs text-[#a0a0a0]">
              <div className="flex items-center gap-2.5 hover:text-white">
                <MapPin className="w-4 h-4 text-[#8a8a8a]" />
                <span>{profile.location}</span>
              </div>
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-[#3880ff] truncate transition-colors"
              >
                <Globe className="w-4 h-4 text-[#8a8a8a]" />
                <span className="truncate">{profile.portfolio}</span>
              </a>
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 text-[#8a8a8a]" />
                <span>{profile.github}</span>
              </a>
              <a
                href={`https://linkedin.com/in/${profile.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4 text-[#8a8a8a]" />
                <span>{profile.linkedin}</span>
              </a>
            </div>

            {/* Community Stats */}
            <div className="pt-3 border-t border-[#333333] space-y-2">
              <div className="text-xs font-semibold text-white">Community Stats</div>
              <div className="space-y-1.5 text-xs text-[#8a8a8a]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sky-400">
                    <Eye className="w-3.5 h-3.5" /> Views
                  </span>
                  <span className="font-semibold text-white">{profile.viewsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#2ebd59]">
                    <CheckSquare className="w-3.5 h-3.5" /> Solution
                  </span>
                  <span className="font-semibold text-white">{profile.solutionsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-amber-400">
                    <Star className="w-3.5 h-3.5" /> Reputation
                  </span>
                  <span className="font-semibold text-white">{profile.reputationCount}</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="pt-3 border-t border-[#333333] space-y-2">
              <div className="text-xs font-semibold text-white">Languages</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#1f1f1f] text-[#8a8a8a] font-mono text-[11px]">
                    Python3
                  </span>
                  <span className="text-[#a0a0a0]">
                    <strong className="text-white">{profile.python3Solved}</strong> problems solved
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#1f1f1f] text-[#8a8a8a] font-mono text-[11px]">
                    Python
                  </span>
                  <span className="text-[#a0a0a0]">
                    <strong className="text-white">{profile.pythonSolved}</strong> problems solved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Contest, Solved Stats & Heatmap ================= */}
        <div className="flex-1 space-y-4">
          {/* Top: Contest Rating Card */}
          <div className="bg-[#242424] border border-[#333333] rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#333333]">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs text-[#8a8a8a]">Contest Rating</div>
                  <div className="text-2xl font-bold text-white font-mono">{profile.contestRating.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-950/40 border border-sky-800/40 text-sky-400 text-xs font-bold">
                  <Shield className="w-4 h-4 fill-current" />
                  <span>Level {profile.contestLevel}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <div className="text-[#8a8a8a]">Global Ranking</div>
                  <div className="font-semibold text-white font-mono">{profile.globalRanking}</div>
                </div>
                <div>
                  <div className="text-[#8a8a8a]">Attended</div>
                  <div className="font-semibold text-white font-mono">{profile.attendedContests}</div>
                </div>
                <div>
                  <div className="text-[#8a8a8a]">Top</div>
                  <div className="font-semibold text-[#ffa116] font-mono">{profile.topPercentage}</div>
                </div>
              </div>
            </div>

            {/* Contest Rating SVG Curve */}
            <div className="pt-4 h-36 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 600 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffa116" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ffa116" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M0,100 Q150,90 280,60 T480,30 T600,15 L600,120 L0,120 Z"
                  fill="url(#curveGradient)"
                />
                {/* Line curve */}
                <path
                  d="M0,100 Q150,90 280,60 T480,30 T600,15"
                  fill="none"
                  stroke="#ffa116"
                  strokeWidth="2.5"
                />
                {/* Current point */}
                <circle cx="600" cy="15" r="4" fill="#ffffff" stroke="#ffa116" strokeWidth="2" />
              </svg>

              <div className="flex justify-between text-[11px] text-[#8a8a8a] pt-1">
                <span>2024</span>
                <span className="text-[#ffa116] font-bold">2,308</span>
                <span>2026</span>
              </div>
            </div>
          </div>

          {/* Middle Row: Solved Circular Stats & Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Solved Card */}
            <div className="bg-[#242424] border border-[#333333] rounded-2xl p-5 flex items-center justify-between gap-4">
              {/* Circular Progress Mockup */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#333333]"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#ffa116]"
                    strokeDasharray="77.29, 100"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold text-white leading-tight font-mono">
                    {profile.acceptanceRate}
                  </span>
                  <span className="text-[10px] text-[#8a8a8a]">Acceptance</span>
                  <span className="text-[9px] text-[#8a8a8a]">{profile.totalSubmissions}</span>
                </div>
              </div>

              {/* Solved Breakdown by Difficulty */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#1e1e1e]">
                  <span className="text-[#00b8a3] font-semibold">Easy</span>
                  <span className="font-mono text-white">
                    <strong>{profile.easySolved}</strong>
                    <span className="text-[#8a8a8a]">/{profile.easyTotal}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#1e1e1e]">
                  <span className="text-[#ffc01e] font-semibold">Med.</span>
                  <span className="font-mono text-white">
                    <strong>{profile.medSolved}</strong>
                    <span className="text-[#8a8a8a]">/{profile.medTotal}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#1e1e1e]">
                  <span className="text-[#ff375f] font-semibold">Hard</span>
                  <span className="font-mono text-white">
                    <strong>{profile.hardSolved}</strong>
                    <span className="text-[#8a8a8a]">/{profile.hardTotal}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Badges Card */}
            <div className="bg-[#242424] border border-[#333333] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#8a8a8a]">Badges</div>
                  <div className="text-2xl font-bold text-white font-mono">{profile.badgesCount}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#8a8a8a] cursor-pointer hover:text-white" />
              </div>

              {/* Badge Icons Preview */}
              <div className="flex items-center gap-3 py-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-sky-950/40 border border-sky-800/40 flex items-center justify-center text-sky-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400">
                  <Flame className="w-6 h-6" />
                </div>
              </div>

              <div className="text-xs text-[#8a8a8a]">
                Most Recent Badge: <strong className="text-white">{profile.contestLevel}</strong>
              </div>
            </div>
          </div>

          {/* Past One Year Submissions Heatmap */}
          <div className="bg-[#242424] border border-[#333333] rounded-2xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="font-semibold text-white">
                {profile.pastYearSubmissions} submissions in the past one year
              </div>
              <div className="flex items-center gap-4 text-[#8a8a8a]">
                <span>
                  total active days: <strong className="text-white">{profile.totalActiveDays}</strong>
                </span>
                <span>
                  Max streak: <strong className="text-white">{profile.maxStreak}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1e1e1e] text-white">Current ▾</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-1">
              <div className="flex gap-[3px] min-w-[700px]">
                {Array.from({ length: weeks }).map((_, w) => (
                  <div key={w} className="flex flex-col gap-[3px]">
                    {Array.from({ length: days }).map((_, d) => (
                      <div
                        key={d}
                        className={`w-3 h-3 rounded-[2px] transition-transform hover:scale-125 ${generateTile(
                          w,
                          d
                        )}`}
                        title={`Day ${w * 7 + d + 1}: Submissions active`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-[#8a8a8a] pt-1">
              <span>Nov</span>
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>

          {/* Recent Submissions / Activity */}
          <div className="bg-[#242424] border border-[#333333] rounded-2xl overflow-hidden">
            <div className="h-10 bg-[#222222] border-b border-[#333333] px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`py-2.5 font-semibold ${
                    activeTab === "recent" ? "text-white border-b-2 border-white" : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  Recent AC
                </button>
                <button
                  onClick={() => setActiveTab("list")}
                  className={`py-2.5 font-semibold ${
                    activeTab === "list" ? "text-white border-b-2 border-white" : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setActiveTab("solutions")}
                  className={`py-2.5 font-semibold ${
                    activeTab === "solutions" ? "text-white border-b-2 border-white" : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  Solutions
                </button>
                <button
                  onClick={() => setActiveTab("discuss")}
                  className={`py-2.5 font-semibold ${
                    activeTab === "discuss" ? "text-white border-b-2 border-white" : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  Discuss
                </button>
              </div>

              <span className="text-[#8a8a8a] hover:text-white cursor-pointer text-xs">View all submissions &gt;</span>
            </div>

            <div className="divide-y divide-[#2a2a2a]">
              {profile.recentAC.map((ac, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 flex items-center justify-between hover:bg-[#282828] transition-colors cursor-pointer"
                >
                  <Link
                    href={`/problems/${ac.slug}`}
                    className="font-medium text-white hover:text-[#3880ff] transition-colors text-xs"
                  >
                    {ac.title}
                  </Link>
                  <span className="text-xs text-[#8a8a8a]">{ac.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

