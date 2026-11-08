"use client";

import React, { useState } from "react";
import { useRoomStore } from "@/stores/roomStore";
import { deriveKey, computeFingerprint } from "@/lib/crypto";
import { KeyRound, Users, Sparkles, AlertCircle, Copy, Check, X, Shield } from "lucide-react";
import { Room, Participant } from "@/types";

export function JoinCreateModal() {
  const {
    isJoinCreateOpen,
    setIsJoinCreateOpen,
    setRoom,
    setMe,
    setCryptoKey,
    setFingerprint,
  } = useRoomStore();

  const [tab, setTab] = useState<"create" | "join">("create");

  // Create state
  const [createAlias, setCreateAlias] = useState("Participant 1");
  const [createPassphrase, setCreatePassphrase] = useState("");
  const [createdRoomInfo, setCreatedRoomInfo] = useState<{ code: string; pass: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Join state
  const [joinCode, setJoinCode] = useState("");
  const [joinPassphrase, setJoinPassphrase] = useState("");
  const [joinAlias, setJoinAlias] = useState("Participant 2");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isJoinCreateOpen) return null;

  const handleGenerateSecret = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let rand = "";
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) rand += "-";
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreatePassphrase(rand);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!createPassphrase.trim()) {
      setError("Please provide a session passphrase.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alias: createAlias.trim() || "Participant 1",
          passphrase: createPassphrase.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize session");

      const key = await deriveKey(createPassphrase.trim(), data.salt);
      const fingerprint = await computeFingerprint(key, data.salt);

      const newRoom: Room = {
        roomId: data.roomId,
        roomCode: data.roomCode,
        salt: data.salt,
        createdAt: Date.now(),
        expiresAt: data.expiresAt,
        status: "WAITING_FOR_PARTNER",
        participants: [
          {
            id: data.participantId,
            alias: createAlias.trim() || "Participant 1",
            slot: 1,
            isConnected: true,
            joinedAt: Date.now(),
            lastActiveAt: Date.now(),
          },
        ],
        maxParticipants: 2,
      };

      setRoom(newRoom);
      setMe({
        id: data.participantId,
        alias: createAlias.trim() || "Participant 1",
        slot: 1,
        isConnected: true,
        joinedAt: Date.now(),
        lastActiveAt: Date.now(),
      });
      setCryptoKey(key);
      setFingerprint(fingerprint);

      setCreatedRoomInfo({
        code: data.roomCode,
        pass: createPassphrase.trim(),
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!joinCode.trim()) {
      setError("Please enter the Session Code.");
      return;
    }
    if (!joinPassphrase.trim()) {
      setError("Please enter the Session Passphrase.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: joinCode.trim(),
          passphrase: joinPassphrase.trim(),
          alias: joinAlias.trim() || "Participant 2",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join session");

      const key = await deriveKey(joinPassphrase.trim(), data.salt);
      const fingerprint = await computeFingerprint(key, data.salt);

      const joinedRoom: Room = {
        roomId: data.roomId,
        roomCode: data.roomCode,
        salt: data.salt,
        createdAt: Date.now(),
        expiresAt: data.expiresAt,
        status: "ACTIVE",
        participants: data.participants,
        maxParticipants: 2,
      };

      setRoom(joinedRoom);
      setMe({
        id: data.participantId,
        alias: joinAlias.trim() || "Participant 2",
        slot: data.slot,
        isConnected: true,
        joinedAt: Date.now(),
        lastActiveAt: Date.now(),
      });
      setCryptoKey(key);
      setFingerprint(fingerprint);
      setIsJoinCreateOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to join session");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!createdRoomInfo) return;
    navigator.clipboard.writeText(`Session Code: ${createdRoomInfo.code}\nPassphrase: ${createdRoomInfo.pass}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#242424] border border-[#333333] rounded-xl max-w-md w-full p-6 shadow-2xl relative text-[#eff1f3]">
        <button
          onClick={() => setIsJoinCreateOpen(false)}
          className="absolute top-4 right-4 text-[#8a8a8a] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex border-b border-[#333333] mb-5">
          <button
            onClick={() => {
              setTab("create");
              setError(null);
            }}
            className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              tab === "create"
                ? "border-[#ffa116] text-white"
                : "border-transparent text-[#8a8a8a] hover:text-white"
            }`}
          >
            Create Session
          </button>
          <button
            onClick={() => {
              setTab("join");
              setError(null);
            }}
            className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              tab === "join"
                ? "border-[#ffa116] text-white"
                : "border-transparent text-[#8a8a8a] hover:text-white"
            }`}
          >
            Join Session
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-[#ff375f] shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {tab === "create" ? (
          createdRoomInfo ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#1a1a1a] border border-[#333333] rounded-lg text-center">
                <div className="text-[11px] text-[#8a8a8a] uppercase tracking-wider mb-1">Session Initialized</div>
                <div className="text-xl font-mono text-[#ffa116] font-bold tracking-wider">{createdRoomInfo.code}</div>
              </div>

              <div className="text-xs text-zinc-300">
                Share this Session Code and Passphrase with your peer. When connected, open <strong className="text-white">7. Reverse Integer</strong> to collaborate.
              </div>

              <div className="p-3 bg-[#1a1a1a] border border-[#333333] rounded font-mono text-xs">
                <span className="text-[#8a8a8a]">Passphrase:</span> {createdRoomInfo.pass}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#333333] hover:bg-[#3d3d3d] text-white rounded text-xs font-medium transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-[#2ebd59]" /> : <Copy className="w-4 h-4" />}
                  {copiedCode ? "Copied" : "Copy Credentials"}
                </button>
                <button
                  onClick={() => setIsJoinCreateOpen(false)}
                  className="px-4 py-2 bg-[#ffa116] hover:bg-[#ffb800] text-black font-semibold rounded text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8a8a8a] mb-1 uppercase tracking-wider text-[11px]">
                  Display Alias
                </label>
                <input
                  type="text"
                  value={createAlias}
                  onChange={(e) => setCreateAlias(e.target.value)}
                  maxLength={24}
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ffa116]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#8a8a8a] uppercase tracking-wider text-[11px]">
                    Session Passphrase
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSecret}
                    className="text-[#ffa116] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Sparkles className="w-3 h-3" /> Generate Random
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#707070] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={createPassphrase}
                    onChange={(e) => setCreatePassphrase(e.target.value)}
                    placeholder="e.g. 78XQ-9M21-KP02"
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 pl-9 font-mono text-white text-xs focus:outline-none focus:border-[#ffa116]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#ffa116] hover:bg-[#ffb800] text-black font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Start Pair Session"}
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleJoinRoom} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8a8a8a] mb-1 uppercase tracking-wider text-[11px]">
                Session Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. TITAN-9481-AB"
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 font-mono text-white text-xs uppercase focus:outline-none focus:border-[#ffa116]"
              />
            </div>

            <div>
              <label className="block text-[#8a8a8a] mb-1 uppercase tracking-wider text-[11px]">
                Session Passphrase
              </label>
              <input
                type="text"
                value={joinPassphrase}
                onChange={(e) => setJoinPassphrase(e.target.value)}
                placeholder="Enter passphrase"
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 font-mono text-white text-xs focus:outline-none focus:border-[#ffa116]"
              />
            </div>

            <div>
              <label className="block text-[#8a8a8a] mb-1 uppercase tracking-wider text-[11px]">
                Display Alias
              </label>
              <input
                type="text"
                value={joinAlias}
                onChange={(e) => setJoinAlias(e.target.value)}
                maxLength={24}
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ffa116]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#ffa116] hover:bg-[#ffb800] text-black font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Users className="w-4 h-4" />
              {loading ? "Connecting..." : "Join Pair Session"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
