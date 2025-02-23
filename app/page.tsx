'use client'
import { useState, useEffect } from "react";

export default function Home() {
  const [checker, setCheckerName] = useState<string>('');

  useEffect(() => {
    // See if user is logged in
    const userInfoCookies = document.cookie.split("; ");
    const userNameCookie = userInfoCookies.find(i => i.startsWith("fname=")) || '';

    if (userNameCookie) setCheckerName(userNameCookie.split("=")[1]);
  }, [])


  return (
    <div className="p-20 w-full min-h-screen bg-gradient-to-l from-bru2 to-bru4 text-center">

      <h1 className="font-extrabold text-4xl tracking-tight"> Core Service Tester Project</h1>
      <p className="mt-2 text-lg text-yellow-200">Hello {checker}</p>


      <div className="grid grid-cols-4 grid-rows-auto gap-6 mt-10 mx-[15vw] text-white">
        <button className="homeButton" onClick={() => window.location.href = "/otp"}>OTP</button>
        <button className="homeButton" onClick={() => window.location.href = "/s3"}>s3</button>
        <button className="homeButton" onClick={() => window.location.href = "/user/login"}>User/Login</button>
        <button className="homeButton" onClick={() => window.location.href = "/user/logout"}>User/Logout</button>
        <button className="homeButton" onClick={() => window.location.href = "/user/signup"}>User/SignUp</button>
        <button className="homeButton" onClick={() => window.location.href = "/user/menu"}>User/Menu</button>
        <button className="homeButton" onClick={() => window.location.href = "/user/profile"}>User/Profile</button>
        <button className="homeButton" onClick={() => window.location.href = "/user/cfpwd"}>User/Password</button>
        <button className="homeButton" onClick={() => window.location.href = "/user/dboard"}>User/Dashboard</button>
        <button className="homeButton" onClick={() => window.location.href = "/ct"}>Item Gallery</button>
      </div>

    </div>
  );
}
