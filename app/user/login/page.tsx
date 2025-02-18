




// app/user/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReturnButton from "@/components/return";

export default function LoginPage() {
  const [v_loginMethod, setLoginMethod] = useState<"password" | "token">("password");
  const [username, setUsername] = useState(""); // Default username
  const [password, setPassword] = useState(""); // Default password
  const [tokenCode, setTokenCode] = useState("");
  const [v_error, setError] = useState<string | null>(null);
  const v_router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Payload
    const v_payload =
      v_loginMethod === "password"
        ? { username, password, operation: "LOGIN" }
        : { username, tokenCode, operation: "LOGIN" };
        console.log(v_payload)

    try {
      // Call the login route
      const v_resRt = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v_payload),
      });

      if (!v_resRt.ok) {
        throw new Error("Login failed due to an internal v_error");
      }

      const v_resRtWrap = await v_resRt.json();

      // Handle successful login
      if (v_resRtWrap.data.result === "success") {
        const { usrid, fname, lname,email,mobile, tempcode,cdomain,imgloc, token, expired, result } = v_resRtWrap.data;
        // Set or create cookies
        document.cookie = `username=${encodeURIComponent(username)}; path=/; max-age=86400`;
        document.cookie = `usrid=${encodeURIComponent(usrid)}; path=/; max-age=86400`;
        document.cookie = `fname=${encodeURIComponent(fname)}; path=/; max-age=86400`;
        document.cookie = `lname=${encodeURIComponent(lname)}; path=/; max-age=86400`;
        document.cookie = `email=${encodeURIComponent(email)}; path=/; max-age=86400`;
        document.cookie = `mobile=${encodeURIComponent(mobile)}; path=/; max-age=86400`;
        document.cookie = `tempcode=${encodeURIComponent(tempcode)}; path=/; max-age=86400`;
        document.cookie = `cdomain=${encodeURIComponent(cdomain)}; path=/; max-age=86400`;
        document.cookie = `imgloc=${encodeURIComponent(imgloc)}; path=/; max-age=86400`;       
        document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400`;
        document.cookie = `expired=${encodeURIComponent(expired)}; path=/; max-age=86400`;
        document.cookie = `result=${encodeURIComponent(result)}; path=/; max-age=86400`;
        // Redirect on success
        v_router.push("/");
      } else {
        throw new Error("Login failed due to invalid credentials");
      }
    } catch (err) {
      const v_errorMessage = (err as Error).message || "An unknown v_error occurred";
      setError(v_errorMessage);
      console.error("Error:", v_errorMessage);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen text-white px-4 mt-10">
      <ReturnButton />    {/* Remove relative from above */}
      
      <div className="form-bg">

        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mt-4">Login</h2>
        </div>
        {v_error && <p style={{ color: "red" }}>{v_error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label>Enter Email</label>
            <input
              type="text"
              placeholder="User Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>


          {v_loginMethod === "password" ? (
            <div>
              <label>Enter Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          ) : (
            <div>
              <label>Enter Token</label>
              <input
              type="text"
              placeholder="Token Code"
              value={tokenCode}
              onChange={(e) => setTokenCode(e.target.value)}
              required
              />
            </div>
            )}



          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setLoginMethod(v_loginMethod === "password" ? "token" : "password") }
              >
              Use {v_loginMethod === "password" ? "Token Code" : "Password"}
            </button>

            <button 
              type="submit"
            >
              Login
            </button>
          </div>


        </form>
      </div>
    </div>
  );
}



// Extra bits---------------------------------------------------------------
// /app/user/login/page.tsx
// Login page
// Fields to provide username & password/token. Link to signup

// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function LoginPage() {
//   const [v_loginMethod, setLoginMethod] = useState<"password" | "token">("password");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   // const [tokenToMatch, setTokenToMatch] = useState<string>("")
//   const tokenCode = 'placeholder';
//   const [v_error, setError] = useState("");
//   const v_router = useRouter();

//   const submitEndpoint = "/api/user";








//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setLoginMethod("password");


//     const loginData =
//       v_loginMethod === "password"
//         ? { username, password, operation: "LOGIN" }
//         : { username, tokenCode, operation: "LOGIN" };

//     try {
//       const res = await fetch(submitEndpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(loginData),
//       });

//       const v_data = await res.json();
//       const v_rtn_datajson = v_data.data;
//       console.log("API Response:", v_rtn_datajson.fname);

//       if (!res.ok) {
//         throw new Error(v_data.v_error || "Failed to login");
//       }

//       if (v_rtn_datajson.fname) {
//         const fullName = encodeURIComponent(v_rtn_datajson.fname);
//         console.log("First Name", fullName);
//         v_router.push(`/`);
//       } else {
//         throw new Error("fname is missing from the API response");
//       }
//     } catch (err) {
//       const v_errorMessage = (err as Error).message || "An unknown v_error occurred";
//       if (v_loginMethod === 'password') {
//         setError('Email or password incorrect');
//       }
//       console.v_error("Error:", v_errorMessage);
//     }
//   };



//   return (
//     <>

//       <div className="flex items-center justify-center min-h-screen text-white px-4 mt-10">
//         <div className="shadow-lg rounded-xl p-8 max-w-md w-full bg-slate-800 bg-opacity-40">


//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Username */}
//             <div>
//               <label>Email Address</label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//         
//                 required
//               />
//             </div>

//             {v_loginMethod === "password" ? (
//               <>
//                 {/* Password */}
//                 <div>
//                   <label>Password</label>
//                   <input
//                     type="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//             
//                     required
//                   />
//                 </div>

//                 {/* Remember Me and Forgot Password */}
//                 <div className="flex items-center justify-between text-sm">
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       className="h-4 w-4 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
//                     />
//                     <span className="ml-2 text-gray-300">Remember me</span>
//                   </label>
//                   <Link href="/user/cfpwd" className="text-purple-500 hover:underline">
//                     Forgot password?
//                   </Link>
//                 </div>
//               </>
//             ) : (<></>)}

//             {v_error ? (
//               <div className="flex items-center justify-between text-sm">
//                 <p className="text-purple-500">
//                   {v_error}
//                 </p>
//               </div>
//             ) : ("")}

//             {/* Submit Button */}
//             <div className="flex space-x-3">
//               <button
//                 type="submit"
//                 className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
//               >
//                 Log In
//               </button>
//               <button
//                 className="w-full py-3 border-2 border-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 hover:bg-opacity-50 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
//               >
//                 <a href="/otp" className="text-white">or Use Token</a>
//                 {/* <a href="/otp" className="text-white " onClick={tokenChosen}>or Use Token</a> */}
//               </button>

//             </div>
//           </form>


//           {/* Footer */}
//           <div className="text-center text-sm text-gray-400 mt-6">
//             Don&apos;t have an account?{" "}
//             <Link href="/user/signup" className="text-purple-500 hover:underline">
//               Create one
//             </Link>
//           </div>


//         </div>
//       </div>


//     </>
//   );
// }




    // if (v_loginMethod === "token") {
    //   if (timer === 0) {
    //     setError('Your token has expired');
    //     return;
    //   }
    //   if (tokenCode !== tokenToMatch) {
    //     setTokenCode("");
    //     setError("Token code does not match the one provided")
    //     console.log('tokens', tokenCode, tokenToMatch)
    //     return;
    //   }
    //   else {
    //     setError("");
    //   }
    // }

    

  // Helper function to format seconds into MM:SS
  // const formatTime = (timeInSeconds: number) => {
  //   const minutes = Math.floor(timeInSeconds / 60);
  //   const seconds = timeInSeconds % 60;
  //   return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  // };


  // const [timer, setTimer] = useState<number | null>(null);

    // useEffect(() => {
  //   if (timer === null) return; // Exit if timer is not set

  //   if (timer > 0) {
  //     const countdown = setTimeout(() => {
  //       setTimer(timer - 1); // Decrease timer every second
  //     }, 1000);
  //     return () => clearTimeout(countdown); // Cleanup the timeout
  //   }
  // }, [timer]);