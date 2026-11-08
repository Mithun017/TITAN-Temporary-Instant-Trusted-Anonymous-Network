"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRoomStore } from "@/stores/roomStore";
import { EventEnvelope, Message, StructuredTestCase, MessageType } from "@/types";
import { encryptText, decryptText } from "@/lib/crypto";

export function useRealtime() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const {
    room,
    me,
    cryptoKey,
    connectionState,
    setConnectionState,
    setPartner,
    setPartnerIsTyping,
    addMessage,
    updateMessageStatus,
    addAttachment,
    resetSession,
  } = useRoomStore();

  const connect = useCallback(() => {
    if (!room || !me) return;

    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setConnectionState("connecting");

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?roomId=${encodeURIComponent(room.roomId)}&participantId=${encodeURIComponent(me.id)}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionState("connected");
      retryCountRef.current = 0;

      // Start ping heartbeat every 15 seconds
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 15000);
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "pong") return;

        const envelope = data as EventEnvelope<any>;

        switch (envelope.type) {
          case "connection.ready":
            setConnectionState("connected");
            break;

          case "room.state":
            if (envelope.payload?.participants) {
              const partnerUser = envelope.payload.participants.find(
                (p: any) => p.id !== me.id
              );
              setPartner(partnerUser || null);
            }
            break;

          case "participant.joined":
            if (envelope.payload && envelope.payload.id !== me.id) {
              setPartner(envelope.payload);
            }
            break;

          case "participant.left":
            setPartner(null);
            break;

          case "typing.start":
            if (envelope.senderId !== me.id) {
              setPartnerIsTyping(true);
            }
            break;

          case "typing.stop":
            if (envelope.senderId !== me.id) {
              setPartnerIsTyping(false);
            }
            break;

          case "message.ack": {
            const { messageId, roomSequence, status } = envelope.payload;
            updateMessageStatus(messageId, status === "accepted" ? "sent" : "failed", roomSequence);
            break;
          }

          case "message.delivered": {
            const { messageId } = envelope.payload;
            updateMessageStatus(messageId, "delivered");
            break;
          }

          case "message.receive": {
            const payload = envelope.payload;
            if (!cryptoKey) {
              console.warn("Received message but cryptoKey is not ready");
              return;
            }

            try {
              const decryptedRaw = await decryptText(cryptoKey, payload.ciphertext, payload.iv);
              let content = decryptedRaw;
              let structured: StructuredTestCase | undefined;

              if (payload.messageType === "structured") {
                try {
                  structured = JSON.parse(decryptedRaw);
                  content = `Input: ${structured?.input || ""}\nExpected: ${structured?.expected || ""}\n${structured?.notes ? `Notes: ${structured.notes}` : ""}`;
                } catch {
                  // Fallback
                }
              }

              const incomingMsg: Message = {
                id: payload.messageId,
                roomId: room.roomId,
                senderId: envelope.senderId || "partner",
                senderSlot: me.slot === 1 ? 2 : 1,
                senderAlias: envelope.payload.senderAlias || "Partner",
                messageType: payload.messageType,
                content: content,
                codeLanguage: payload.codeLanguage,
                structured: structured,
                parentMessageId: payload.parentMessageId,
                sequenceNumber: envelope.payload.sequenceNumber || Date.now(),
                timestamp: envelope.sentAt,
                status: "received",
              };

              addMessage(incomingMsg);

              // Send delivery acknowledgement
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({
                    version: 1,
                    eventId: crypto.randomUUID(),
                    type: "message.delivered",
                    roomId: room.roomId,
                    sentAt: Date.now(),
                    senderId: me.id,
                    payload: { messageId: payload.messageId },
                  })
                );
              }
            } catch (decErr) {
              console.error("Decryption failed for received message:", decErr);
            }
            break;
          }

          case "attachment.share": {
            const payload = envelope.payload;
            if (!cryptoKey) return;

            try {
              const decryptedDataUrl = await decryptText(cryptoKey, payload.ciphertext, payload.iv);
              addAttachment({
                id: payload.id,
                roomId: room.roomId,
                senderId: envelope.senderId || "partner",
                senderAlias: payload.senderAlias || "Partner",
                senderSlot: me.slot === 1 ? 2 : 1,
                filename: payload.filename,
                mimeType: payload.mimeType,
                byteSize: payload.byteSize,
                caption: payload.caption,
                dataUrl: decryptedDataUrl,
                timestamp: envelope.sentAt,
                expiresAt: payload.expiresAt,
              });
            } catch (attErr) {
              console.error("Failed to decrypt attachment:", attErr);
            }
            break;
          }

          case "room.expired":
          case "room.close":
            setConnectionState("expired");
            resetSession();
            break;

          default:
            break;
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    };

    ws.onclose = (event) => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);

      if (event.code === 4004 || event.code === 4003) {
        // Room full or unauthorized
        setConnectionState("expired");
        return;
      }

      setConnectionState("reconnecting");

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(1.5, retryCountRef.current), 10000);
      retryCountRef.current += 1;

      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, delay);
    };

    ws.onerror = (err) => {
      console.warn("WebSocket connection error:", err);
      ws.close();
    };
  }, [room, me, cryptoKey, setConnectionState, setPartner, setPartnerIsTyping, addMessage, updateMessageStatus, addAttachment, resetSession]);

  useEffect(() => {
    if (room && me) {
      connect();
    }

    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [room?.roomId, me?.id, connect]);

  // Send message action
  const sendMessage = async (
    content: string,
    messageType: MessageType = "text",
    codeLanguage?: string,
    structured?: StructuredTestCase,
    parentMessageId?: string
  ) => {
    if (!room || !me || !cryptoKey || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      throw new Error("Cannot send message: WebSocket or crypto session not connected");
    }

    const messageId = crypto.randomUUID();
    const rawPayload = messageType === "structured" && structured ? JSON.stringify(structured) : content;

    // Encrypt client-side
    const { ciphertext, iv } = await encryptText(cryptoKey, rawPayload);

    // Optimistically add to local store
    const localMessage: Message = {
      id: messageId,
      roomId: room.roomId,
      senderId: me.id,
      senderSlot: me.slot,
      senderAlias: me.alias,
      messageType,
      content,
      codeLanguage,
      structured,
      parentMessageId,
      sequenceNumber: Date.now(),
      timestamp: Date.now(),
      status: "sending",
    };
    addMessage(localMessage);

    // Send encrypted envelope
    const envelope: EventEnvelope = {
      version: 1,
      eventId: crypto.randomUUID(),
      type: "message.send",
      roomId: room.roomId,
      sentAt: Date.now(),
      senderId: me.id,
      payload: {
        messageId,
        parentMessageId,
        ciphertext,
        iv,
        messageType,
        codeLanguage,
        senderAlias: me.alias,
      },
    };

    wsRef.current.send(JSON.stringify(envelope));
  };

  // Send attachment action
  const sendAttachment = async (
    filename: string,
    mimeType: string,
    byteSize: number,
    dataUrl: string,
    caption?: string
  ) => {
    if (!room || !me || !cryptoKey || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      throw new Error("Cannot send attachment: WebSocket or crypto session not connected");
    }

    const attachmentId = crypto.randomUUID();
    const { ciphertext, iv } = await encryptText(cryptoKey, dataUrl);

    // Add locally
    addAttachment({
      id: attachmentId,
      roomId: room.roomId,
      senderId: me.id,
      senderAlias: me.alias,
      senderSlot: me.slot,
      filename,
      mimeType,
      byteSize,
      caption,
      dataUrl,
      timestamp: Date.now(),
      expiresAt: room.expiresAt,
    });

    const envelope: EventEnvelope = {
      version: 1,
      eventId: crypto.randomUUID(),
      type: "attachment.share",
      roomId: room.roomId,
      sentAt: Date.now(),
      senderId: me.id,
      payload: {
        id: attachmentId,
        filename,
        mimeType,
        byteSize,
        caption,
        ciphertext,
        iv,
        senderAlias: me.alias,
        expiresAt: room.expiresAt,
      },
    };

    wsRef.current.send(JSON.stringify(envelope));
  };

  const sendTyping = (isTyping: boolean) => {
    if (!room || !me || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const envelope: EventEnvelope = {
      version: 1,
      eventId: crypto.randomUUID(),
      type: isTyping ? "typing.start" : "typing.stop",
      roomId: room.roomId,
      sentAt: Date.now(),
      senderId: me.id,
      payload: {},
    };
    wsRef.current.send(JSON.stringify(envelope));
  };

  return {
    connectionState,
    sendMessage,
    sendAttachment,
    sendTyping,
  };
}

