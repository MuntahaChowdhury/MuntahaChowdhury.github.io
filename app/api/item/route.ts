/* eslint-disable @typescript-eslint/no-explicit-any */
//axios automatically parses JSON responses.

// app/api/item/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v_host } from "@/components/constants";
//import axios from 'axios';

// EndPoint URLs
const v_epFnIns = `${v_host}/ridbiz/item/ins/`;
const v_epFnUpd = `${v_host}/ridbiz/item/upd/`;
const v_epFnDlt = `${v_host}/ridbiz/item/dlt/`;
const v_epFnQry = `${v_host}/ridbiz/item/getinfo/`;

//============================================================================================
// POST request handler
//============================================================================================
export async function POST(request: NextRequest) {
  console.log('POST route called for item add'); // Log for POST request
  try {
    // 1. Extract JSON-Object from Received-Request and Build NEW Stringified Payload.
    const v_rpayload = await request.json();      // Extract JSON-Object from Received payload.
    const v_payload = JSON.stringify(v_rpayload); // JSON-String converted new payload.
 
    // 2. API Call
    const v_resFnIns = await fetch(v_epFnIns, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: v_payload,
    });
   
    // 3. Extract  JSON-Object from API-Response and Stringify it. 
    const v_resFnData = await v_resFnIns.json();  //Function Return as JSON-Object
    const v_resFnStr = JSON.stringify(v_resFnData); // convert to JSON-String

    // 4.Build and Return Response  (Return-Build)
    return NextResponse.json({ result: "success", data: v_resFnStr }, { status: 200 } );

  } catch (error: any) {
    const errorMessage = error.response?.data || 'Error calling ORDS endpoint';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

//============================================================================================
// PUT request handler
//============================================================================================
export async function PUT(request: Request) {
  console.log('PUT route called'); // Log for PUT request
  try {
    // 1. Extract JSON-Object from Received-Request and Build Springfield New Payload.
    const v_rpayload = await request.json();      // Received payload in JSON-Object 
    const v_payload = JSON.stringify(v_rpayload); // convert to JSON-String 
   
    // 2. API Call with New Payload
    const v_resFnUpd = await fetch(v_epFnUpd, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: v_payload,
    });
  
    // 3. Extract and Stringify JSON-Object from ORDS-Response. 
    const v_resFnData = await v_resFnUpd.json();    //Funtion Return as JSON-Object
    const v_resFnStr = JSON.stringify(v_resFnData); // convert to JSON-String

    // 4.Return Response  (Return-Build)
    return NextResponse.json(  { result: 'success', data: v_resFnStr },{status: 200} );
 
  } catch (error: any) {
    const errorMessage = error.response?.data || 'Error updating item';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

//============================================================================================
// DELETE request handler
//============================================================================================
export async function DELETE(request: Request) {
  console.log('DELETE route called'); // Log for DELETE request
  try {
    // 1. Extract JSON-Object from Received-Request and Build Springfield New Payload.
    const v_rpayload = await request.json();      // Received payload in JSON-Object 
    const v_payload = JSON.stringify(v_rpayload); // convert to JSON-String 
   
    // 2. API Call with Payload
    const v_resFnDlt = await fetch(v_epFnDlt, {   // Calling API-ORDS
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: v_payload,  //always JSON-String in transit
    });

    // 3. Extract JSON-Object from API-Response and Stringify it.
    const v_resFnData = await v_resFnDlt.json();    //Funtion Return as JSON-Object
    const v_resFnStr = JSON.stringify(v_resFnData); // convert to JSON-String

    // 4.Build and Return Response  (Return-Build)
    return NextResponse.json(  { result: 'success', data: v_resFnStr },{status: 200} );
 
  } catch (error: any) {
    const errorMessage = error.response?.data || 'Error deleting item';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

//============================================================================================
// GET request handler
//============================================================================================
export async function GET(req: Request) {
  console.log('GET route called');  
  // 1.  Extract Param
  const { searchParams } = new URL(req.url);
  const askfor = searchParams.get('askfor');  // Use lowercase as query parameters are usually lowercase.
  const cnd = searchParams.get('cnd');
  if (!askfor || !cnd ) {return NextResponse.json({ error: 'AskFor and Cnd are required parameters' }, { status: 400 }); }
 
  try {

    // 2. API Call
    const v_resFnQry = await fetch(`${v_epFnQry}?askfor=${askfor}&cnd=${cnd}`);

    // 3. Extract Stringified JSON-String from ORDS-Response. 
    const v_resFnStr = await v_resFnQry.json();  //SQL-Out rows as JSON String 
          //console.log('Get Api Data:',v_resFnStr);
    // 4.Build and Return Response  (Return-Build)
    return NextResponse.json(  { result: 'success', data: v_resFnStr },{status: 200} );

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
//============================================================================================
