// app/api/genotp/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    return NextResponse.json({ otp });
}