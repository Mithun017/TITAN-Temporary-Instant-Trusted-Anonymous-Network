import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "TITAN",
    version: "1.0.0",
    timestamp: Date.now(),
    rules: {
      maxParticipants: 2,
      noPermanentDb: true,
      e2ee: "AES-256-GCM",
    },
  });
}

