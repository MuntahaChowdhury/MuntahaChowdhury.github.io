/* eslint-disable @typescript-eslint/no-explicit-any */

// A. Imports from React and custom components.
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// B. Declare Interface and Props.
//interface catreg { itemcat: string; }
//interface Props { onSelectItemCat: (p_itemCat: string) => void;}

//C.Open Main Function that exports HTML
export default function ItemCatReg() {
  // C1: Declare State Variables
    const [h_catReg, setCatReg] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
        // Nav-P1: Define handle Function      
           const router = useRouter();     
           const handleItemCatClick = (pitemcat: string) => {
               router.push(`/item/?pitemcat=${encodeURIComponent(pitemcat)}`);
            };


    // C2: Define useEffect.
 useEffect(() => {
  const fetchCatReg = async () => {
     setLoading(true);
     setError(null);
  try {
  // 1: Prepare ASKFOR and CONDITION.
     const v_askfor = 'CATREG';
     const v_cnd = `cdomain='buyerpanda.com'`;
     const v_epRt = `/api/item/?askfor=${v_askfor}&cnd=${v_cnd}`;

  // 2: Call Route
     const v_resRt = await fetch(v_epRt,{
          method: "GET",
          headers: { "Content-Type": "application/json" },
      });  
  // 3: Extract JSON-Object.
      const v_resRtWrap = await v_resRt.json();        // Route Return-Build Full Part
      const v_resRtStr = v_resRtWrap.data;             // Route Return-Build Data Part in JSON-String Format
      const v_resRtData = v_resRtStr.map(JSON.parse);  // Route Return-Build Data Part in JSON-ObjectFormat
          //console.log('catReg data:', v_resRtData);
  // 4: Load to State Variable.
      setCatReg(v_resRtData);

    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  fetchCatReg();
}, []);


  return (
    <div className="p-6 bg-bru1 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-bru5 mb-4"> Category Register</h2>

      {loading && <p className="text-bru4 font-semibold">Loading...</p>}
      {error && <p className="text-red-500 font-semibold">Error: {error}</p>}

      {h_catReg.length > 0 ? (
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead>
            <tr className="bg-bru3 text-left">
              <th className="p-3 border-b-4 border-bru5">Item Category</th>
            </tr>
          </thead>
          <tbody>
            {h_catReg.map((v_rcdItemCat, index) => (
              <tr key={index} 
                 className="border-b border-bru5 last:border-b-0 bg-bru2 cursor-pointer hover:bg-bru4 hover:text-bru2 transition duration-200"
                // Nav-P2: Linking with OnClick under HTML
                   onClick={() => handleItemCatClick (v_rcdItemCat.itemcat)}  
             >
                <td className="p-3">{v_rcdItemCat.itemcat .toLowerCase() .replace(/\b\w/g, (char: string) => char.toUpperCase())  }</td>
              </tr>


            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-gray-600">No data found.</p>
      )}

 

    </div>
  );
}
