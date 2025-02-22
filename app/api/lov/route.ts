/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

const v_epLov = 'http://54.251.81.183:8081/ords/ridbiz/core/lov/'; // ORDS API endpoint for fetching LOV data

export async function GET(req: Request) {
  // Extract search parameters from the request URL
  const { searchParams } = new URL(req.url);
  const lcat = searchParams.get('lcat'); // Retrieve 'lcat' query parameter

  // Validation: Ensure 'lcat' is provided
  if (!lcat) { return NextResponse.json({ error: 'LOV Name required' }, { status: 400 }); }

  try {
 
    // ✅ Fix: Send 'lcat' as a query parameter instead of using a request body
    const v_resFnLov = await fetch(`${v_epLov}?lcat=${encodeURIComponent(lcat)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // Parse the JSON response from the API
    const v_resFnData = await v_resFnLov.json();

    // Check if API response is successful
    if (!v_resFnLov.ok) {throw new Error(`API Error: ${v_resFnData.error || "Failed to fetch LOV data"}`); }

    // Return success response with fetched data
    return NextResponse.json( { message: 'LOV request successful', data: v_resFnData }, { status: 200 });

  } catch (error: any) {
    // Handle errors and return a 500 status
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
