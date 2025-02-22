//  A.Imports from React-Lib and custom components.
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// B.Declare Interface and Props(if needed).
interface ItemDetail {
  itemmid: string;
  itemsrvc: string;
  itemcat: string;
  itemmast: string;
  itemvar1: string;
  itemvar2: string;
  idesc?: string;
  gp: string;
  pub: string;
  mkrdate?: string;
}

//interface Props { p_itemCat: string | null;}

//  C.Open Main Function that exports HTML
export default function ItemReg() {
  // C1: Declare State Variables.
  const [h_itemReg, setItemReg] = useState<ItemDetail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

      // Nav-R1: Search Value from URL
          const router = useRouter();
          const searchParams = useSearchParams();
          const v_itemCat = searchParams.get("pitemcat") || "None";
      // Nav-P1: Define handle Function
          const handleItemMidClick = (pitemmid: string, pivv1: string, pivv2: string) => {
          router.push(`/item/${pitemmid}?pivv1=${encodeURIComponent(pivv1)}&pivv2=${encodeURIComponent(pivv2)}`);
          };

  // C2: Define useEffect.
  useEffect(() => {
    if (v_itemCat === "None") return; // Nav-R2: Modify useEffect

    const fetchItemReg = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1: Prepare ASKFOR and CONDITION.
        const v_askfor = 'ITEMREG';
        const v_cnd = `itemcat='${v_itemCat}'`; // Nav-R2: Modify useEffect
        const v_epRt = `/api/item/?askfor=${v_askfor}&cnd=${v_cnd}`;
        // console.log("Route - URL :", v_epRt);

        // 2: Call Route
        const v_resRt = await fetch(v_epRt, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // 3: Extract JSON-Object.
        const v_resRtWrap = await v_resRt.json(); // Route Return-Build Full Part
        const v_resRtStr = v_resRtWrap.data; // Route Return-Build Data Part in JSON-String Format
        const v_resRtData = v_resRtStr.map((str: string) => {
          try {
            return JSON.parse(str); // Route Return-Build Data Part in JSON-Object Format
          } catch (err) {
            console.error("❌ JSON Parse Error:", err);
            return null;
          }
        }).filter(Boolean); // Remove null values
        //console.log('catReg data:', v_resRtData);

        // 4: Load to State Variable.
        setItemReg(v_resRtData);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemReg();
  }, [v_itemCat]); // Nav-R2: Modify useEffect



  const handleAddNewItem = () => {
    router.push("/item/add");
  };

  return (
    <div className="bg-bru1 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-bru5 mb-4">Item Register</h2>

      {loading && <div className="text-center text-lg text-bru3 font-semibold">Loading...</div>}
      {error && <div className="text-center text-red-600 font-semibold">{error}</div>}

      {v_itemCat && ( // Nav-R3: Modify HTML
        <div className="mb-6 p-5 border rounded-lg bg-white shadow-md">
          <h3 className="text-xl font-semibold text-gray-900">Category: {v_itemCat}</h3>
          <button
            onClick={handleAddNewItem}
            className="bg-bru4 my-2"
          >
            + Add New Item
          </button>
          <p className="text-gray-800">
            Below are the items associated with the <strong>{v_itemCat}</strong> category.
          </p>
        </div>
      )}

      {h_itemReg.length > 0 ? (
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full bg-white border border-bru5 shadow-md rounded-lg">
            <thead className="text-white">
              <tr className="bg-bru4 text-bru1 text-left">
                <th className="border border-bru5 p-3">Item MID</th>
                <th className="border border-bru5 p-3">Service</th>
                <th className="border border-bru5 p-3">Category</th>
                <th className="border border-bru5 p-3">Item Name</th>
                <th className="border border-bru5 p-3">First Variant</th>
                <th className="border border-bru5 p-3">Second Variant</th>
                <th className="border border-bru5 p-3">Description</th>
                <th className="border border-bru5 p-3">GP</th>
                <th className="border border-bru5 p-3">PUB</th>
                <th className="border border-bru5 p-3">Maker Date</th>
              </tr>
            </thead>
            <tbody>
              {h_itemReg.map((v_rcdItem, index) => (
                <tr
                  key={index}
                  className={`border-t border-bru5 ${index % 2 === 0 ? "bg-bru2" : "bg-bru3"} hover:bg-gray-200 transition duration-200`}
                >
                  <td
                    className="border border-bru5 p-3 cursor-pointer text-blue-900 hover:text-blue-500 hover:underline font-medium"
                    onClick={() => handleItemMidClick(v_rcdItem.itemmid, v_rcdItem.itemvar1, v_rcdItem.itemvar2)}
                  >
                    {v_rcdItem.itemmid}
                  </td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItem.itemsrvc}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItem.itemcat}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItem.itemmast}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItem.itemvar1}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItem.itemvar2}</td>
                  <td className="border border-bru5 p-3 text-gray-800">{v_rcdItem.idesc || "N/A"}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItem.gp}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItem.pub}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItem.mkrdate || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-800 text-lg text-center">No details available for this category.</p>
      )}
    </div>
  );
}