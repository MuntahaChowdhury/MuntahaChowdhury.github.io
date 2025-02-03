
// api/user/profile/route.ts
//==============================================================================================================================

import { NextRequest, NextResponse } from 'next/server';
const v_epFnUpd = "http://54.251.81.183:8081/ords/ridbiz/core/upd/";
const v_epFnPrc = 'http://54.251.81.183:8081/ords/ridbiz/core/prc/';
let v_endpoint = "";
let v_method = "";
let v_payload = {};

//-- Handler function for POST method
// export async function PUT(req: NextRequest,res: NextResponse) {
export async function PUT(req: NextRequest) {
    //console.log("Profile-Route is invoked");
    if (req.method !== "PUT") { return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 }); }

    try {
        //=========================================================================
        // Parsing incoming request body
        const v_rpayload = await req.json();  // Directly parse the JSON body
        //console.log("Profile-Route: Received Request Body:", v_rpayload);
        const { operation, username, fname, lname, email, mobile, imgloc } = v_rpayload;

        // Validate required fields
        /*   if (![operation, username, fname, lname, email, mobile, imgloc ].every(Boolean)) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
          } */
        //=========================================================================
        if (operation === 'APPUSRU') {
            v_endpoint = v_epFnUpd;
            v_method = "PUT";
            v_payload = {
                operation: operation,
                username: username,
                fname: fname,
                lname: lname,
                email: email,
                mobile: mobile,
                imgloc: imgloc,
            };

        } else if (operation === 'APPUSRIMG') {
            v_endpoint = v_epFnPrc;
            v_method = "POST";
            v_payload = {
                operation: operation,
                username: username,
                imgloc: imgloc,
            };
            // const v_resFn = await fetch(v_endpoint, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(v_payload),
            // });


        } else {
            console.log("Invalid Operation:", operation)
            return NextResponse.json({ message: "Invalid operation" }, { status: 400 });
        }
        //======================================================================
        //console.log("Profile-Route API Calling Method and Payload:",v_method,v_payload);
        // Send request to the determined endpoint
        const v_resFn = await fetch(v_endpoint, {
            method: v_method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(v_payload),
        });

        // Check if the external API response is JSON or HTML (error page)
        console.log(" Profile Route Api OK-Status:", v_resFn.ok);
        if (v_resFn.ok) {
            const v_resFnData = await v_resFn.json();
            return NextResponse.json({ message: "Profile Updated successfully", data: v_resFnData, result: "success" }, { status: 200 });
        } else {
            // const errorRes = await v_resFn.text();  // Get the error page HTML
            return NextResponse.json({ message: "Failed to update profile" }, { status: v_resFn.status });
        }

        //======================================================================
    } catch (error) {
        // Handle any errors that occur during the API request
        console.error("Profile-Route: Internal Server Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

//==============================================================================================================================
