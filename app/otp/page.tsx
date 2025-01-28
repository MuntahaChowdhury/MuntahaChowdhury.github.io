'use client'
import React, { useState } from "react";

export default function TestOtpPage() {
    const [toEmail, settoEmail] = useState('');
    const [otpToCheck, setOtpToCheck] = useState('');
    const [otp, setOtp] = useState('0');
    const [statement, setStatement] = useState('');

    const genOTP = async () => {
        try {
            const hasOtpRes = await fetch('/api/genotp', { method: 'GET' });
            const hasOtpResData = await hasOtpRes.json();
            if (!hasOtpRes.ok) {
                throw new Error(hasOtpResData.message);
            }
            setOtp(hasOtpResData.otp);
            setStatement('OTP generated');
            return hasOtpResData.otp;
        } catch {
            setStatement('Error with OTP [/app/otp]')
        }
    }

    const sendOTP = async () => {
        try {
            const otp = await genOTP();
            
            const res = await fetch('/api/email/send', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ toEmail, otp })
            })

            if (!res.ok) {
                throw new Error("Error sending OTP")
            }

            setStatement('OTP sent');
        } catch {
            setStatement('Error with OTP [/app/otp]')
        }
    }

    const checkOTP = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (otpToCheck === otp) setStatement('OTP Matches!');
        else setStatement('OTP did not match');
    }

    return (
        <>

            <div className="flex flex-col items-center justify-center">


                <form onSubmit={checkOTP} className="flex flex-col items-start space-y-4 mt-6">
                    {statement && <div className="text-red font-bold">{statement}</div>}
                    <label htmlFor="toEmail">Enter OTP:</label>
                    <input
                        type="email"
                        id="toEmail"
                        name="toEmail"
                        className="p-2 border-2"
                        placeholder="email"
                        value={toEmail}
                        onChange={(e) => settoEmail(e.target.value)}
                    />
                    <button className="bg-red-200 p-2" onClick={() => sendOTP()}>Send OTP</button>
                    <label htmlFor="otpToCheck">Enter OTP:</label>
                    <input
                        type="text"
                        id="otpToCheck"
                        name="otpToCheck"
                        className="p-2 border-2"
                        placeholder="otp"
                        value={otpToCheck}
                        onChange={(e) => setOtpToCheck(e.target.value)}
                    />
                    <button className="bg-red-200 p-2" type="submit">Check</button>

                    <button className="bg-blue-200 p-2" onClick={() => {setOtpToCheck(''); settoEmail('')}}>Clear fields</button>
                </form>

            </div>

        </>
    )
}