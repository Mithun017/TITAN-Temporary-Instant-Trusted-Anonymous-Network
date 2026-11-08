import { create } from "zustand";
import { Room, Participant, Message, ContestAttachment, StructuredTestCase, MessageType } from "@/types";

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "expired";

interface RoomStoreState {
  room: Room | null;
  me: Participant | null;
  partner: Participant | null;
  cryptoKey: CryptoKey | null;
  fingerprint: string | null;
  connectionState: ConnectionState;
  partnerIsTyping: boolean;

  // Problem 7 Chat Messages
  messages: Message[];
  activeTestCaseId: string | null;
  replyingToId: string | null;

  // Composer State
  composerMode: MessageType;
  composerText: string;
  composerLanguage: string;
  composerStructured: StructuredTestCase;

  // Contest Attachments
  attachments: ContestAttachment[];
  lightboxAttachment: ContestAttachment | null;

  // Modal Views
  isJoinCreateOpen: boolean;
  isSettingsOpen: boolean;
  isPrivacyOpen: boolean;

  // Actions
  setRoom: (room: Room | null) => void;
  setMe: (me: Participant | null) => void;
  setPartner: (partner: Participant | null) => void;
  setCryptoKey: (key: CryptoKey | null) => void;
  setFingerprint: (fingerprint: string | null) => void;
  setConnectionState: (state: ConnectionState) => void;
  setPartnerIsTyping: (isTyping: boolean) => void;

  addMessage: (msg: Message) => void;
  updateMessageStatus: (id: string, status: Message["status"], seq?: number) => void;
  setActiveTestCaseId: (id: string | null) => void;
  setReplyingToId: (id: string | null) => void;

  setComposerMode: (mode: MessageType) => void;
  setComposerText: (text: string) => void;
  setComposerLanguage: (lang: string) => void;
  setComposerStructured: (structured: StructuredTestCase) => void;
  resetComposer: () => void;

  addAttachment: (att: ContestAttachment) => void;
  setLightboxAttachment: (att: ContestAttachment | null) => void;

  setIsJoinCreateOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsPrivacyOpen: (open: boolean) => void;

  resetSession: () => void;
}

export const useRoomStore = create<RoomStoreState>((set) => ({
  room: null,
  me: null,
  partner: null,
  cryptoKey: null,
  fingerprint: null,
  connectionState: "disconnected",
  partnerIsTyping: false,

  messages: [],
  activeTestCaseId: null,
  replyingToId: null,

  composerMode: "text",
  composerText: "",
  composerLanguage: "typescript",
  composerStructured: { input: "", expected: "", notes: "" },

  attachments: [],
  lightboxAttachment: null,

  isJoinCreateOpen: false,
  isSettingsOpen: false,
  isPrivacyOpen: false,

  setRoom: (room) => set({ room }),
  setMe: (me) => set({ me }),
  setPartner: (partner) => set({ partner }),
  setCryptoKey: (cryptoKey) => set({ cryptoKey }),
  setFingerprint: (fingerprint) => set({ fingerprint }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setPartnerIsTyping: (partnerIsTyping) => set({ partnerIsTyping }),

  addMessage: (msg) =>
    set((state) => {
      // Check if message already exists
      const existingIdx = state.messages.findIndex((m) => m.id === msg.id);
      if (existingIdx !== -1) {
        const updated = [...state.messages];
        updated[existingIdx] = { ...updated[existingIdx], ...msg };
        return { messages: updated };
      }

      // If it is a reply, attach to parent as well
      if (msg.parentMessageId) {
        const parentIdx = state.messages.findIndex((m) => m.id === msg.parentMessageId);
        if (parentIdx !== -1) {
          const parent = state.messages[parentIdx];
          const replies = parent.replies ? [...parent.replies, msg] : [msg];
          const updated = [...state.messages];
          updated[parentIdx] = { ...parent, replies };
          return {
            messages: [...updated, msg],
            activeTestCaseId: state.activeTestCaseId || msg.id,
          };
        }
      }

      return {
        messages: [...state.messages, msg],
        activeTestCaseId: state.activeTestCaseId || msg.id,
      };
    }),

  updateMessageStatus: (id, status, seq) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, status, sequenceNumber: seq ?? m.sequenceNumber } : m
      ),
    })),

  setActiveTestCaseId: (activeTestCaseId) => set({ activeTestCaseId }),
  setReplyingToId: (replyingToId) => set({ replyingToId }),

  setComposerMode: (composerMode) => set({ composerMode }),
  setComposerText: (composerText) => set({ composerText }),
  setComposerLanguage: (composerLanguage) => set({ composerLanguage }),
  setComposerStructured: (composerStructured) => set({ composerStructured }),
  resetComposer: () =>
    set({
      composerText: "",
      composerStructured: { input: "", expected: "", notes: "" },
      replyingToId: null,
    }),

  addAttachment: (att) =>
    set((state) => {
      if (state.attachments.some((a) => a.id === att.id)) return state;
      return { attachments: [att, ...state.attachments] };
    }),
  setLightboxAttachment: (lightboxAttachment) => set({ lightboxAttachment }),

  setIsJoinCreateOpen: (isJoinCreateOpen) => set({ isJoinCreateOpen }),
  setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  setIsPrivacyOpen: (isPrivacyOpen) => set({ isPrivacyOpen }),

  resetSession: () =>
    set({
      room: null,
      me: null,
      partner: null,
      cryptoKey: null,
      fingerprint: null,
      connectionState: "disconnected",
      partnerIsTyping: false,
      messages: [],
      activeTestCaseId: null,
      replyingToId: null,
      composerText: "",
      composerStructured: { input: "", expected: "", notes: "" },
      attachments: [],
      lightboxAttachment: null,
    }),
}));

