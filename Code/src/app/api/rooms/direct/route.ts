import { NextRequest, NextResponse } from "next/server";
import { createOrJoinDirectRoom } from "@/server/roomManager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { roomCode, alias } = body;

    const result = createOrJoinDirectRoom(roomCode, alias);

    if (!result.success || !result.room) {
      return NextResponse.json(
        { error: result.error || "Unable to join direct link session" },
        { status: result.error?.includes("full") ? 409 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      isCreator: result.isCreator,
      roomId: result.room.roomId,
      roomCode: result.room.roomCode,
      salt: result.room.salt,
      participantId: result.participantId,
      slot: result.slot,
      expiresAt: result.room.expiresAt,
      participants: result.room.participants,
      passphrase: result.passphrase,
    });
  } catch (err: any) {
    console.error("Direct room session error:", err);
    return NextResponse.json(
      { error: "Failed to establish direct link session" },
      { status: 500 }
    );
  }
}
