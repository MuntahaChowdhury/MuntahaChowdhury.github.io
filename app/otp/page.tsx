// app/otp/page.tsx

"use client";
import { Suspense } from "react";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ReturnButton from "@/components/return";

export default function OtpSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SendOtpPage />
    </Suspense>
  )
}

const SendOtpPage = () => {
  const v_searchParams = useSearchParams();
  const v_router = useRouter();

  const p_email = v_searchParams.get("email") || "";
  const p_mobile = v_searchParams.get("mobile") || "";
  const p_redirectTo = v_searchParams.get("redirectTo") || "/";

  const [v_generatedOtp, setGeneratedOtp] = useState("");
  const [v_enteredOtp, setEnteredOtp] = useState("");
  const [v_message, setMessage] = useState("");
  const [v_loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Call API to generate OTP
      const v_resRtOtp = await fetch("/api/genotp");
      const v_resRtOtpWrap = await v_resRtOtp.json();
      const v_itemOtp = v_resRtOtpWrap.otp;
      setGeneratedOtp(v_itemOtp);

      // Call API to send OTP via email
      const v_resRtEmail = await fetch("/api/sendemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail: p_email, otp: v_itemOtp }),
      });

      if (!v_resRtEmail.ok) {
        throw new Error("Failed to send email.");
      }

      setMessage("OTP sent to your email successfully!");
    } catch (error) {
      console.error("Error in handleSendOtp:", error);
      setMessage("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (v_enteredOtp === v_generatedOtp) {
      setMessage("OTP verified successfully!");
      v_router.push(`${p_redirectTo}?verified=true`);
    } else {
      setMessage("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen text-white px-4 mt-10">
      <ReturnButton />    {/* Remove relative from above */}

      <div className="form-bg">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mt-4">Verify OTP</h2>
        </div>

        <p className="text-slate-300 bg-slate-900 p-4 rounded-lg">Email: {p_email}</p>
        <p className="text-slate-300 bg-slate-900 p-4 rounded-lg my-4">Mobile: {p_mobile}</p>

        <button
          onClick={handleSendOtp}
          disabled={v_loading}
        >
          {v_loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {v_generatedOtp && (
          <div style={{ marginTop: "20px" }}>
            <label>Enter OTP:</label>
            <input
              type="text"
              value={v_enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={!v_enteredOtp}
            >
              Verify OTP
            </button>
          </div>
        )}

        {v_message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              color: v_message.includes("successfully") ? "#28A745" : "#FF0000",
            }}
          >
            {v_message}
          </p>
        )}
      </div>
    </div>
  );
}
