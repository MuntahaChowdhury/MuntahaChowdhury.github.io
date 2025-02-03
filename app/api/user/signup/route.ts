//-- api/user/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
const v_epFnIns ="http://54.251.81.183:8081/ords/ridbiz/core/ins/" ;


//-- Handler function for POST method
// export async function POST(req: NextRequest,res: NextResponse) {
export async function POST(req: NextRequest) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
  }

  // Parsing incoming request body
  const v_rpayload = await req.json();  // Directly parse the JSON body
  console.log("Signup-Route: Received Request Body:", v_rpayload);
  const { operation, fname, lname, email, password, mobile, cdomain } = v_rpayload;

  // Validate required fields
  if (![operation, fname, lname, email, password, mobile, cdomain].every(Boolean)) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  // Prepare v_payload for the external API
  const v_payload = JSON.stringify({
    operation: operation,
    fname: fname,
    lname: lname,
    email: email,
    password: password,
    mobile: mobile,
    cdomain: cdomain,
  });
  console.log("Signup-Route: Sending Payload:", v_payload);

  // Send request to external API
  try {
    const v_resFnIns = await fetch(v_epFnIns, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: v_payload,
    });

    // Check if the external API response is JSON or HTML (error page)
    if (v_resFnIns.ok) {
        const v_resFnData = await v_resFnIns.json();
        console.log("Signup-Route: External API Response:", v_resFnData);
        return NextResponse.json({ message: "User created successfully", data: v_resFnData }, { status: 200 });
    } else {
        const errorRes = await v_resFnIns.text();  // Get the error page HTML
        console.error("Signup-Route: External API Error Response:", errorRes);
        return NextResponse.json({ message: "Failed to create user" }, { status: v_resFnIns.status });
    }
    
  } catch (error) {
    // Handle any errors that occur during the API request
      console.error("Signup-Route: Internal Server Error:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
