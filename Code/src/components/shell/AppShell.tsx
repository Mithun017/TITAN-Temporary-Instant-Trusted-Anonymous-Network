"use client";

import React from "react";
import { TopBar } from "./TopBar";
import { JoinCreateModal } from "@/components/modals/JoinCreateModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { PrivacyModal } from "@/components/modals/PrivacyModal";
import { useRoomStore } from "@/stores/roomStore";
import { X, ZoomIn, Download } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { lightboxAttachment, setLightboxAttachment } = useRoomStore();

  return (
    <div className="min-h-screen bg-titan-bg flex flex-col font-sans">
      <TopBar />
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Global Modals */}
      <JoinCreateModal />
      <SettingsModal />
      <PrivacyModal />

      {/* Lightbox Modal for Contest Image Attachments */}
      {lightboxAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxAttachment(null)}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxAttachment.dataUrl}
              alt={lightboxAttachment.filename}
              className="max-w-full max-h-[80vh] object-contain rounded border border-titan-border"
            />
            <div className="mt-2 text-xs text-titan-muted flex flex-wrap items-center justify-between gap-4 bg-titan-surface/90 px-4 py-2.5 rounded border border-titan-border w-full">
              <div className="flex items-center gap-3">
                <span className="font-mono text-white font-medium">{lightboxAttachment.filename}</span>
                <span>{(lightboxAttachment.byteSize / 1024).toFixed(1)} KB</span>
                <span className="text-titan-accent font-medium">By {lightboxAttachment.senderAlias}</span>
                {lightboxAttachment.caption && <span className="text-zinc-300 italic">"{lightboxAttachment.caption}"</span>}
              </div>
              <a
                href={lightboxAttachment.dataUrl}
                download={lightboxAttachment.filename}
                className="flex items-center gap-1.5 px-3 py-1 bg-titan-accent text-black font-semibold rounded text-xs hover:bg-amber-400 transition-colors ml-auto"
              >
                <Download className="w-3.5 h-3.5" /> Save Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

