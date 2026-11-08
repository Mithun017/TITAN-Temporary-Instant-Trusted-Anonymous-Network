"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRoomStore } from "@/stores/roomStore";
import {
  Search,
  SlidersHorizontal,
  Shuffle,
  CheckCircle2,
  Lock,
  Star,
  PlaySquare,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  BookOpen,
  Compass,
  Scroll,
  Plus,
  Globe,
  Flame,
  Award,
  Users,
  HelpCircle,
  Code2,
  Database,
  Terminal,
  Cpu,
  Layers,
} from "lucide-react";

interface ProblemItem {
  id: number;
  title: string;
  slug: string;
  acceptance: string;
  difficulty: "Easy" | "Med." | "Hard";
  hasVideo?: boolean;
  hasLock?: boolean;
  isStarred?: boolean;
  isTarget?: boolean;
}

const PROBLEMS: ProblemItem[] = [
  { id: 1267, title: "Count Servers that Communicate", slug: "count-servers-that-communicate", acceptance: "75.5%", difficulty: "Med.", hasVideo: true, hasLock: true },
  { id: 1, title: "Two Sum", slug: "two-sum", acceptance: "58.1%", difficulty: "Easy", hasVideo: true, hasLock: true },
  { id: 2, title: "Add Two Numbers", slug: "add-two-numbers", acceptance: "49.6%", difficulty: "Med.", hasVideo: true, hasLock: true },
  { id: 3, title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", acceptance: "40.1%", difficulty: "Med.", hasVideo: true, hasLock: true },
  { id: 4, title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", acceptance: "48.0%", difficulty: "Hard", hasVideo: true, hasLock: true },
  { id: 5, title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", acceptance: "38.9%", difficulty: "Med.", hasVideo: true, hasLock: true, isStarred: true },
  { id: 6, title: "Zigzag Conversion", slug: "zigzag-conversion", acceptance: "55.5%", difficulty: "Med.", hasVideo: true, hasLock: true, isStarred: true },
  { id: 7, title: "Reverse Integer", slug: "reverse-integer", acceptance: "32.8%", difficulty: "Med.", hasVideo: true, hasLock: true, isTarget: true },
  { id: 8, title: "String to Integer (atoi)", slug: "string-to-integer-atoi", acceptance: "17.4%", difficulty: "Med.", hasVideo: true, hasLock: true },
  { id: 9, title: "Palindrome Number", slug: "palindrome-number", acceptance: "55.7%", difficulty: "Easy", hasVideo: true, hasLock: true },
  { id: 10, title: "Regular Expression Matching", slug: "regular-expression-matching", acceptance: "28.3%", difficulty: "Hard", hasVideo: true, hasLock: true },
  { id: 11, title: "Container With Most Water", slug: "container-with-most-water", acceptance: "54.8%", difficulty: "Med.", hasVideo: true, hasLock: true },
];

export function ProblemCatalog() {
  const router = useRouter();
  const { room, partner, setIsJoinCreateOpen } = useRoomStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");

  const handleRowClick = (problem: ProblemItem) => {
    router.push(`/problems/${problem.id}`);
  };

  const filteredProblems = PROBLEMS.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-4 flex flex-col lg:flex-row gap-6 text-[13px] text-[#eff1f3]">
      {/* 1. Left Navigation Sidebar */}
      <aside className="hidden xl:flex flex-col w-[180px] shrink-0 space-y-6 select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#282828] text-white font-medium cursor-pointer">
            <BookOpen className="w-4 h-4 text-[#a0a0a0]" />
            <span>Library</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8a8a8a] hover:text-white hover:bg-[#222222] cursor-pointer transition-colors">
            <Compass className="w-4 h-4" />
            <span>Quest</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8a8a8a] hover:text-white hover:bg-[#222222] cursor-pointer transition-colors">
            <Compass className="w-4 h-4" />
            <span>Explore</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8a8a8a] hover:text-white hover:bg-[#222222] cursor-pointer transition-colors">
            <Scroll className="w-4 h-4" />
            <span>Study Plan</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#2d2d2d] space-y-2">
          <div className="flex items-center justify-between text-[#8a8a8a] px-3 text-xs font-semibold">
            <span>My Lists</span>
            <div className="flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <ChevronDown className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1.5 rounded text-[#a0a0a0] hover:text-white hover:bg-[#222222] cursor-pointer">
              <span className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-[#ffa116] fill-current" /> Favorite
              </span>
              <Lock className="w-3 h-3 text-[#707070]" />
            </div>
            <div className="flex items-center justify-between px-3 py-1.5 rounded text-[#a0a0a0] hover:text-white hover:bg-[#222222] cursor-pointer">
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#3a86ff]" /> Rewind 2025
              </span>
              <Globe className="w-3 h-3 text-[#707070]" />
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Middle Content: Banners, Categories, Search & Problem List */}
      <main className="flex-1 min-w-0 space-y-5">
        {/* Featured Banners Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Diwali Dhamaka */}
          <div className="rounded-xl p-4 bg-gradient-to-br from-[#f8d794] via-[#f7c268] to-[#e89d2d] text-zinc-900 flex flex-col justify-between h-[125px] shadow-sm relative overflow-hidden">
            <div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-zinc-700">Ends Nov 8</div>
              <h3 className="text-base font-extrabold leading-tight">Big Diwali<br />Dhamaka</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#ffa116] text-white px-2 py-0.5 rounded font-bold text-xs">₹583/mo</span>
              <span className="text-[11px] font-semibold text-zinc-800">Save 41%</span>
            </div>
          </div>

          {/* Card 2: LeetCode at Your Fingertips */}
          <div className="rounded-xl p-4 bg-[#232733] border border-[#2f3547] flex flex-col justify-between h-[125px] text-white relative overflow-hidden group">
            <div>
              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold mb-1">
                L
              </div>
              <h3 className="text-sm font-bold">LeetCode at Your<br />Fingertips</h3>
            </div>
            <div className="text-[11px] text-[#9098b0]">Download Mobile App</div>
          </div>

          {/* Card 3: System Design Interview Crash Course */}
          <div className="rounded-xl p-4 bg-gradient-to-br from-[#134e4a] to-[#042f2e] border border-[#115e59]/40 flex flex-col justify-between h-[125px] text-white">
            <div>
              <h3 className="text-xs font-bold text-emerald-300">LeetCode's Interview<br />Crash Course:</h3>
              <p className="text-[11px] text-zinc-300 leading-snug mt-1">System Design for Interviews and Beyond</p>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Start Learning →</div>
          </div>

          {/* Card 4: Data Structures Crash Course */}
          <div className="rounded-xl p-4 bg-gradient-to-br from-[#3b0764] to-[#1e1b4b] border border-purple-900/40 flex flex-col justify-between h-[125px] text-white">
            <div>
              <h3 className="text-xs font-bold text-purple-300">LeetCode's Interview<br />Crash Course:</h3>
              <p className="text-[11px] text-zinc-300 leading-snug mt-1">Data Structures and Algorithms</p>
            </div>
            <div className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Start Learning →</div>
          </div>
        </div>

        {/* Topic Pills Row */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#8a8a8a]">
          {[
            { name: "Array", count: 2274 },
            { name: "String", count: 896 },
            { name: "Hash Table", count: 844 },
            { name: "Math", count: 710 },
            { name: "Dynamic Programming", count: 686 },
            { name: "Sorting", count: 540 },
            { name: "Greedy", count: 483 },
            { name: "Binary Search", count: 447 },
          ].map((topic) => (
            <button
              key={topic.name}
              className="px-2.5 py-1 rounded bg-[#282828] hover:bg-[#333333] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>{topic.name}</span>
              <span className="text-[10px] text-[#666666]">{topic.count}</span>
            </button>
          ))}
          <button className="px-2 py-1 text-xs text-[#a0a0a0] hover:text-white flex items-center gap-1">
            Expand <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#2d2d2d]">
          {[
            { name: "All Topics", icon: Layers, isPrimary: true },
            { name: "Algorithms", icon: Code2 },
            { name: "Database", icon: Database },
            { name: "Shell", icon: Terminal },
            { name: "Concurrency", icon: Cpu },
            { name: "JavaScript", icon: Code2 },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? "bg-white text-black font-semibold shadow"
                    : "bg-[#282828] text-[#a0a0a0] hover:text-white hover:bg-[#333333]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search, Filter & Solved Counter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-[#8a8a8a] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search questions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#282828] border border-transparent focus:border-[#444444] rounded-lg px-3 py-1.5 pl-9 text-xs text-white placeholder-[#707070] focus:outline-none"
              />
            </div>
            <button className="p-1.5 rounded bg-[#282828] text-[#8a8a8a] hover:text-white">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-[#a0a0a0]">
              <span className="w-3 h-3 rounded-full border-2 border-[#2ebd59] border-t-transparent inline-block" />
              <span className="font-semibold text-white">1157/4109</span> Solved
            </div>
            <button
              onClick={() => router.push("/problems/7")}
              className="p-1.5 rounded bg-[#282828] text-[#8a8a8a] hover:text-[#ffa116] transition-colors"
              title="Pick Random"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Problems List Table */}
        <div className="rounded-xl overflow-hidden border border-[#282828] bg-[#1a1a1a]">
          <div className="divide-y divide-[#262626]">
            {filteredProblems.map((prob, idx) => {
              const isTarget = prob.isTarget;
              return (
                <div
                  key={prob.id}
                  onClick={() => handleRowClick(prob)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                    idx % 2 === 0 ? "bg-[#1f1f1f]" : "bg-[#1a1a1a]"
                  } hover:bg-[#282828]`}
                >
                  {/* Left: Checkmark & Title */}
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <CheckCircle2 className="w-4 h-4 text-[#2ebd59] shrink-0" />
                    <span className="font-medium text-[13px] text-white truncate hover:text-[#3880ff] transition-colors">
                      {prob.id}. {prob.title}
                    </span>
                  </div>

                  {/* Right: Metrics & Icons */}
                  <div className="flex items-center gap-5 shrink-0 text-xs">
                    <span className="text-[#8a8a8a] font-mono hidden sm:inline">
                      {prob.acceptance}
                    </span>

                    <span
                      className={`font-semibold w-12 text-center text-xs ${
                        prob.difficulty === "Easy"
                          ? "text-[#00b8a3]"
                          : prob.difficulty === "Med."
                          ? "text-[#ffc01e]"
                          : "text-[#ff375f]"
                      }`}
                    >
                      {prob.difficulty}
                    </span>

                    <div className="flex items-center gap-2 text-[#707070]">
                      {prob.hasVideo && <PlaySquare className="w-3.5 h-3.5 hover:text-white" />}
                      {prob.hasLock && <Lock className="w-3.5 h-3.5 text-[#555555]" />}
                      {prob.isStarred && <Star className="w-3.5 h-3.5 text-[#ffa116] fill-current" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 3. Right Widgets Sidebar: Calendar, Friends Check-in & Trending Companies */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 space-y-4 select-none">
        {/* Calendar Widget Card */}
        <div className="p-4 rounded-xl bg-[#282828] border border-[#333333] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Day 8</span>
              <span className="text-[10px] text-[#707070] font-mono">10:42:30 UTC</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-3.5 h-3.5 text-[#8a8a8a] cursor-pointer hover:text-white" />
              <ChevronRight className="w-3.5 h-3.5 text-[#8a8a8a] cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 text-center text-[10px] text-[#8a8a8a] font-semibold">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          {/* Check circles */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <div key={d} className="flex justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#3a86ff]" />
              </div>
            ))}
          </div>

          {/* Days grid sample */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-zinc-400">
            {[8, 9, 10, 11, 12, 13, 14].map((d) => (
              <span key={d} className={d === 8 ? "font-bold text-white" : ""}>{d}</span>
            ))}
          </div>

          {/* Weekly Premium Box */}
          <div className="p-2.5 rounded-lg bg-[#202020] border border-[#2e2e2e] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#8a8a8a]">
              <span className="flex items-center gap-1 text-[#ffa116] font-medium">
                Weekly Premium <HelpCircle className="w-3 h-3" />
              </span>
              <span className="text-[10px]">7 days left</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              {["W45", "W46", "W47", "W48", "W49"].map((w, i) => (
                <span
                  key={w}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    i === 1 ? "bg-[#ffa116] text-black font-bold" : "bg-[#282828] text-[#8a8a8a]"
                  }`}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#707070] pt-1">
            <span>0 Redeem</span>
            <span className="hover:underline cursor-pointer">Rules</span>
          </div>
        </div>

        {/* Friends Check-in Card (Discreet Pair Access) */}
        <div
          onClick={() => setIsJoinCreateOpen(true)}
          className="p-4 rounded-xl bg-[#282828] border border-[#333333] space-y-1 cursor-pointer hover:border-[#444444] transition-colors group"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              Friends Check-in <HelpCircle className="w-3 h-3 text-[#707070]" />
            </span>
            {partner && <span className="w-2 h-2 rounded-full bg-[#2ebd59]" />}
          </div>
          <p className="text-xs text-[#8a8a8a] group-hover:text-zinc-300 transition-colors">
            {partner
              ? `1 friend connected: ${partner.alias}`
              : "0 friends checked in today"}
          </p>
        </div>

        {/* Trending Companies Card */}
        <div className="p-4 rounded-xl bg-[#282828] border border-[#333333] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">Trending Companies</span>
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-3.5 h-3.5 text-[#8a8a8a] cursor-pointer" />
              <ChevronRight className="w-3.5 h-3.5 text-[#8a8a8a] cursor-pointer" />
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#707070] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search for a company..."
              className="w-full bg-[#1f1f1f] border border-transparent rounded px-2.5 py-1.5 pl-8 text-xs text-white placeholder-[#707070] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { name: "Amazon", count: 2013 },
              { name: "Google", count: 2318 },
              { name: "Meta", count: 1392 },
              { name: "Apple", count: 279 },
              { name: "Microsoft", count: 1362 },
              { name: "Bloomberg", count: 1229 },
              { name: "Uber", count: 329 },
            ].map((co) => (
              <span
                key={co.name}
                className="px-2 py-1 rounded bg-[#1f1f1f] text-[#8a8a8a] text-[11px] font-medium flex items-center gap-1"
              >
                <span>{co.name}</span>
                <span className="bg-[#ffa116] text-black font-bold text-[9px] px-1 py-0.2 rounded">
                  {co.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
