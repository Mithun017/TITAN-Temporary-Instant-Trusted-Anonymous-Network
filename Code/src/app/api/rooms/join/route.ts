import { NextRequest, NextResponse } from "next/server";
import { JoinRoomSchema } from "@/schemas";
import { joinRoom } from "@/server/roomManager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = JoinRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid join payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { roomCode, passphrase, alias } = parsed.data;

    const result = joinRoom(roomCode, passphrase, alias);

    if (!result.success || !result.room) {
      const isRoomFull = result.error?.includes("Room is full");
      return NextResponse.json(
        { error: result.error || "Unable to join room" },
        { status: isRoomFull ? 409 : 403 }
      );
    }

    return NextResponse.json({
      roomId: result.room.roomId,
      roomCode: result.room.roomCode,
      salt: result.room.salt,
      participantId: result.participantId,
      slot: result.slot,
      expiresAt: result.room.expiresAt,
      participants: result.room.participants,
    });
  } catch (err: any) {
    console.error("Room join error:", err);
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 });
  }
}

