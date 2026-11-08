"use client";

import React, { useState, useEffect } from "react";
import { useUserProfileStore } from "@/stores/userProfileStore";
import { X, User, Check, Sparkles } from "lucide-react";

export function UsernamePromptModal() {
  const { isModalOpen, closeModal, syncUsername, username, isInitialized, setUserProfile } = useUserProfileStore();
  const [inputName, setInputName] = useState(username || "Mithun1706");
  const [loading, setLoading] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("leetcode_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProfile({ ...parsed, isInitialized: true });
      } else {
        // Open modal on initial visit if not initialized
        useUserProfileStore.setState({ isModalOpen: true });
      }
    } catch {}
  }, []);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await syncUsername(inputName);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-sans select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#222222] border border-[#333333] rounded-2xl shadow-2xl overflow-hidden text-[#eff1f3]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2e2e2e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.074 5.074 0 0 0-3.85-1.492 5.068 5.068 0 0 0-3.834 1.492L3.83 12.518C2.868 13.48 2.33 14.773 2.33 16.147s.538 2.667 1.5 3.629l4.333 4.364c.962.961 2.255 1.53 3.63 1.53 1.374 0 2.667-.569 3.629-1.53l2.608-2.522c.514-.514.514-1.365 0-1.879a1.328 1.328 0 0 0-1.928.191z" fill="#FFA116"/>
              <path d="M10.802 8.783l8.605-8.605c.514-.514 1.365-.514 1.879 0 .514.514.514 1.365 0 1.879l-8.605 8.605c-.514.514-1.365.514-1.879 0a1.328 1.328 0 0 1 0-1.879z" fill="#FFFFFF"/>
            </svg>
            <h3 className="font-bold text-base text-white">Sync LeetCode Account</h3>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-[#8a8a8a] hover:text-white hover:bg-[#2c2c2c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              LeetCode Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8a8a8a] absolute left-3 top-3" />
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="e.g. Mithun1706"
                className="w-full bg-[#181818] border border-[#383838] focus:border-[#ffa116] rounded-xl px-3.5 py-2.5 pl-10 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-[#8a8a8a] pt-1">
              Extracts real solved problems, ranking, contest rating, and submission heatmap.
            </p>
          </div>

          {/* Quick preset badge */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-[#8a8a8a]">Quick select:</span>
            <button
              type="button"
              onClick={() => setInputName("Mithun1706")}
              className="px-2.5 py-1 rounded-full bg-[#2c2c2c] hover:bg-[#383838] text-xs text-[#ffa116] border border-[#ffa116]/30 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Mithun1706</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={() => {
                syncUsername("Mithun1706");
                closeModal();
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#2e2e2e] hover:bg-[#383838] text-zinc-300 font-medium text-xs transition-colors"
            >
              Default (Mithun1706)
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#ffa116] hover:bg-[#e69010] text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                "Syncing..."
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Sync Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

