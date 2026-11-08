"use client";

import React, { useState, useRef } from "react";
import { useRoomStore } from "@/stores/roomStore";
import { useRealtime } from "@/hooks/useRealtime";
import { formatTime } from "@/lib/utils";
import {
  Trophy,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  Maximize2,
  Calendar,
  ChevronRight,
  Download,
} from "lucide-react";

export function ContestView() {
  const {
    room,
    me,
    attachments,
    setLightboxAttachment,
    setIsJoinCreateOpen,
  } = useRoomStore();

  const { sendAttachment } = useRealtime();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !filePreview) return;
    if (!room || !me) {
      setIsJoinCreateOpen(true);
      return;
    }

    setUploading(true);
    try {
      await sendAttachment(
        selectedFile.name,
        selectedFile.type,
        selectedFile.size,
        filePreview,
        caption.trim() || undefined
      );
      setSelectedFile(null);
      setFilePreview(null);
      setCaption("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 space-y-6 text-[13px] text-[#eff1f3]">
      {/* Contest Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Contest Card */}
        <div className="rounded-xl p-5 bg-[#242424] border border-[#333333] space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#ffa116] uppercase tracking-wider">Weekly Contest</span>
            <span className="text-[11px] text-[#8a8a8a] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Starts in 2d 14h
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Weekly Contest 438</h2>
            <p className="text-xs text-[#a0a0a0] mt-1">Sunday 8:00 AM GMT+5:30</p>
          </div>
          <button
            onClick={() => setIsJoinCreateOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white text-xs font-semibold transition-colors"
          >
            {room ? "Sync Session Active" : "Register Now"}
          </button>
        </div>

        {/* Biweekly Contest Card */}
        <div className="rounded-xl p-5 bg-[#242424] border border-[#333333] space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3a86ff] uppercase tracking-wider">Biweekly Contest</span>
            <span className="text-[11px] text-[#8a8a8a] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Next Saturday
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Biweekly Contest 149</h2>
            <p className="text-xs text-[#a0a0a0] mt-1">Saturday 8:00 PM GMT+5:30</p>
          </div>
          <button className="px-4 py-1.5 rounded-lg bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white text-xs font-semibold transition-colors">
            Register Now
          </button>
        </div>
      </div>

      {/* Collaborative Solution Diagram / Scratchpad Upload */}
      <div className="rounded-xl p-5 bg-[#242424] border border-[#333333] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Contest Solution Diagrams & Scratchpad</h3>
            <p className="text-xs text-[#8a8a8a]">Upload solution sketches, state machines, or logic diagrams for peer collaboration.</p>
          </div>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#3a3a3a] hover:border-[#ffa116] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#1f1f1f]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
          />

          {filePreview ? (
            <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <img
                src={filePreview}
                alt="Diagram Preview"
                className="max-h-48 rounded border border-[#333333] object-contain"
              />
              <div className="flex items-center gap-3 text-xs text-[#8a8a8a]">
                <span className="text-white">{selectedFile?.name}</span>
                <span>{((selectedFile?.size || 0) / 1024).toFixed(1)} KB</span>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  className="text-[#ff375f] hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <UploadCloud className="w-7 h-7 text-[#ffa116]" />
              <div className="text-xs font-medium text-white">Click or drag image to share diagram</div>
              <p className="text-[11px] text-[#707070]">Supports PNG, JPEG, WebP up to 5MB</p>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Caption (e.g. Inverted binary tree flow)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex-1 bg-[#1e1e1e] border border-[#3a3a3a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ffa116]"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-1.5 bg-[#ffa116] hover:bg-[#ffb800] text-black font-semibold rounded text-xs transition-colors disabled:opacity-50"
            >
              {uploading ? "Sharing..." : "Share Diagram"}
            </button>
          </div>
        )}
      </div>

      {/* Shared Gallery Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider text-[#8a8a8a]">
          Shared Scratchpad Gallery ({attachments.length})
        </h3>

        {attachments.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#242424] border border-[#333333] text-center text-[#707070] text-xs">
            No solution diagrams shared yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {attachments.map((att) => (
              <div
                key={att.id}
                onClick={() => setLightboxAttachment(att)}
                className="bg-[#242424] border border-[#333333] hover:border-[#ffa116] rounded-xl overflow-hidden cursor-pointer group transition-all"
              >
                <div className="aspect-video bg-[#1a1a1a] overflow-hidden relative">
                  <img
                    src={att.dataUrl}
                    alt={att.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <div className="font-semibold text-white truncate">{att.filename}</div>
                  <div className="flex justify-between text-[11px] text-[#8a8a8a]">
                    <span>{(att.byteSize / 1024).toFixed(1)} KB</span>
                    <span>{formatTime(att.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
