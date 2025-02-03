//app/api/user/login/route.ts


import { NextRequest, NextResponse } from 'next/server';
// Define the API endpoint
 const v_epFnPrc = 'http://54.251.81.183:8081/ords/ridbiz/core/prc/';
    
    
export async function POST(req: NextRequest) {
  try {
    // Extract headers for user agent and IP address
    const v_headers = req.headers;
    const v_userAgent = v_headers.get('user-agent') || 'Unknown';
    const v_ipAddress = v_headers.get('x-forwarded-for') || '0.0.0.0';

    // Extract the payload from the request body
    const v_rpayload = await req.json();
    const { username, password } = v_rpayload;

    // Validate the required fields
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Missing required fields: username or password' },
        { status: 400 }
      );
    }

    // Construct the payload
    const v_payload = JSON.stringify({
      username,
      password,
      agnt: v_userAgent,
      ipadrs: v_ipAddress,
      operation: 'LOGIN',
    });


    // Make the API call
    const v_resFnPrc = await fetch(v_epFnPrc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: v_payload,
    });
    const v_resFnData = await v_resFnPrc.json();   // JSON - Object of incoming Payload 
   // console.log("API Response Body", v_resFnData);
    return NextResponse.json({message:"Login Result", data: v_resFnData},{status: 200});

  } catch (error) {
    return NextResponse.json({message: 'An error occurred during login', data: error }, { status: 500 }  );
  }
}
