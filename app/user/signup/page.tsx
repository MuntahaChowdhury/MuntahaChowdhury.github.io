"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReturnButton from "@/components/return";


const SignupPage = () => {

    const v_router = useRouter();
    // TypeScript type definition for form data
    type FormDataType = {
        fname: string;
        lname: string;
        email: string;
        password: string;
        mobile: string;
        cdomain: string;
    };
    // State to manage form inputs
    const [v_formData, setFormData] = useState<FormDataType>({
        fname: "",
        lname: "",
        email: "",
        password: "",
        mobile: "",
        cdomain: "buyerpanda.com", // Default value
    });

    const [v_error, setError] = useState<string>(""); // State to manage error messages
    const [v_isLoading, setIsLoading] = useState<boolean>(false); // State to manage loading indicator

    // Handle input changes in the form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission ============================================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate required fields
        const { fname, lname, email, password, mobile } = v_formData;
        if (!fname || !lname || !email || !password || !mobile) {
            setError("All fields are required.");
            return;
        }

        // Store v_formData in sessionStorage
        sessionStorage.setItem("signupFormData", JSON.stringify(v_formData));

        // Redirecting to OTP page with mobile and email
        v_router.push(`/otp?mobile=${encodeURIComponent(mobile)}&email=${encodeURIComponent(email)}`);
    };

    // Complete Signup ==================================================
    const completeSignup = useCallback(async (v_formData: FormDataType) => {
        console.log("completeSignup is called");
        setIsLoading(true); // Show loading indicator

        try {
            // Prepare the payload for the API request
            const v_payload = {
                operation: "APPUSRI",
                ...v_formData, // Merge the v_formData into the payload
            };

            console.log("Payload in completeSignup:", v_payload);

            //API request
            const v_resRt = await fetch("/api/user/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(v_payload),
            });

            // if v_resRt is not ok 
            if (!v_resRt.ok) {
                let v_errorMessage = "Signup failed. Please try again.";
                try {
                    const v_resRtWrap = await v_resRt.json();
                    v_errorMessage = v_resRtWrap.message || v_errorMessage;
                } catch (err) { console.error("Error parsing error v_resRt:", err); }
                setError(v_errorMessage);
                return;
            }
            else { alert("Signup successful!"); }



            // Clean up session data
            sessionStorage.removeItem("signupFormData");
            sessionStorage.removeItem("otpVerification");

            // Redirect user to the login page or another destination
            v_router.push("/user/login");


        } catch (err) {
            console.error("An error occurred during signup:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally { setIsLoading(false); }
    }, [v_router]);


    // Page-Load:=========================================================
    useEffect(() => {
        // Retrieve Data from sessionStorage
        const v_savedData = sessionStorage.getItem("signupFormData");
        const v_otpVerificationData = sessionStorage.getItem("otpVerification");

        // Autofill form with saved data
        if (v_savedData) setFormData(JSON.parse(v_savedData));

        // Call completeSignup if OTP verification is true
        if (v_otpVerificationData) {
            try {
                const v_otpVerDataWrap = JSON.parse(v_otpVerificationData);
                if (v_otpVerDataWrap.verified === true) {
                    console.log("OTP verified. Calling completeSignup...");
                    completeSignup(JSON.parse(v_savedData || "{}"));
                }
            } catch (err) {
                console.error("Error parsing OTP verification data:", err);
            }
        }
    }, [completeSignup]);



    return (
        <div className="signup-container relative flex items-center justify-center min-h-screen text-white px-4 mt-10">
            <ReturnButton />    {/* Remove relative from above */}
            <div className="form-bg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mt-4">Sign Up</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="fname">First Name</label>
                        <input
                            type="text"
                            id="fname"
                            name="fname"
                            value={v_formData.fname}
                            onChange={handleChange}
                            required
                            autoComplete="given-name"
                        />
                    </div>
                    <div>
                        <label htmlFor="lname">Last Name</label>
                        <input
                            type="text"
                            id="lname"
                            name="lname"
                            value={v_formData.lname}
                            onChange={handleChange}
                            required
                            autoComplete="family-name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={v_formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={v_formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label htmlFor="mobile">Mobile</label>
                        <input
                            type="text"
                            id="mobile"
                            name="mobile"
                            value={v_formData.mobile}
                            onChange={handleChange}
                            required
                            autoComplete="tel-national"
                        />
                    </div>
                    <div>
                        <label htmlFor="cdomain">Domain</label>
                        <input
                            type="text"
                            id="cdomain"
                            name="cdomain"
                            value={v_formData.cdomain}
                            onChange={handleChange}
                        />
                    </div>
                    {v_error && <p className="v_error" style={{ color: "red" }}>{v_error}</p>}
                    <button type="submit" disabled={v_isLoading}>
                        {v_isLoading ? "Processing..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
