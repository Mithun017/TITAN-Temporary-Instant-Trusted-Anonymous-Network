import { NextRequest, NextResponse } from "next/server";

interface StoredMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderAlias: string;
  content: string;
  messageType: string;
  timestamp: number;
}

// Global in-memory storage for serverless runtime
declare global {
  // eslint-disable-next-line no-var
  var __titan_channel_messages: Map<string, StoredMessage[]> | undefined;
}

if (!global.__titan_channel_messages) {
  global.__titan_channel_messages = new Map();
}

const channelMap = global.__titan_channel_messages;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId") || "problem-7";
  const since = parseInt(searchParams.get("since") || "0", 10);

  const messages = channelMap.get(channelId) || [];
  const filtered = messages.filter((m) => m.timestamp > since);

  return NextResponse.json({
    channelId,
    messages: filtered,
    total: messages.length,
    serverTime: Date.now(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channelId = "problem-7", message } = body;

    if (!message || !message.content) {
      return NextResponse.json({ error: "Invalid message payload" }, { status: 400 });
    }

    const newMsg: StoredMessage = {
      id: message.id || `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      channelId,
      senderId: message.senderId || "anon",
      senderAlias: message.senderAlias || "Anonymous",
      content: message.content,
      messageType: message.messageType || "text",
      timestamp: message.timestamp || Date.now(),
    };

    let list = channelMap.get(channelId);
    if (!list) {
      list = [];
      channelMap.set(channelId, list);
    }

    list.push(newMsg);
    if (list.length > 500) {
      list.splice(0, list.length - 500);
    }

    return NextResponse.json({
      success: true,
      message: newMsg,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

