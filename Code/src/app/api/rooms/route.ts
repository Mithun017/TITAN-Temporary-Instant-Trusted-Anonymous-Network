import { NextRequest, NextResponse } from "next/server";
import { CreateRoomSchema } from "@/schemas";
import { createRoom } from "@/server/roomManager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid room creation payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { alias, passphrase } = parsed.data;
    const ttlSeconds = parseInt(process.env.ROOM_TTL_SECONDS || "1800", 10);

    const { room, participantId } = createRoom(alias, passphrase, ttlSeconds);

    return NextResponse.json({
      roomId: room.roomId,
      roomCode: room.roomCode,
      salt: room.salt,
      participantId,
      expiresAt: room.expiresAt,
      status: room.status,
    });
  } catch (err: any) {
    console.error("Room creation error:", err);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}

