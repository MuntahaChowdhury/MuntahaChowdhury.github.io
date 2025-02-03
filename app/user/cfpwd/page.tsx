// app/user/cfpwd/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReturnButton from "@/component/return";


const ChangePasswordPage = () => {
    const v_router = useRouter();
    const v_searchParams = useSearchParams();
    const v_isVerified = v_searchParams.get("verified") === "true";

    // State variables
    const [v_newPassword, setNewPassword] = useState(() => sessionStorage.getItem("v_newPassword") || "");
    const [v_confirmPassword, setConfirmPassword] = useState("");
    const [v_error, setError] = useState("");
    const [v_isProcessing, setIsProcessing] = useState(false);
    const [v_showLoginButton, setShowLoginButton] = useState(false);

    // Variables for logged info from v_cookies
    //   const [username, setUserName] = useState("");
    const [v_lname, setLastName] = useState("");
    const [v_email, setEmail] = useState("");
    const [v_mobile, setMobile] = useState("");

    // Parse v_cookies and retrieve data
    useEffect(() => {
        const v_cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {} as Record<string, string>);

        //console.log("Parsed v_cookies:", v_cookies); // Debugging v_cookies

        // Set username and handle missing value
        const v_retrievedUsername = v_cookies.username || "";
        if (v_retrievedUsername) {
            //  setUserName(v_retrievedUsername);
        } else {
            setError("Username is missing. Redirecting to login...");
            v_router.push("/user/login");
            return;
        }

        // Set other details
        setLastName(v_cookies.lname || "User");
        setEmail(v_cookies.email || "");
        setMobile(v_cookies.mobile || "");

        // Trigger password change only after username is set
        if (v_isVerified) { handlePasswordChange(v_retrievedUsername); }

    }, [v_isVerified, v_router]);


    // Save v_newPassword to sessionStorage when it changes
    useEffect(() => {
        if (v_newPassword) { sessionStorage.setItem("newPassword", v_newPassword); }
    }, [v_newPassword]);

    // Handle sending OTP
    const handleSendOtp = () => {
        if (!v_newPassword || !v_confirmPassword) { setError("Both password fields are required."); return; }
        if (v_newPassword !== v_confirmPassword) { setError("Passwords do not match!"); return; }
        setError("");
        v_router.push(`/otp?email=${encodeURIComponent(v_email)}&mobile=${encodeURIComponent(v_mobile)}&redirectTo=/user/cfpwd`);
    };


    //========================================================================================
    const handlePasswordChange = async (v_retrievedUsername: string) => {
        setIsProcessing(true);

        const v_storedPassword = sessionStorage.getItem("newPassword") || "";
        const v_payload = {
            username: v_retrievedUsername,
            newPassword: v_storedPassword,
            operation: "CFPWD",
        };

        //console.log("Payload for Password-Change Route:", v_payload);

        try {
            const v_resRt = await fetch("/api/user/cfpwd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(v_payload),
            });

            const v_resRtWrap = await v_resRt.json();
            //console.log("Response for Password-Change Route:", v_resRtWrap);

            if (v_resRtWrap.data?.result === "success") {
                sessionStorage.removeItem("newPassword");
                // Clear v_cookies after successful password change
                const v_cookiesToClear = ["username", "lname", "email", "mobile", "usrid", "fname", "expired", "tempcode", "token", "result"];
                v_cookiesToClear.forEach((cookie) => { document.cookie = `${cookie}=; path=/; max-age=0`; });

                setIsProcessing(false);
                setShowLoginButton(true);
            } else {
                setIsProcessing(false);
                setError(v_resRtWrap.message || "Failed to handle password change.");
            }
            //   } catch (err) {
        } catch {
            setIsProcessing(false);
            setError("An v_error occurred while processing. Please try again.");
        }
    };

    //======================================================================================
    const handleLogin = () => { v_router.push("/user/login"); };

    return (
        <div className="relative flex items-center justify-center text-white px-4 mt-10">
            <ReturnButton />    {/* Remove relative from above */}
            <div className="shadow-lg rounded-xl p-8 max-w-md w-full bg-slate-800 bg-opacity-40">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mt-4">Change Password</h2>
                    <p> Welcome, <strong>{v_lname}</strong>! </p>
                </div>
                {!v_isVerified ? (
                    <>
                        <div>
                            <label>
                                New Password:
                                <input
                                    type="password"
                                    value={v_newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </label>
                        </div>

                        <div className="my-6">
                            <label>
                                Confirm Password:
                                <input
                                    type="password"
                                    value={v_confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </label>
                        </div>

                        <button onClick={handleSendOtp}
                        >
                            Send OTP
                        </button>
                    </>
                ) : (
                    <>
                        {v_isProcessing && <p style={{ marginTop: "20px" }}>Processing...</p>}
                        {v_showLoginButton && (
                            <button
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        )}
                    </>
                )}
                {v_error && <p style={{ color: "red", marginTop: "10px" }}>{v_error}</p>}
            </div>
        </div>
    );
};

export default ChangePasswordPage;
