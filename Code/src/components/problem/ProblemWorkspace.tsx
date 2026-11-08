"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRoomStore } from "@/stores/roomStore";
import { useRealtime } from "@/hooks/useRealtime";
import { formatTime } from "@/lib/utils";
import { getDraft, saveDraft } from "@/lib/db";
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
  CheckCheck,
} from "lucide-react";

export function ProblemWorkspace() {
  const {
    room,
    me,
    partner,
    messages,
    activeTestCaseId,
    replyingToId,
    composerMode,
    composerText,
    composerLanguage,
    composerStructured,
    fingerprint,
    partnerIsTyping,
    connectionState,
    setActiveTestCaseId,
    setReplyingToId,
    setComposerMode,
    setComposerText,
    setComposerLanguage,
    setComposerStructured,
    resetComposer,
    setIsJoinCreateOpen,
    setIsSettingsOpen,
  } = useRoomStore();

  const { sendMessage, sendTyping } = useRealtime();

  const [activeTab, setActiveTab] = useState<"description" | "editorial" | "solutions" | "submissions">("description");
  const [consoleTab, setConsoleTab] = useState<"testcase" | "result">("testcase");
  const [submitting, setSubmitting] = useState(false);
  const [codeContent, setCodeContent] = useState(`function reverse(x: number): number {
    // LeetCode Solution Space
    let rev = 0;
    while (x !== 0) {
        let pop = x % 10;
        x = (x / 10) | 0;
        if (rev > Math.floor(2147483647 / 10)) return 0;
        if (rev < Math.ceil(-2147483648 / 10)) return 0;
        rev = rev * 10 + pop;
    }
    return rev;
};`);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  // Restore draft
  useEffect(() => {
    if (room?.roomId) {
      getDraft(room.roomId).then((saved) => {
        if (saved && !composerText) {
          setComposerText(saved);
        }
      });
    }
  }, [room?.roomId]);

  const handleInputChange = (text: string) => {
    setComposerText(text);
    if (room?.roomId) saveDraft(room.roomId, text);
    sendTyping(true);
  };

  const handleRunOrSubmit = async () => {
    if (!room || !me) {
      setIsJoinCreateOpen(true);
      return;
    }

    const payload = composerText.trim() || `x = 123`;
    setSubmitting(true);
    try {
      await sendMessage(
        payload,
        composerMode,
        composerMode === "code" ? composerLanguage : undefined,
        composerMode === "structured" ? composerStructured : undefined,
        replyingToId || undefined
      );
      resetComposer();
      if (room?.roomId) saveDraft(room.roomId, "");
      setConsoleTab("result");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const currentCases = messages.length > 0 ? messages : [
    {
      id: "case-1-default",
      roomId: "demo",
      senderId: "system",
      senderSlot: 1,
      senderAlias: "System",
      messageType: "text",
      content: "x = 123",
      sequenceNumber: 1,
      timestamp: Date.now(),
      status: "delivered",
    },
    {
      id: "case-2-default",
      roomId: "demo",
      senderId: "system",
      senderSlot: 1,
      senderAlias: "System",
      messageType: "text",
      content: "x = -123",
      sequenceNumber: 2,
      timestamp: Date.now(),
      status: "delivered",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-50px)] bg-[#1a1a1a] text-[#eff1f3] select-none">
      {/* Workspace Subheader Bar */}
      <div className="h-10 bg-[#282828] border-b border-[#333333] px-3 flex items-center justify-between text-xs">
        {/* Left: Problem Navigation */}
        <div className="flex items-center gap-2">
          <Link
            href="/problems"
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#333333] text-[#a0a0a0] hover:text-white transition-colors"
          >
            <List className="w-3.5 h-3.5" />
            <span>Problem List</span>
          </Link>
          <div className="flex items-center text-[#8a8a8a]">
            <button className="p-1 hover:text-white"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button className="p-1 hover:text-white"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
          <button className="p-1 text-[#8a8a8a] hover:text-[#ffa116]" title="Pick Random">
            <Shuffle className="w-3 h-3" />
          </button>
        </div>

        {/* Center: Action Buttons (Run / Submit) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunOrSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#383838] hover:bg-[#454545] text-white font-medium transition-colors"
          >
            <Play className="w-3 h-3 fill-current text-[#a0a0a0]" />
            <span>Run</span>
          </button>
          <button
            onClick={handleRunOrSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded bg-[#2ebd59] hover:bg-[#28a74e] text-black font-semibold transition-colors disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{submitting ? "Submitting..." : "Submit"}</span>
          </button>
        </div>

        {/* Right: Controls, Cloud Status & Timer */}
        <div className="flex items-center gap-3 text-[#8a8a8a]">
          {room && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#2ebd59]">
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Synced</span>
            </div>
          )}
          <button onClick={() => setIsSettingsOpen(true)} className="hover:text-white">
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button className="hover:text-white">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Two-Pane Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANE: LeetCode Problem Description */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#333333] flex flex-col bg-[#1a1a1a] overflow-hidden">
          {/* Tabs Header */}
          <div className="flex items-center bg-[#282828] border-b border-[#333333] px-3 text-xs">
            {[
              { id: "description", label: "Description", icon: FileCode },
              { id: "editorial", label: "Editorial" },
              { id: "solutions", label: "Solutions" },
              { id: "submissions", label: "Submissions" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-3.5 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                    : "text-[#8a8a8a] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Problem Detail Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px] leading-relaxed text-[#eff1f3]">
            {/* Title & Difficulty */}
            <div>
              <h1 className="text-xl font-bold text-white mb-2">7. Reverse Integer</h1>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ffc01e]/15 text-[#ffc01e]">
                  Medium
                </span>
                <span className="text-xs text-[#8a8a8a] flex items-center gap-1">
                  Topics: <span className="text-[#a0a0a0]">Math</span>
                </span>
                <span className="text-xs text-[#8a8a8a] hidden sm:inline">
                  Companies: <span className="text-[#a0a0a0]">Amazon, Apple, Bloomberg</span>
                </span>
              </div>
            </div>

            {/* Description Statement */}
            <div className="space-y-3 text-zinc-300">
              <p>
                Given a signed 32-bit integer <code className="bg-[#282828] text-white px-1.5 py-0.5 rounded font-mono text-xs">x</code>, return <code className="bg-[#282828] text-white px-1.5 py-0.5 rounded font-mono text-xs">x</code> with its digits reversed. If reversing <code className="bg-[#282828] text-white px-1.5 py-0.5 rounded font-mono text-xs">x</code> causes the value to go outside the signed 32-bit integer range <code className="bg-[#282828] text-white px-1.5 py-0.5 rounded font-mono text-xs">[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then return <code className="bg-[#282828] text-white px-1.5 py-0.5 rounded font-mono text-xs">0</code>.
              </p>
              <p>
                <strong className="text-white">Assume the environment does not allow you to store 64-bit integers (signed or unsigned).</strong>
              </p>
            </div>

            {/* Examples */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#242424] border border-[#333333] rounded-lg space-y-1">
                <div className="font-sans font-semibold text-white">Example 1:</div>
                <div><span className="text-[#8a8a8a]">Input:</span> x = 123</div>
                <div><span className="text-[#8a8a8a]">Output:</span> 321</div>
              </div>

              <div className="p-3 bg-[#242424] border border-[#333333] rounded-lg space-y-1">
                <div className="font-sans font-semibold text-white">Example 2:</div>
                <div><span className="text-[#8a8a8a]">Input:</span> x = -123</div>
                <div><span className="text-[#8a8a8a]">Output:</span> -321</div>
              </div>

              <div className="p-3 bg-[#242424] border border-[#333333] rounded-lg space-y-1">
                <div className="font-sans font-semibold text-white">Example 3:</div>
                <div><span className="text-[#8a8a8a]">Input:</span> x = 120</div>
                <div><span className="text-[#8a8a8a]">Output:</span> 21</div>
              </div>
            </div>

            {/* Constraints */}
            <div className="pt-2 border-t border-[#2d2d2d] text-xs">
              <h3 className="font-semibold text-white mb-2">Constraints:</h3>
              <ul className="list-disc list-inside space-y-1 font-mono text-zinc-400">
                <li>-2<sup>31</sup> &lt;= x &lt;= 2<sup>31</sup> - 1</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: LeetCode Code Editor + Testcase/Result Console */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#1a1a1a] overflow-hidden">
          {/* Monaco Code Editor Region */}
          <div className="h-1/2 border-b border-[#333333] flex flex-col bg-[#1e1e1e]">
            {/* Editor Toolbar */}
            <div className="h-9 bg-[#282828] border-b border-[#333333] px-3 flex items-center justify-between text-xs text-[#a0a0a0]">
              <div className="flex items-center gap-2">
                <select
                  value={composerLanguage}
                  onChange={(e) => setComposerLanguage(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="typescript" className="bg-[#282828]">TypeScript</option>
                  <option value="javascript" className="bg-[#282828]">JavaScript</option>
                  <option value="python" className="bg-[#282828]">Python3</option>
                  <option value="cpp" className="bg-[#282828]">C++</option>
                  <option value="java" className="bg-[#282828]">Java</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCodeContent(`function reverse(x: number): number {\n    // reset\n};`)}
                  className="hover:text-white"
                  title="Reset code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editor Textarea with syntax styling */}
            <div className="flex-1 p-3 overflow-auto font-mono text-xs">
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="w-full h-full bg-transparent resize-none text-[#eff1f3] focus:outline-none font-mono leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Testcase / Result Console Drawer */}
          <div className="h-1/2 flex flex-col bg-[#1a1a1a]">
            {/* Console Tabs */}
            <div className="h-9 bg-[#282828] border-b border-[#333333] px-3 flex items-center justify-between text-xs">
              <div className="flex items-center">
                <button
                  onClick={() => setConsoleTab("testcase")}
                  className={`py-2 px-3 font-semibold transition-colors relative ${
                    consoleTab === "testcase"
                      ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#ffa116]"
                      : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  Testcase
                </button>
                <button
                  onClick={() => setConsoleTab("result")}
                  className={`py-2 px-3 font-semibold transition-colors relative flex items-center gap-1.5 ${
                    consoleTab === "result"
                      ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#ffa116]"
                      : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  <span>Test Result</span>
                  {messages.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2ebd59]" />
                  )}
                </button>
              </div>

              {partnerIsTyping && (
                <span className="text-[11px] text-[#ffa116] animate-pulse font-mono">
                  Running test...
                </span>
              )}
            </div>

            {/* Console Content */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-3">
              {consoleTab === "testcase" ? (
                <div className="space-y-3">
                  {/* Case Tabs Row */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {currentCases.map((c, i) => (
                      <button
                        key={c.id || i}
                        onClick={() => {
                          setActiveCaseIndex(i);
                          setActiveTestCaseId(c.id);
                        }}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                          activeCaseIndex === i
                            ? "bg-[#333333] text-white"
                            : "bg-[#282828] text-[#8a8a8a] hover:text-white"
                        }`}
                      >
                        <span>Case {i + 1}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => setComposerText("")}
                      className="p-1 rounded text-[#8a8a8a] hover:text-white hover:bg-[#282828]"
                      title="Add Custom Case"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Active Case Input / Content */}
                  <div className="space-y-1 text-xs">
                    <div className="text-[11px] text-[#8a8a8a] font-sans">
                      {replyingToId ? `Reply to Case (references active session)` : `Input Parameter x =`}
                    </div>
                    <textarea
                      rows={4}
                      value={composerText}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder={currentCases[activeCaseIndex]?.content || "123"}
                      className="w-full bg-[#242424] border border-[#333333] focus:border-[#555555] rounded p-2.5 text-white font-mono text-xs focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                /* Test Result / Output Timeline */
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-[#8a8a8a] text-center py-6">
                      Please run code or submit testcase first.
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = msg.senderSlot === me?.slot;
                      return (
                        <div
                          key={msg.id}
                          className="p-3 rounded-lg bg-[#242424] border border-[#333333] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#2ebd59] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Accepted • Case #{idx + 1}
                            </span>
                            <span className="text-[#8a8a8a]">{formatTime(msg.timestamp)}</span>
                          </div>

                          <div className="text-zinc-200 whitespace-pre-wrap font-mono text-xs">
                            {msg.content}
                          </div>

                          <div className="flex justify-between items-center pt-1 border-t border-[#333333] text-[10px] text-[#8a8a8a]">
                            <span>Runtime: 0 ms</span>
                            <button
                              onClick={() => {
                                setReplyingToId(msg.id);
                                setConsoleTab("testcase");
                              }}
                              className="text-[#ffa116] hover:underline flex items-center gap-1"
                            >
                              <Reply className="w-3 h-3" /> Reply
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
