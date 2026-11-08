"use client";

import React from "react";
import { useRoomStore } from "@/stores/roomStore";
import { ShieldCheck, Lock, AlertTriangle, EyeOff, ServerOff, X } from "lucide-react";

export function PrivacyModal() {
  const { isPrivacyOpen, setIsPrivacyOpen, fingerprint } = useRoomStore();

  if (!isPrivacyOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-titan-surface border border-titan-border rounded-lg max-w-xl w-full p-6 shadow-2xl relative text-titan-text max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsPrivacyOpen(false)}
          className="absolute top-4 right-4 text-titan-muted hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded bg-titan-accent/10 border border-titan-accent/30 text-titan-accent">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">TITAN Privacy & Security Architecture</h2>
            <p className="text-xs text-titan-muted">Connect privately. Chat freely. Leave no trace.</p>
          </div>
        </div>

        {fingerprint && (
          <div className="mb-4 p-3 bg-titan-codeBg border border-titan-border rounded">
            <div className="text-xs text-titan-muted uppercase tracking-wider mb-1">Active Safety Fingerprint</div>
            <div className="font-mono text-sm tracking-widest text-titan-accentGreen font-bold">
              {fingerprint}
            </div>
            <div className="text-[11px] text-titan-muted mt-1">
              Verify out-of-band that both participants see this exact 16-digit fingerprint.
            </div>
          </div>
        )}

        <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
          <div className="flex gap-3">
            <Lock className="w-4 h-4 text-titan-accent shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">End-to-End Encryption (AES-256-GCM)</strong>
              All messages and attachments are encrypted on your device using the Web Crypto API before transmission. The relay gateway receives only ciphertext and cannot read your payloads.
            </div>
          </div>

          <div className="flex gap-3">
            <ServerOff className="w-4 h-4 text-titan-accent shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">No Server-Side Chat Archive</strong>
              TITAN operates zero permanent message or image databases. Encrypted packets are routed ephemerally in volatile memory and destroyed once delivered or upon session expiration.
            </div>
          </div>

          <div className="flex gap-3">
            <EyeOff className="w-4 h-4 text-titan-accent shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Strict Two-Person Pair Constraint</strong>
              Rooms strictly admit exactly two authenticated participants. Any third attempt to join is atomically rejected by the gateway.
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-titan-accentAmber/10 border border-titan-accentAmber/30 rounded text-amber-200">
            <AlertTriangle className="w-5 h-5 text-titan-accentAmber shrink-0 mt-0.5" />
            <div>
              <strong className="text-titan-accentAmber block mb-0.5">Honest Technical Limits</strong>
              "Leave no trace" is an architectural commitment to zero persistent server retention. However, TITAN cannot prevent your peer from taking screenshots, recording their display, or saving files locally on their device. Always communicate with trusted peers.
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsPrivacyOpen(false)}
            className="px-4 py-2 bg-titan-border hover:bg-titan-hover text-white rounded text-xs font-medium transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

