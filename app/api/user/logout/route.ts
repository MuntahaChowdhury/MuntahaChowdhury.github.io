// app/api/user/logout/route.ts  

import { NextRequest, NextResponse } from 'next/server';

// Define the API endpoint
const v_epFnPrc = 'http://54.251.81.183:8081/ords/ridbiz/core/prc/';


export async function POST(req: NextRequest) {
    try {
        // Extract the payload from the request body
        const v_rpayload = await req.json();
        const { username } = v_rpayload;
        const { token } = v_rpayload;


        // Validate the required fields
        if (!username) { return NextResponse.json({ message: 'Missing required fields: username' }, { status: 400 }); }

        // Construct the payload
        const v_payload = JSON.stringify({ username, token, operation: 'LOGOUT', });
        console.log("logout api Payload:", v_payload);


        // Make the API call
        const v_resFnPrc = await fetch(v_epFnPrc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: v_payload,
        });
        // Read Response Body in JSON-Object format
        const v_resFnData = await v_resFnPrc.json();
        console.log("logout api response:", v_resFnData);

        // Handle the API response
        if (v_resFnPrc.ok) {
            return NextResponse.json({ message: 'Logout successful', data: v_resFnData, }, { status: 200, headers: { Location: '/' } });
        } else {
            return NextResponse.json({ message: 'Failed to logout from API', data: v_resFnData, }, { status: v_resFnPrc.status });
        }
    } catch (error) {
        return NextResponse.json({ message: 'An error occurred during logout', data: error }, { status: 500 });
    }
}
