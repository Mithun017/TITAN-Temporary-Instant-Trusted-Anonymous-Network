"use client";

import React, { useState } from "react";
import { useRoomStore } from "@/stores/roomStore";
import { clearAllLocalData } from "@/lib/db";
import { Settings, Trash2, PowerOff, User, Clock, Check, X } from "lucide-react";
import { formatTime } from "@/lib/utils";

export function SettingsModal() {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    room,
    me,
    partner,
    setMe,
    resetSession,
  } = useRoomStore();

  const [aliasInput, setAliasInput] = useState(me?.alias || "");
  const [clearedNotice, setClearedNotice] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSaveAlias = () => {
    if (!aliasInput.trim() || !me) return;
    setMe({ ...me, alias: aliasInput.trim() });
  };

  const handleClearLocal = async () => {
    await clearAllLocalData();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  const handleDisconnect = () => {
    resetSession();
    setIsSettingsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#242424] border border-[#333333] rounded-xl max-w-md w-full p-6 shadow-2xl relative text-[#eff1f3]">
        <button
          onClick={() => setIsSettingsOpen(false)}
          className="absolute top-4 right-4 text-[#8a8a8a] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded bg-[#333333] text-white">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Cloud Sync & Preferences</h2>
            <p className="text-xs text-[#8a8a8a]">Manage your profile and pair session</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[#8a8a8a] mb-1 uppercase tracking-wider text-[11px]">
              Display Alias
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                maxLength={24}
                className="flex-1 bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffa116]"
              />
              <button
                onClick={handleSaveAlias}
                className="px-3 py-2 bg-[#333333] hover:bg-[#3d3d3d] text-white rounded font-medium"
              >
                Save
              </button>
            </div>
          </div>

          {room && (
            <div className="p-3.5 bg-[#1a1a1a] border border-[#333333] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8a]">Session Code:</span>
                <span className="font-mono text-white font-bold">{room.roomCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8a]">Role:</span>
                <span className="text-[#2ebd59] font-medium">Participant #{me?.slot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8a]">Peer Status:</span>
                <span className={partner ? "text-[#2ebd59]" : "text-[#8a8a8a]"}>
                  {partner ? `${partner.alias} (Connected)` : "Waiting for peer..."}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8a]">Expires:</span>
                <span className="text-[#8a8a8a]">{formatTime(room.expiresAt)}</span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-[#333333] flex justify-between items-center">
            <div>
              <div className="font-medium text-white">Clear Storage</div>
              <div className="text-[11px] text-[#8a8a8a]">Reset drafts and local storage</div>
            </div>
            <button
              onClick={handleClearLocal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333333] text-zinc-300 rounded border border-[#333333] transition-colors"
            >
              {clearedNotice ? <Check className="w-3.5 h-3.5 text-[#2ebd59]" /> : <Trash2 className="w-3.5 h-3.5 text-[#8a8a8a]" />}
              {clearedNotice ? "Cleared" : "Clear"}
            </button>
          </div>

          {room && (
            <div className="pt-2 border-t border-[#333333] flex justify-between items-center">
              <div>
                <div className="font-medium text-[#ff375f]">Disconnect Session</div>
                <div className="text-[11px] text-[#8a8a8a]">Leave pair session and clear keys</div>
              </div>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 rounded transition-colors"
              >
                <PowerOff className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
