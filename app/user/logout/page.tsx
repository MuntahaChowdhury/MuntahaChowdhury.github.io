//app/ page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [v_isLoggedIn, setIsLoggedIn] = useState(false);
    const [v_fullName, setFullName] = useState("");

    //Retrive Username and Token from Cookies
    const [v_loggedUser, setLoggedUser] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        // Parse v_cookies
        const v_cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {} as Record<string, string>);

        // Check for fname in v_cookies
        if (v_cookies.fname) {
            setIsLoggedIn(true);
            setFullName(v_cookies.fname);
        }

        // Store username and token from v_cookies
        if (v_cookies.username) { setLoggedUser(v_cookies.username); }
        if (v_cookies.token) { setToken(v_cookies.token); }

    }, []);


    // Function to Handle Logout

    const handleLogout = async () => {
        // Clear v_cookies (optional, as logout logic would usually be server-side)
        document.cookie = "fname=; path=/; max-age=0";
        document.cookie = "lname=; path=/; max-age=0";
        document.cookie = "email=; path=/; max-age=0";
        document.cookie = "mobile=; path=/; max-age=0";
        document.cookie = "username=; path=/; max-age=0";
        document.cookie = "usrid=; path=/; max-age=0";
        document.cookie = "tempcode=; path=/; max-age=0";
        document.cookie = "cdomain=; path=/; max-age=0";
        document.cookie = "imgloc=; path=/; max-age=0";
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "expired=; path=/; max-age=0";
        document.cookie = "result=; path=/; max-age=0";

        setIsLoggedIn(false);
        setFullName("");

        // Build payload dynamically from v_loggedUser
        const v_payload = JSON.stringify({ username: v_loggedUser, token });


        //call route for EndPoint
        try {
            const v_resRt = await fetch('/api/user/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: v_payload,
            });

            if (v_resRt.ok) { window.location.href = '/'; }
            else { const v_LogOutError = await v_resRt.json(); console.error('Logout failed:', v_LogOutError.message); }


        } catch (error) {
            console.error('Error during logout:', error);
        }
    };



    return (
        <div className="flex items-center justify-center min-h-screen text-white px-4 mt-10">
            <div className="form-bg">
                {v_isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold">Welcome, {v_fullName}!</span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/user/login/"
                        className="flex items-center justify-center gap-2 text-blue-500 hover:underline"
                    >
                        <span>Login</span>
                    </Link>
                )}
            </div>
        </div>
    );
}
