"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoomStore } from "@/stores/roomStore";
import { useUserProfileStore } from "@/stores/userProfileStore";
import { UsernamePromptModal } from "./UsernamePromptModal";
import {
  Search,
  Bell,
  Flame,
  ChevronDown,
  User,
  Shield,
  RefreshCw,
  Sliders,
} from "lucide-react";

export function TopBar() {
  const pathname = usePathname();
  const {
    room,
    partner,
    connectionState,
    setIsJoinCreateOpen,
    setIsSettingsOpen,
  } = useRoomStore();

  const {
    username,
    realName,
    avatarUrl,
    contestRating,
    contestLevel,
    openModal,
  } = useUserProfileStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isProblems =
    pathname === "/" ||
    pathname === "/problems" ||
    pathname.startsWith("/problems/") ||
    pathname.startsWith("/problemset");
  const isContest = pathname.startsWith("/contest");

  const profileUrl = `/u/${username || "Mithun1706"}`;

  return (
    <>
      <header className="h-[50px] bg-[#1a1a1a] border-b border-[#282828] flex items-center justify-between px-4 sticky top-0 z-40 select-none text-[13px]">
        {/* Left: LeetCode Brand & Primary Nav */}
        <div className="flex items-center gap-7">
          <Link href="/problems" className="flex items-center gap-2 group">
            {/* Official LeetCode SVG Logo */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#ffa116]">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.821 5.836 5.836 0 0 0 3.327-.498 5.795 5.795 0 0 0 2.21-1.813l3.915-4.187 4.197-4.49a1.522 1.522 0 0 0 .399-.957 1.402 1.402 0 0 0-.41-1.025l-2.022-1.93a1.442 1.442 0 0 0-1.025-.41 1.446 1.446 0 0 0-1.006.438l-4.088 4.39-1.956 2.093c-.158.17-.411.17-.57 0a.39.39 0 0 1 0-.557l1.96-2.095 4.092-4.383a3.684 3.684 0 0 1 2.56-1.116c.971 0 1.903.388 2.57 1.058l2.021 1.93a3.64 3.64 0 0 1 1.08 2.658c0 1.002-.4 1.952-1.08 2.658l-4.186 4.49-3.914 4.187a8.03 8.03 0 0 1-3.067 2.518 8.082 8.082 0 0 1-4.615.69 8.227 8.227 0 0 1-6.68-5.302 7.64 7.64 0 0 1-.486-1.411 7.674 7.674 0 0 1-.086-3.275 7.306 7.306 0 0 1 1.678-2.92l3.854-4.126L12.522.438A1.374 1.374 0 0 0 13.483 0z" />
              <path d="M17.23 20.295a1.2 1.2 0 0 1-.84-.351l-4.7-4.7a1.2 1.2 0 0 1 1.696-1.696l4.7 4.7a1.2 1.2 0 0 1-.856 2.047z" fill="#B3B3B3" />
            </svg>
            <span className="font-semibold text-[15px] tracking-tight text-white">
              LeetCode
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/problems"
              className={`relative py-3.5 transition-colors font-medium ${
                isProblems
                  ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                  : "text-[#a0a0a0] hover:text-white"
              }`}
            >
              Problems
            </Link>
            <Link
              href="/contest"
              className={`relative py-3.5 transition-colors font-medium ${
                isContest
                  ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                  : "text-[#a0a0a0] hover:text-white"
              }`}
            >
              Contest
            </Link>
            <span className="text-[#a0a0a0] hover:text-white cursor-pointer transition-colors">
              Discuss
            </span>
            <span className="text-[#a0a0a0] hover:text-white cursor-pointer transition-colors flex items-center gap-1">
              Interview <ChevronDown className="w-3 h-3 text-[#707070]" />
            </span>
            <span className="text-[#ffa116] hover:text-[#ffb800] cursor-pointer transition-colors flex items-center gap-1 font-medium">
              Store <ChevronDown className="w-3 h-3 text-[#ffa116]" />
            </span>
          </nav>
        </div>

        {/* Right: Search, Notifications, Streak, User Avatar & Premium */}
        <div className="flex items-center gap-3">
          {/* Search Capsule */}
          <div className="hidden lg:flex items-center gap-2 bg-[#282828] hover:bg-[#323232] text-[#8a8a8a] hover:text-[#c0c0c0] px-3 py-1.5 rounded-full border border-transparent hover:border-[#3a3a3a] cursor-pointer transition-colors text-xs">
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-full hover:bg-[#282828] text-[#8a8a8a] hover:text-white transition-colors relative"
            title="Notifications & Settings"
          >
            <Bell className="w-4 h-4" />
            {partner && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#2ebd59]" />
            )}
          </button>

          {/* Daily Streak Fire */}
          <div className="flex items-center gap-1 text-[#ffa116] font-semibold text-xs px-2 py-1 rounded hover:bg-[#282828] cursor-pointer">
            <Flame className="w-4 h-4 fill-current text-[#ffa116]" />
            <span>3</span>
          </div>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="relative group p-0.5 rounded-full focus:outline-none"
              title={`${realName} (@${username})`}
            >
              <div className="w-7 h-7 rounded-full bg-[#3a3a3a] border border-[#555] overflow-hidden flex items-center justify-center">
                <img
                  src={avatarUrl || "/avatar.png"}
                  alt={username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/avatar.png";
                  }}
                />
              </div>
              {connectionState === "connected" && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2ebd59] border-2 border-[#1a1a1a]" />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#262626] border border-[#383838] rounded-xl shadow-2xl py-2 z-50 text-[#eff1f3] animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Header */}
                <div className="px-4 py-3 border-b border-[#333333] flex items-center gap-3">
                  <img
                    src={avatarUrl || "/avatar.png"}
                    alt={username}
                    className="w-10 h-10 rounded-full object-cover border border-[#444]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white truncate flex items-center gap-1">
                      {realName}
                      <span className="text-[#3b82f6] text-xs">💎</span>
                    </div>
                    <div className="text-xs text-[#8a8a8a] truncate">@{username}</div>
                    <div className="text-[11px] text-[#ffa116] font-medium mt-0.5">
                      {contestLevel} • Rating {contestRating}
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1 text-xs">
                  <Link
                    href={profileUrl}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#323232] text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-[#ffa116]" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      openModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#323232] text-white text-left transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-[#38bdf8]" />
                    <span>Switch / Sync LeetCode User</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsJoinCreateOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#323232] text-white text-left transition-colors"
                  >
                    <Shield className="w-4 h-4 text-[#2ebd59]" />
                    <span>Pair Programming Session</span>
                    {connectionState === "connected" && (
                      <span className="ml-auto text-[10px] text-[#2ebd59] font-medium">Active</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#323232] text-white text-left transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-[#a0a0a0]" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Premium Capsule Button */}
          <button
            onClick={() => setIsJoinCreateOpen(true)}
            className="px-3 py-1 rounded-full text-xs font-medium text-[#ffa116] bg-[#ffa116]/10 hover:bg-[#ffa116]/20 border border-[#ffa116]/30 transition-colors"
          >
            {room ? (partner ? "Session Active" : "1/2 Joined") : "Premium"}
          </button>
        </div>
      </header>

      {/* Global Username Prompt Modal on First Interaction or Request */}
      <UsernamePromptModal />
    </>
  );
}
