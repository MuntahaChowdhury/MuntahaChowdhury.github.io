// app/api/email/send/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { toEmail, otp } = await req.json();

        if (!toEmail || !otp) {
            return NextResponse.json(
                { message: 'Missing required fields: toEmail or otp' },
                { status: 400 }
            )
        }

        const response = await fetch(
            'https://6a9dnycanc.execute-api.ap-southeast-1.amazonaws.com/email/sendOTP',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ toEmail, otp })
            }
        )

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return NextResponse.json({ message: 'Email sent successfully' })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}