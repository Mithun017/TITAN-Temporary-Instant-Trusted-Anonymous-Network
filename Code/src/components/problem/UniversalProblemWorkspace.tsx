"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRoomStore } from "@/stores/roomStore";
import { useRealtime } from "@/hooks/useRealtime";
import { formatTime } from "@/lib/utils";
import { getProblem, ProblemData, TestCase } from "@/lib/problemsData";
import { useUserProfileStore } from "@/stores/userProfileStore";
import { UsernamePromptModal } from "@/components/shell/UsernamePromptModal";
import { deriveKey } from "@/lib/crypto";
import { Room, Participant } from "@/types";
import {
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Settings,
  Maximize2,
  FileCode,
  Check,
  Copy,
  Terminal,
  Clock,
  Sparkles,
  Code2,
  List,
  Plus,
  X,
  Reply,
  Send,
  Cloud,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Share2,
  HelpCircle,
  Tag,
  Lock,
  Lightbulb,
  Zap,
  AlignLeft,
  Bookmark,
  Braces,
  Flame,
  Bell,
  User,
  LayoutGrid,
  ExternalLink,
  Bug,
  UserPlus,
} from "lucide-react";

export function UniversalProblemWorkspace({ problemId = "1267" }: { problemId?: string }) {
  const router = useRouter();
  const problem: ProblemData = getProblem(problemId);
  const isSeven = String(problem.id) === "7";

  const { username, realName, avatarUrl } = useUserProfileStore();

  const {
    room,
    me,
    partner,
    messages,
    partnerIsTyping,
    setIsJoinCreateOpen,
    setIsSettingsOpen,
  } = useRoomStore();

  const { sendMessage, sendTyping } = useRealtime();

  // Navigation & Tabs
  const [activeLeftTab, setActiveLeftTab] = useState<"description" | "editorial" | "solutions" | "submissions">("description");
  const [consoleTab, setConsoleTab] = useState<"testcase" | "result" | "chat">(isSeven ? "chat" : "result");
  const [selectedLanguage, setSelectedLanguage] = useState<"python3" | "typescript" | "javascript" | "cpp" | "java">("python3");
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  // Direct Link Chat State
  const [directLinkCopied, setDirectLinkCopied] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (consoleTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, consoleTab]);

  // Direct Link auto-initialization (no room ID or passphrase prompt required)
  useEffect(() => {
    async function initDirectLinkSession() {
      if (room && me) return;

      try {
        const searchParams = new URLSearchParams(window.location.search);
        const urlRoomCode = searchParams.get("room") || searchParams.get("session");

        const res = await fetch("/api/rooms/direct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomCode: urlRoomCode || undefined,
            alias: urlRoomCode ? "Guest" : (realName || "Host"),
          }),
        });

        const data = await res.json();
        if (data.success && data.roomId && data.passphrase) {
          const key = await deriveKey(data.passphrase, data.salt);

          const currentRoom: Room = {
            roomId: data.roomId,
            roomCode: data.roomCode,
            salt: data.salt,
            createdAt: Date.now(),
            expiresAt: data.expiresAt,
            status: data.participants?.length > 1 ? "ACTIVE" : "WAITING_FOR_PARTNER",
            participants: data.participants || [],
            maxParticipants: 2,
          };

          const meParticipant: Participant = {
            id: data.participantId,
            alias: data.isCreator ? (realName || "Host") : "Guest",
            slot: data.slot,
            isConnected: true,
            joinedAt: Date.now(),
            lastActiveAt: Date.now(),
          };

          useRoomStore.getState().setRoom(currentRoom);
          useRoomStore.getState().setMe(meParticipant);
          useRoomStore.getState().setCryptoKey(key);

          // Update URL with room parameter if not already present
          if (!urlRoomCode && data.roomCode) {
            const newUrl = `${window.location.pathname}?room=${encodeURIComponent(data.roomCode)}`;
            window.history.replaceState({}, "", newUrl);
          }
        }
      } catch (err) {
        console.error("Direct link session error:", err);
      }
    }

    initDirectLinkSession();
  }, [room, me, realName]);

  const copyDirectLink = () => {
    const code = room?.roomCode;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";
    const shareUrl = `${origin}${window.location.pathname}${code ? `?room=${encodeURIComponent(code)}` : ""}`;
    navigator.clipboard.writeText(shareUrl);
    setDirectLinkCopied(true);
    setTimeout(() => setDirectLinkCopied(false), 2500);
  };

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    await sendMessage(msg, "text");
  };

  // Code editor state
  const [code, setCode] = useState(problem.starterCode.python3);

  // Update starter code when language or problem changes
  useEffect(() => {
    setCode(problem.starterCode[selectedLanguage] || problem.starterCode.python3);
  }, [selectedLanguage, problem.id]);

  // Test cases state
  const [testCases, setTestCases] = useState<TestCase[]>(problem.testCases);
  useEffect(() => {
    setTestCases(problem.testCases);
  }, [problem.id]);

  // Sync incoming peer messages into testcase / result timeline
  useEffect(() => {
    if (messages && messages.length > 0) {
      const peerCases: TestCase[] = messages.map((m, i) => ({
        id: m.id,
        name: `Case ${i + 1}`,
        input:
          m.content.startsWith("x =") || m.content.startsWith("grid =")
            ? m.content
            : `${problem.id === 1267 ? "grid = " : "x = "}${m.content}`,
        expectedOutput: m.content,
      }));
      setTestCases(peerCases);
      setActiveCaseIdx(peerCases.length - 1);
      setRunResult((prev) => ({
        ...prev,
        status: "Accepted",
        runtime: "0 ms",
        cases: peerCases.map((pc) => ({
          input: pc.input,
          output: pc.expectedOutput,
          expected: pc.expectedOutput,
          passed: true,
        })),
      }));
      setConsoleTab("result");
    }
  }, [messages, problem.id]);

  // Execution / Submission state
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);
  const [runResult, setRunResult] = useState<{
    status: "Accepted" | "Wrong Answer" | "Runtime Error";
    runtime: string;
    memory: string;
    errorOutput?: string;
    cases: Array<{ input: string; output: string; expected: string; passed: boolean }>;
  }>({
    status: isSeven ? "Runtime Error" : "Accepted",
    runtime: "0 ms",
    memory: "16.8 MB",
    errorOutput: `IndentationError: expected an indented block after function definition on line 60\n    import sys\nLine 4  (Solution.py)`,
    cases: problem.testCases.map((tc) => ({
      input: tc.input,
      output: tc.expectedOutput,
      expected: tc.expectedOutput,
      passed: true,
    })),
  });

  // Dynamic document title matching LeetCode
  useEffect(() => {
    if (problem?.title) {
      document.title = `${problem.title} - LeetCode`;
    }
  }, [problem?.title]);

  // Timer state
  const [timerCount, setTimerCount] = useState(34544);
  useEffect(() => {
    const t = setInterval(() => setTimerCount((prev) => prev + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Run Code logic
  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleTab("result");

    // If Problem 7 and room is active, relay testcase message to peer!
    if (isSeven && room && me) {
      try {
        const activeInput = testCases[activeCaseIdx]?.input || "x = 123";
        await sendMessage(activeInput, "text");
      } catch (err) {
        console.error("Relay error:", err);
      }
    }

    // Check if code is just a stub without body
    const trimmedLines = code.trim().split("\n");
    const isStub =
      trimmedLines.length <= 2 ||
      trimmedLines.every((l) => {
        const s = l.trim();
        return (
          s.startsWith("class ") ||
          s.startsWith("def ") ||
          s.startsWith("function ") ||
          s.startsWith("/**") ||
          s.startsWith("*") ||
          s === "};" ||
          s === "}" ||
          s === ""
        );
      });

    setTimeout(() => {
      if (isStub) {
        setRunResult({
          status: "Runtime Error",
          runtime: "0 ms",
          memory: "16.8 MB",
          errorOutput: `IndentationError: expected an indented block after function definition on line 60\n    import sys\nLine 4  (Solution.py)`,
          cases: testCases.map((tc) => ({
            input: tc.input,
            output: "",
            expected: tc.expectedOutput,
            passed: false,
          })),
        });
        setHasRun(true);
        setIsRunning(false);
        return;
      }

      // Evaluate solution
      const casesEval = testCases.map((tc) => {
        if (problem.solutionFn) {
          const res = problem.solutionFn(tc.input, code);
          return {
            input: tc.input,
            output: res.output,
            expected: tc.expectedOutput,
            passed: res.passed,
          };
        }
        return {
          input: tc.input,
          output: tc.expectedOutput,
          expected: tc.expectedOutput,
          passed: true,
        };
      });

      const allPassed = casesEval.every((c) => c.passed);
      setRunResult({
        status: allPassed ? "Accepted" : "Wrong Answer",
        runtime: "0 ms",
        memory: "16.8 MB",
        cases: casesEval,
      });
      setHasRun(true);
      setIsRunning(false);
    }, 400);
  };

  // Submit Code logic
  const handleSubmitCode = async () => {
    setIsRunning(true);
    setConsoleTab("result");

    if (isSeven && room && me) {
      try {
        await sendMessage(code, "code", selectedLanguage);
      } catch (err) {
        console.error("Relay error:", err);
      }
    }

    setTimeout(() => {
      setRunResult({
        status: "Accepted",
        runtime: "54 ms",
        memory: "17.2 MB",
        cases: testCases.map((tc) => ({
          input: tc.input,
          output: tc.expectedOutput,
          expected: tc.expectedOutput,
          passed: true,
        })),
      });
      setHasRun(true);
      setIsRunning(false);
      setActiveLeftTab("submissions");
    }, 600);
  };

  // Problem switching
  const problemIds = ["1267", "1", "2", "3", "7", "9", "11"];
  const currentIdx = problemIds.indexOf(String(problem.id));
  const prevId = problemIds[(currentIdx - 1 + problemIds.length) % problemIds.length];
  const nextId = problemIds[(currentIdx + 1) % problemIds.length];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1a1a1a] text-[#eff1f3] select-none overflow-hidden font-sans">
      {/* Top Main LeetCode Bar */}
      <header className="h-[46px] bg-[#1a1a1a] border-b border-[#282828] px-3 flex items-center justify-between text-xs z-30 shrink-0">
        {/* Left: Logo, Problem List, Prev/Next, Shuffle */}
        <div className="flex items-center gap-2">
          {/* LeetCode SVG Logo */}
          <Link href="/problems" className="flex items-center hover:opacity-85 transition-opacity pr-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.074 5.074 0 0 0-3.85-1.492 5.068 5.068 0 0 0-3.834 1.492L3.83 12.518C2.868 13.48 2.33 14.773 2.33 16.147s.538 2.667 1.5 3.629l4.333 4.364c.962.961 2.255 1.53 3.63 1.53 1.374 0 2.667-.569 3.629-1.53l2.608-2.522c.514-.514.514-1.365 0-1.879a1.328 1.328 0 0 0-1.928.191z" fill="#FFA116"/>
              <path d="M10.802 8.783l8.605-8.605c.514-.514 1.365-.514 1.879 0 .514.514.514 1.365 0 1.879l-8.605 8.605c-.514.514-1.365.514-1.879 0a1.328 1.328 0 0 1 0-1.879z" fill="#FFFFFF"/>
            </svg>
          </Link>

          <Link
            href="/problems"
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#282828] text-[#eff1f3] hover:text-white transition-colors"
            title="Problem List"
          >
            <List className="w-3.5 h-3.5 text-[#8a8a8a]" />
            <span className="font-semibold text-[13px]">Problem List</span>
          </Link>

          <div className="flex items-center text-[#8a8a8a]">
            <button
              onClick={() => router.push(`/problems/${prevId}`)}
              className="p-1 hover:text-white"
              title="Previous Problem"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => router.push(`/problems/${nextId}`)}
              className="p-1 hover:text-white"
              title="Next Problem"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => router.push(`/problems/${nextId}`)}
            className="p-1 text-[#8a8a8a] hover:text-[#ffa116]"
            title="Shuffle"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Debug, Play (Run), Submit, Split, AI Sparkles */}
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded hover:bg-[#282828] text-[#ffa116] transition-colors"
            title="Debug"
          >
            <Bug className="w-4 h-4" />
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="p-1.5 rounded bg-[#282828] hover:bg-[#333333] text-white transition-colors"
            title="Run (Ctrl+Enter)"
          >
            <Play className="w-4 h-4 fill-current text-white" />
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#2ebd59]/15 hover:bg-[#2ebd59]/25 text-[#2ebd59] border border-[#2ebd59]/30 font-semibold text-xs transition-colors"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>

          <button className="p-1.5 rounded hover:bg-[#282828] text-[#8a8a8a] hover:text-white hidden sm:inline">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button className="p-1.5 rounded hover:bg-[#282828] text-[#8a8a8a] hover:text-[#3880ff] hidden sm:inline" title="AI Assistant">
            <Sparkles className="w-4 h-4 text-[#8a8a8a]" />
          </button>
        </div>

        {/* Right: Layout, Settings, Bell, Streak, Timer, User, Premium */}
        <div className="flex items-center gap-3 text-[#8a8a8a]">
          <LayoutGrid className="w-3.5 h-3.5 hover:text-white cursor-pointer hidden md:inline" />
          <Settings onClick={() => setIsSettingsOpen(true)} className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <Bell onClick={() => setIsSettingsOpen(true)} className="w-3.5 h-3.5 hover:text-white cursor-pointer" />

          <div className="flex items-center gap-1 text-[#ffa116] font-semibold text-xs">
            <Flame className="w-3.5 h-3.5 fill-current text-[#ffa116]" />
            <span>3</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#8a8a8a] font-mono">
            <span>&lt;</span>
            <Play className="w-2.5 h-2.5 fill-current text-[#3880ff] inline" />
            <span className="text-[#3880ff]">{formatTimer(timerCount)}</span>
            <RotateCcw className="w-2.5 h-2.5 inline cursor-pointer hover:text-white" />
          </div>

          <button
            onClick={copyDirectLink}
            className="flex items-center gap-1.5 p-1 px-2 rounded bg-[#282828] hover:bg-[#333333] text-zinc-300 hover:text-white transition-colors"
            title={directLinkCopied ? "Link Copied!" : "Copy Direct Chat Invite Link (no ID or password needed)"}
          >
            {directLinkCopied ? <Check className="w-3.5 h-3.5 text-[#2ebd59]" /> : <UserPlus className="w-3.5 h-3.5 text-[#3880ff]" />}
            <span className="text-[11px] font-sans font-medium">{directLinkCopied ? "Copied" : "Share Link"}</span>
          </button>

          <Link
            href={`/u/${username || "Mithun1706"}`}
            className="w-6 h-6 rounded-full overflow-hidden border border-[#555] bg-[#2a2a2a] flex items-center justify-center shrink-0 hover:ring-2 hover:ring-[#ffa116] transition-all"
            title={`${realName || "MITHUN M"} (@${username || "Mithun1706"})`}
          >
            <img
              src={avatarUrl || "/avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/avatar.png";
              }}
            />
          </Link>

          <button
            onClick={() => setIsJoinCreateOpen(true)}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#ffa116] bg-[#ffa116]/10 hover:bg-[#ffa116]/20 border border-[#ffa116]/30"
          >
            {room ? "Sync" : "Premium"}
          </button>
        </div>
      </header>

      {/* Two-Pane Workspace Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ================= LEFT PANE: Problem Description ================= */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#282828] flex flex-col bg-[#1a1a1a] overflow-hidden">
          {/* Tabs */}
          <div className="h-9 bg-[#222222] border-b border-[#282828] px-3 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveLeftTab("description")}
                className={`py-2 font-medium flex items-center gap-1.5 relative ${
                  activeLeftTab === "description"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                    : "text-[#8a8a8a] hover:text-white"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-[#3a86ff]" />
                <span>Description</span>
              </button>

              <button
                onClick={() => setActiveLeftTab("editorial")}
                className={`py-2 font-medium ${
                  activeLeftTab === "editorial" ? "text-white" : "text-[#8a8a8a] hover:text-white"
                }`}
              >
                Editorial
              </button>

              <button
                onClick={() => setActiveLeftTab("solutions")}
                className={`py-2 font-medium ${
                  activeLeftTab === "solutions" ? "text-white" : "text-[#8a8a8a] hover:text-white"
                }`}
              >
                Solutions
              </button>

              <button
                onClick={() => setActiveLeftTab("submissions")}
                className={`py-2 font-medium flex items-center gap-1 ${
                  activeLeftTab === "submissions" ? "text-white" : "text-[#8a8a8a] hover:text-white"
                }`}
              >
                Submissions
              </button>
            </div>

            <Maximize2 className="w-3.5 h-3.5 text-[#707070] cursor-pointer hover:text-white" />
          </div>

          {/* Left Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px] leading-relaxed text-[#eff1f3]">
            {activeLeftTab === "description" ? (
              <>
                {/* Title & Solved State */}
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-bold text-white">{problem.title}</h1>
                  <span className="text-xs font-semibold text-[#2ebd59] flex items-center gap-1">
                    Solved <CheckCircle2 className="w-3.5 h-3.5 text-[#2ebd59]" />
                  </span>
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      problem.difficulty === "Easy"
                        ? "bg-[#00b8a3]/15 text-[#00b8a3]"
                        : problem.difficulty === "Medium"
                        ? "bg-[#ffc01e]/15 text-[#ffc01e]"
                        : "bg-[#ff375f]/15 text-[#ff375f]"
                    }`}
                  >
                    {problem.difficulty}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#282828] text-[#8a8a8a] flex items-center gap-1 text-[11px] cursor-pointer hover:text-white">
                    <Tag className="w-3 h-3" /> Topics
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#282828] text-[#8a8a8a] flex items-center gap-1 text-[11px] cursor-pointer hover:text-white">
                    <Lock className="w-3 h-3" /> Companies
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#282828] text-[#8a8a8a] flex items-center gap-1 text-[11px] cursor-pointer hover:text-white">
                    <Lightbulb className="w-3 h-3" /> Hint
                  </span>
                </div>

                {/* Description Narrative */}
                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-4 pt-2">
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="space-y-2">
                      <div className="font-bold text-white">{ex.title}</div>

                      {/* Exact LeetCode Server Center Graphic for 1267 */}
                      {problem.id === 1267 && i === 0 && (
                        <div className="inline-block my-2 bg-white rounded border border-gray-400 p-1 shadow">
                          <div className="w-[140px] h-[140px] grid grid-cols-2 grid-rows-2">
                            <div className="border-r border-b border-gray-400 flex items-center justify-center p-1">
                              <svg viewBox="0 0 40 40" className="w-12 h-12">
                                <rect x="5" y="4" width="30" height="22" rx="3" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.5" />
                                <rect x="8" y="7" width="24" height="16" rx="2" fill="#fecdd3" stroke="#e11d48" strokeWidth="1" />
                                <line x1="10" y1="9" x2="16" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                                <path d="M17 26 L23 26 L22 31 L18 31 Z" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.2" />
                                <rect x="12" y="31" width="16" height="4" rx="1.5" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.2" />
                              </svg>
                            </div>
                            <div className="border-b border-gray-400 flex items-center justify-center p-1" />
                            <div className="border-r border-gray-400 flex items-center justify-center p-1" />
                            <div className="flex items-center justify-center p-1">
                              <svg viewBox="0 0 40 40" className="w-12 h-12">
                                <rect x="5" y="4" width="30" height="22" rx="3" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.5" />
                                <rect x="8" y="7" width="24" height="16" rx="2" fill="#fecdd3" stroke="#e11d48" strokeWidth="1" />
                                <line x1="10" y1="9" x2="16" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                                <path d="M17 26 L23 26 L22 31 L18 31 Z" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.2" />
                                <rect x="12" y="31" width="16" height="4" rx="1.5" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.2" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}

                      {problem.id === 1267 && i === 1 && (
                        <div className="inline-block my-2 bg-white rounded border border-gray-400 p-1 shadow">
                          <div className="w-[140px] h-[140px] grid grid-cols-2 grid-rows-2">
                            <div className="border-r border-b border-gray-400 flex items-center justify-center p-1">
                              <svg viewBox="0 0 40 40" className="w-12 h-12">
                                <rect x="5" y="4" width="30" height="22" rx="3" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                                <rect x="8" y="7" width="24" height="16" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
                                <line x1="10" y1="9" x2="16" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                                <path d="M17 26 L23 26 L22 31 L18 31 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
                                <rect x="12" y="31" width="16" height="4" rx="1.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
                              </svg>
                            </div>
                            <div className="border-b border-gray-400 flex items-center justify-center p-1" />
                            <div className="border-r border-gray-400 flex items-center justify-center p-1">
                              <svg viewBox="0 0 40 40" className="w-12 h-12">
                                <rect x="5" y="4" width="30" height="22" rx="3" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                                <rect x="8" y="7" width="24" height="16" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
                                <line x1="10" y1="9" x2="16" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                                <path d="M17 26 L23 26 L22 31 L18 31 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
                                <rect x="12" y="31" width="16" height="4" rx="1.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
                              </svg>
                            </div>
                            <div className="flex items-center justify-center p-1">
                              <svg viewBox="0 0 40 40" className="w-12 h-12">
                                <rect x="5" y="4" width="30" height="22" rx="3" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                                <rect x="8" y="7" width="24" height="16" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
                                <line x1="10" y1="9" x2="16" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                                <path d="M17 26 L23 26 L22 31 L18 31 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
                                <rect x="12" y="31" width="16" height="4" rx="1.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-3 bg-[#222222] border border-[#2e2e2e] rounded-lg font-mono text-xs space-y-1">
                        <div><strong className="font-sans text-white">Input:</strong> {ex.input}</div>
                        <div><strong className="font-sans text-white">Output:</strong> {ex.output}</div>
                        {ex.explanation && (
                          <div className="text-zinc-400 font-sans text-xs pt-1">
                            <strong>Explanation:</strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="pt-2 border-t border-[#282828] text-xs">
                  <div className="font-bold text-white mb-2">Constraints:</div>
                  <ul className="list-disc list-inside space-y-1 font-mono text-zinc-400">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : activeLeftTab === "submissions" ? (
              /* Submissions History / Results */
              <div className="space-y-4">
                <div className="p-4 bg-[#242424] border border-[#333333] rounded-xl space-y-2">
                  <div className="text-base font-bold text-[#2ebd59] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Accepted
                  </div>
                  <div className="text-xs text-zinc-400">Submitted just now</div>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                    <div className="p-2 bg-[#1a1a1a] rounded">
                      <div className="text-[#8a8a8a] text-[11px]">Runtime</div>
                      <div className="text-white font-bold">{runResult.runtime}</div>
                      <div className="text-[#2ebd59] text-[10px]">Beats 89.4% of users</div>
                    </div>
                    <div className="p-2 bg-[#1a1a1a] rounded">
                      <div className="text-[#8a8a8a] text-[11px]">Memory</div>
                      <div className="text-white font-bold">{runResult.memory}</div>
                      <div className="text-[#2ebd59] text-[10px]">Beats 74.2% of users</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[#8a8a8a] py-8 text-center text-xs">
                Community {activeLeftTab} are available in full LeetCode view.
              </div>
            )}
          </div>

          {/* Bottom Bar of Left Pane: Like, Dislike, Online count */}
          <div className="h-9 bg-[#222222] border-t border-[#282828] px-4 flex items-center justify-between text-xs text-[#8a8a8a] shrink-0">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 hover:text-white">
                <ThumbsUp className="w-3.5 h-3.5" /> <span>{problem.likes}</span>
              </button>
              <button className="hover:text-white"><ThumbsDown className="w-3.5 h-3.5" /></button>
              <button className="flex items-center gap-1 hover:text-white">
                <MessageSquare className="w-3.5 h-3.5" /> <span>{problem.comments}</span>
              </button>
              <Star className="w-3.5 h-3.5 hover:text-[#ffa116] cursor-pointer" />
              <Share2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <HelpCircle className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#2ebd59] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#2ebd59]" />
              <span>{problem.onlineCount}</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANE: Code Editor & Console ================= */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#1a1a1a] overflow-hidden">
          {/* Upper: Code Editor (Height 55%) */}
          <div className="h-[55%] border-b border-[#282828] flex flex-col bg-[#1e1e1e]">
            {/* Editor Header Bar */}
            <div className="h-9 bg-[#222222] border-b border-[#282828] px-3 flex items-center justify-between text-xs text-[#a0a0a0] shrink-0">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-[#3a86ff]" />
                <span className="font-semibold text-white">Code</span>

                {/* Language Selector */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer ml-3"
                >
                  <option value="python3" className="bg-[#282828]">Python3</option>
                  <option value="typescript" className="bg-[#282828]">TypeScript</option>
                  <option value="javascript" className="bg-[#282828]">JavaScript</option>
                  <option value="cpp" className="bg-[#282828]">C++</option>
                  <option value="java" className="bg-[#282828]">Java</option>
                </select>

                <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#ffa116] ml-2">
                  <Zap className="w-3 h-3 fill-current" /> Auto
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" title="Format code" className="hover:text-white cursor-pointer">
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button type="button" title="Bookmark" className="hover:text-white cursor-pointer">
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button type="button" title="Shortcuts" className="hover:text-white cursor-pointer">
                  <Braces className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCode(problem.starterCode[selectedLanguage])}
                  className="hover:text-white cursor-pointer"
                  title="Reset code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Lines Editor */}
            <div className="flex-1 p-3 overflow-auto font-mono text-xs flex">
              <div className="select-none text-[#555555] pr-3 text-right font-mono text-xs leading-relaxed">
                {code.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent resize-none text-[#eff1f3] focus:outline-none font-mono leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Editor Footer */}
            <div className="h-6 bg-[#1a1a1a] border-t border-[#282828] px-3 flex items-center justify-between text-[11px] text-[#707070] shrink-0 font-mono">
              <span>Saved</span>
              <span>Ln 1, Col 1</span>
            </div>
          </div>

          {/* Lower: Console Drawer (Testcase / Test Result) (Height 45%) */}
          <div className="h-[45%] flex flex-col bg-[#1a1a1a] overflow-hidden">
            {/* Console Tab Row */}
            <div className="h-9 bg-[#222222] border-b border-[#282828] px-3 flex items-center justify-between text-xs shrink-0 select-none">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setConsoleTab("testcase")}
                  className={`py-2 font-semibold transition-colors flex items-center gap-1.5 relative ${
                    consoleTab === "testcase"
                      ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#3a86ff]"
                      : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3a86ff]" />
                  <span>Testcase</span>
                </button>

                <button
                  onClick={() => setConsoleTab("result")}
                  className={`py-2 font-semibold transition-colors flex items-center gap-1.5 relative ${
                    consoleTab === "result"
                      ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2ebd59]"
                      : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-[#2ebd59]" />
                  <span>Test Result</span>
                  {hasRun && <span className="w-1.5 h-1.5 rounded-full bg-[#2ebd59]" />}
                </button>

                <button
                  onClick={() => setConsoleTab("chat")}
                  className={`py-2 font-semibold transition-colors flex items-center gap-1.5 relative ${
                    consoleTab === "chat"
                      ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#ffa116]"
                      : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#ffa116]" />
                  <span>Chat</span>
                  {messages.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#ffa116] text-black font-bold">
                      {messages.length}
                    </span>
                  )}
                  {partner && <span className="w-1.5 h-1.5 rounded-full bg-[#2ebd59]" />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                {partnerIsTyping && (
                  <span className="text-[11px] text-[#ffa116] animate-pulse font-mono">
                    Running test...
                  </span>
                )}

                <button
                  onClick={copyDirectLink}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2a2a2a] hover:bg-[#343434] text-white text-[11px] font-sans font-medium border border-[#3d3d3d] transition-colors"
                  title="Share link to chat directly without ID or passphrase"
                >
                  {directLinkCopied ? (
                    <>
                      <Check className="w-3 h-3 text-[#2ebd59]" />
                      <span className="text-[#2ebd59]">Copied Link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3 h-3 text-[#ffa116]" />
                      <span>{partner ? "Invite Partner" : "Copy Chat Link"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Console Body */}
            <div className="flex-1 p-4 overflow-y-auto text-xs space-y-3">
              {consoleTab === "chat" ? (
                /* Interactive Direct Chat Interface */
                <div className="h-full flex flex-col justify-between font-sans text-xs">
                  {/* Chat Presence & Controls Sub-bar */}
                  <div className="pb-2.5 mb-2 border-b border-[#2a2a2a] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${partner ? "bg-[#2ebd59]" : "bg-[#ffa116] animate-pulse"}`} />
                      <span className="text-zinc-300 font-medium">
                        {partner ? `Connected with ${partner.alias}` : "Waiting for partner (Share link to chat directly)"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyDirectLink}
                        className="text-[11px] text-[#ffa116] hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{directLinkCopied ? "Copied" : "Copy Link"}</span>
                      </button>
                      <span className="text-zinc-600">|</span>
                      <button
                        onClick={() => setConsoleTab("result")}
                        className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                        title="Quick Disguise"
                      >
                        <span>Disguise as Error</span>
                      </button>
                    </div>
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[120px]">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-zinc-500">
                        <MessageSquare className="w-8 h-8 mb-2 text-zinc-600" />
                        <div className="text-xs font-semibold text-zinc-400">Direct Link Peer Chat Active</div>
                        <div className="text-[11px] text-zinc-500 mt-1 max-w-xs leading-relaxed">
                          Anyone who has your link connects directly without entering any ID or passphrase. Encrypted end-to-end via client-side AES-256-GCM.
                        </div>
                        <button
                          onClick={copyDirectLink}
                          className="mt-3 px-3 py-1.5 bg-[#ffa116]/10 hover:bg-[#ffa116]/20 text-[#ffa116] border border-[#ffa116]/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{directLinkCopied ? "Link Copied!" : "Copy Direct Chat Link to Invite"}</span>
                        </button>
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isMe = m.senderId === me?.id;
                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-0.5 px-1">
                              <span className="font-medium text-zinc-300">{isMe ? "You" : partner?.alias || "Partner"}</span>
                              <span>•</span>
                              <span>{formatTime(m.timestamp)}</span>
                            </div>
                            <div
                              className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed break-words font-mono select-text ${
                                isMe
                                  ? "bg-[#1e3a29] text-[#eff1f3] border border-[#2ebd59]/30 rounded-tr-none shadow"
                                  : "bg-[#252830] text-[#eff1f3] border border-[#3b82f6]/30 rounded-tl-none shadow"
                              }`}
                            >
                              {m.content}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Partner Typing Indicator */}
                  {partnerIsTyping && (
                    <div className="text-[11px] text-[#ffa116] italic py-1 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffa116]" />
                      <span>{partner?.alias || "Partner"} is typing...</span>
                    </div>
                  )}

                  {/* Chat Input Box */}
                  <form onSubmit={handleSendChatMessage} className="pt-2 flex items-center gap-2 border-t border-[#2e2e2e] mt-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => {
                        setChatInput(e.target.value);
                        sendTyping();
                      }}
                      placeholder="Type a message... (Press Enter to send)"
                      className="flex-1 bg-[#242424] border border-[#333333] focus:border-[#ffa116] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="px-4 py-2 bg-[#ffa116] hover:bg-[#ffb800] text-black font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              ) : consoleTab === "result" ? (
                runResult.status === "Runtime Error" ? (
                  /* Runtime Error View (Exact match to uploaded LeetCode screenshot) */
                  <div className="space-y-3">
                    {/* Status Title */}
                    <div className="text-[#ef4743] font-bold text-base">Runtime Error</div>

                    {/* Red Error Box */}
                    <div className="p-3.5 bg-[#2d1818] border border-red-950/60 rounded-lg text-[#ef4743] font-mono text-xs whitespace-pre-wrap leading-relaxed select-text">
                      {runResult.errorOutput ||
                        `IndentationError: expected an indented block after function definition on line 60\n    import sys\nLine 4  (Solution.py)`}
                    </div>

                    {/* Last Executed Input Header with Open Testcase */}
                    <div className="flex items-center justify-between text-xs text-[#8a8a8a] pt-1 font-sans">
                      <span>Last Executed Input</span>
                      <button
                        onClick={() => setConsoleTab("testcase")}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      >
                        <span>Open Testcase</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Param Label & Input Box */}
                    <div className="space-y-1">
                      <div className="text-[11px] text-[#8a8a8a] font-mono">
                        {problem.id === 1267 ? "grid =" : problem.id === 1 ? "nums = , target =" : "x ="}
                      </div>
                      <div className="p-3 bg-[#242424] border border-[#2e2e2e] rounded-lg text-white font-mono text-xs select-text">
                        {testCases[activeCaseIdx]?.input.replace(/^[a-z0-9_]+\s*=\s*/i, "") || "123"}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Accepted View (Exact LeetCode Cases, Input, Output, Expected) */
                  <div className="space-y-3">
                    {/* Status Row */}
                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-[#2ebd59]">
                        Accepted
                      </span>
                      <span className="text-xs text-[#8a8a8a] font-normal">
                        Runtime: {runResult.runtime}
                      </span>
                    </div>

                    {/* Case Pills Row */}
                    <div className="flex items-center gap-2">
                      {runResult.cases.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveCaseIdx(i)}
                          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeCaseIdx === i
                              ? "bg-[#333333] text-white"
                              : "bg-[#242424] text-[#8a8a8a] hover:text-white"
                          }`}
                        >
                          <Check className="w-3 h-3 text-[#2ebd59]" />
                          <span>Case {i + 1}</span>
                        </button>
                      ))}
                    </div>

                    {/* Input Box */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-[#8a8a8a] font-sans">Input</div>
                      {problem.id === 1 ? (
                        <div className="space-y-2.5">
                          <div>
                            <div className="text-[11px] text-[#8a8a8a] font-mono mb-1">nums =</div>
                            <div className="p-3 bg-[#242424] border border-[#2e2e2e] rounded-lg text-white font-mono text-xs">
                              {activeCaseIdx === 0 ? "[2,7,11,15]" : activeCaseIdx === 1 ? "[3,2,4]" : "[3,3]"}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-[#8a8a8a] font-mono mb-1">target =</div>
                            <div className="p-3 bg-[#242424] border border-[#2e2e2e] rounded-lg text-white font-mono text-xs">
                              {activeCaseIdx === 0 ? "9" : "6"}
                            </div>
                          </div>
                        </div>
                      ) : problem.id === 1267 ? (
                        <div>
                          <div className="text-[11px] text-[#8a8a8a] font-mono mb-1">grid =</div>
                          <div className="p-3 bg-[#242424] border border-[#2e2e2e] rounded-lg text-white font-mono text-xs whitespace-pre-wrap">
                            {activeCaseIdx === 0
                              ? "[[1,0],[0,1]]"
                              : activeCaseIdx === 1
                              ? "[[1,0],[1,1]]"
                              : "[[1,1,0,0],[0,0,1,0],[0,0,1,0],[0,0,0,1]]"}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[11px] text-[#8a8a8a] font-mono mb-1">x =</div>
                          <div className="p-3 bg-[#242424] border border-[#2e2e2e] rounded-lg text-white font-mono whitespace-pre-wrap text-xs">
                            {runResult.cases[activeCaseIdx]?.input.replace(/^[a-z0-9_]+\s*=\s*/i, "") || "123"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Output Box */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-[#8a8a8a] font-sans">Output</div>
                      <div className="p-3 bg-[#242424] border border-[#2e2e2e] rounded-lg text-white font-mono text-xs">
                        {runResult.cases[activeCaseIdx]?.output}
                      </div>
                    </div>

                    {/* Expected Output Box */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-[#8a8a8a] font-sans">Expected</div>
                      <div className="p-3 bg-[#242424] border border-[#2e2e2e] rounded-lg text-[#2ebd59] font-mono text-xs">
                        {runResult.cases[activeCaseIdx]?.expected}
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* Testcase Input View */
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {testCases.map((tc, i) => (
                      <button
                        key={tc.id}
                        onClick={() => setActiveCaseIdx(i)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          activeCaseIdx === i
                            ? "bg-[#333333] text-white"
                            : "bg-[#242424] text-[#8a8a8a] hover:text-white"
                        }`}
                      >
                        Case {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const newCase: TestCase = {
                          id: String(testCases.length + 1),
                          name: `Case ${testCases.length + 1}`,
                          input: "x = 0",
                          expectedOutput: "0",
                        };
                        setTestCases([...testCases, newCase]);
                        setActiveCaseIdx(testCases.length);
                      }}
                      className="p-1 rounded text-[#8a8a8a] hover:text-white hover:bg-[#282828]"
                      title="Add Custom Case"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-[#8a8a8a] font-sans">Input Data</div>
                    <textarea
                      rows={4}
                      value={testCases[activeCaseIdx]?.input || ""}
                      onChange={(e) => {
                        const updated = [...testCases];
                        if (updated[activeCaseIdx]) {
                          updated[activeCaseIdx].input = e.target.value;
                          setTestCases(updated);
                        }
                      }}
                      className="w-full bg-[#242424] border border-[#333333] focus:border-[#555555] rounded p-3 text-white font-mono text-xs focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Console Action Buttons Bar */}
            <div className="h-10 bg-[#222222] border-t border-[#282828] px-3 flex items-center justify-between text-xs shrink-0">
              <button
                onClick={() => setConsoleTab(consoleTab === "testcase" ? "result" : "testcase")}
                className="text-[#8a8a8a] hover:text-white flex items-center gap-1 font-medium"
              >
                <span>Console</span>
                <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-3 py-1 rounded bg-[#383838] hover:bg-[#454545] text-white font-medium transition-colors"
                >
                  {isRunning ? "Running..." : "Run"}
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={isRunning}
                  className="px-3.5 py-1 rounded bg-[#2ebd59] hover:bg-[#28a74e] text-black font-semibold transition-colors disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Username Prompt Modal */}
      <UsernamePromptModal />
    </div>
  );
}
