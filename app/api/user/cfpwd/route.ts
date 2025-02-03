// app/api/user/cfpwd/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Define the API endpoint
const v_epFnPrc = 'http://54.251.81.183:8081/ords/ridbiz/core/prc/';
 
export async function POST(req: NextRequest) {
  try {
    // Extract the payload from the request body
    const v_rpayload = await req.json();
    const { username, newPassword } = v_rpayload;

    // Validate the required fields
    if (!username) { return NextResponse.json({ message: 'Missing required fields: username' },{ status: 400 } ); }

    // Construct the payload
    const v_payloadPwd = JSON.stringify({
      username,
      newPassword,
      operation: 'CFPWD',
    });

    console.log('Password Change API request payload:', v_payloadPwd);

    // Make the API call
    const v_resFnPrc = await fetch(v_epFnPrc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: v_payloadPwd,
    });

    // Read the response body as JSON
    const v_resFnData = await v_resFnPrc.json();

    console.log('Password Change API response body:', v_resFnData);
    console.log('Password Change API response status:', v_resFnPrc.ok);

    return NextResponse.json({message: 'Password Change Result:', data: v_resFnData,},{ status: 200 } );
   
  } catch (error) {
    console.error('An error occurred during Password Change:', error);
    return NextResponse.json( { message: 'An error occurred during Password Change', data: error }, { status: 500 }
    );
  }
}
