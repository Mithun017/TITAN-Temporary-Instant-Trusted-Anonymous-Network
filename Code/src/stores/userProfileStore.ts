"use client";

import { create } from "zustand";

export interface UserProfileData {
  username: string;
  realName: string;
  avatarUrl: string;
  rank: string;
  followers: number;
  following: number;
  location: string;
  portfolio: string;
  github: string;
  linkedin: string;
  contestRating: number;
  contestLevel: string;
  globalRanking: string;
  attendedContests: number;
  topPercentage: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  medSolved: number;
  medTotal: number;
  hardSolved: number;
  hardTotal: number;
  acceptanceRate: string;
  totalSubmissions: string;
  badgesCount: number;
  pastYearSubmissions: number;
  totalActiveDays: number;
  maxStreak: number;
  viewsCount: string;
  solutionsCount: number;
  reputationCount: number;
  python3Solved: number;
  pythonSolved: number;
  recentAC: Array<{ title: string; time: string; slug: string }>;
  isModalOpen: boolean;
  isInitialized: boolean;
  isLoading: boolean;
}

export interface UserProfileStore extends UserProfileData {
  openModal: () => void;
  closeModal: () => void;
  setUserProfile: (data: Partial<UserProfileData>) => void;
  syncUsername: (username: string) => Promise<void>;
}

const DEFAULT_PROFILE: UserProfileData = {
  username: "Mithun1706",
  realName: "MITHUN M",
  avatarUrl: "/avatar.png",
  rank: "22,022",
  followers: 18,
  following: 0,
  location: "India",
  portfolio: "https://mithun-portfolio-cyan.vercel.app",
  github: "Mithun017",
  linkedin: "m-mithun-85787628b",
  contestRating: 2308,
  contestLevel: "Guardian",
  globalRanking: "4,390/891,547",
  attendedContests: 31,
  topPercentage: "0.52%",
  totalSolved: 1157,
  totalQuestions: 4109,
  easySolved: 312,
  easyTotal: 975,
  medSolved: 635,
  medTotal: 2145,
  hardSolved: 210,
  hardTotal: 989,
  acceptanceRate: "77.29%",
  totalSubmissions: "1.7K",
  badgesCount: 42,
  pastYearSubmissions: 474,
  totalActiveDays: 332,
  maxStreak: 41,
  viewsCount: "1.2K",
  solutionsCount: 40,
  reputationCount: 16,
  python3Solved: 903,
  pythonSolved: 248,
  recentAC: [
    { title: "Count Valid Suffix Sorts I", time: "11 hours ago", slug: "count-valid-suffix-sorts-i" },
    { title: "Count Servers that Communicate", time: "1 day ago", slug: "count-servers-that-communicate" },
    { title: "Two Sum", time: "2 days ago", slug: "two-sum" },
    { title: "Reverse Integer", time: "3 days ago", slug: "reverse-integer" },
  ],
  isModalOpen: false,
  isInitialized: false,
  isLoading: false,
};

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  ...DEFAULT_PROFILE,

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  setUserProfile: (data) => {
    set((state) => ({ ...state, ...data }));
    try {
      if (typeof window !== "undefined") {
        const current = get();
        window.localStorage.setItem("leetcode_user_profile", JSON.stringify(current));
      }
    } catch {}
  },

  syncUsername: async (username: string) => {
    const cleanUsername = username.trim() || "Mithun1706";
    set({ isLoading: true, username: cleanUsername });

    try {
      // Attempt to fetch public LeetCode stats via public API endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${cleanUsername}`, {
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json();
        if (data && data.status === "success") {
          const updated: Partial<UserProfileData> = {
            username: cleanUsername,
            totalSolved: data.totalSolved ?? get().totalSolved,
            easySolved: data.easySolved ?? get().easySolved,
            medSolved: data.mediumSolved ?? get().medSolved,
            hardSolved: data.hardSolved ?? get().hardSolved,
            acceptanceRate: data.acceptanceRate ? `${data.acceptanceRate}%` : get().acceptanceRate,
            rank: data.ranking ? Number(data.ranking).toLocaleString() : get().rank,
            isInitialized: true,
            isLoading: false,
            isModalOpen: false,
          };
          set(updated);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("leetcode_user_profile", JSON.stringify({ ...get(), ...updated }));
          }
          return;
        }
      }
    } catch {}

    // Fallback to Mithun's exact verified stats
    const fallbackUpdate: Partial<UserProfileData> = {
      username: cleanUsername,
      realName: cleanUsername.toLowerCase().includes("mithun") ? "MITHUN M" : cleanUsername,
      isInitialized: true,
      isLoading: false,
      isModalOpen: false,
    };
    set(fallbackUpdate);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("leetcode_user_profile", JSON.stringify({ ...get(), ...fallbackUpdate }));
    }
  },
}));

