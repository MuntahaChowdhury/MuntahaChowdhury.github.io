// app/api/email/send/route.ts
import { NextResponse } from "next/server";
const v_epFnEmail = 'https://6a9dnycanc.execute-api.ap-southeast-1.amazonaws.com/email/sendOTP';

export async function POST(req: Request) {
    try {
        const { toEmail, otp } = await req.json();

        if (!toEmail || !otp) {
            return NextResponse.json(
                { message: 'Missing required fields: toEmail or otp' },
                { status: 400 }
            )
        }

        const v_resFnEmail = await fetch(
            v_epFnEmail,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ toEmail, otp })
            }
        )

        if (!v_resFnEmail.ok) {
            throw new Error('Failed to send email');
        }

        return NextResponse.json({ message: 'Email sent successfully' })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}