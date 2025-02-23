// components/item/itemSkuReg.tsx

// A. Imports from React and custom components.
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import ItemSkuManage from "@/components/item/itemSkuManage"; // Import the modal component

// B. Declare Interface and Props.
interface ItemSku {
  itemid: number;
  itemmid: number;
  ivv1: string;
  ivv2: string;
  pp: string;
  sp: string;
  minstk: string;
  sku: string;
}

//interface Props { p_itemmid: number | null;}


// C. Open Main Function that exports HTML
export default function ItemSkuRegSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItemReg />
    </Suspense>
  )
}

export default function ItemReg() {
  // C1: Declare State Variables
  const [h_itemSkuReg, setItemSkuReg] = useState<ItemSku[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
          //Nav-R1: Read Value from URL {Dynamic Route Parameters}
                 const params = useParams();
                 const v_itemmid = params.id ? Number(params.id) : null; // Convert to number if needed
        
         //Nav-P1: Declare State Variable
          const [v_isModalOpen, setIsModalOpen] = useState(false);
          const [v_selectedItemId, setSelectedItemId] = useState<number | null>(null); // Holds itemid for update/delete

         //Nov-P2: Define handle function [ ]  
          const handleOpenModalNew = () => {    // Open modal for adding a new item
                setSelectedItemId(null); // Ensure no itemid is set for new item
                setIsModalOpen(true);
            };
           const handleOpenModalEdit = (itemid: number) => {    //// Open modal for updating/deleting an existing item
                 setSelectedItemId(itemid);
                 setIsModalOpen(true);
            };


 // C2: Define useEffect.
 useEffect(() => {
  const fetchItemReg = async () => {
     if (!v_itemmid) return;
     setLoading(true);
     setError(null);
  try {
  // 1: Prepare ASKFOR and CONDITION.
     const v_askfor = 'ITEMSKU';
     const v_cnd = `itemmid=${v_itemmid}`;
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
  // 4: Load to State Variable.
      setItemSkuReg(v_resRtData);

    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  fetchItemReg();
}, [v_itemmid]);


//D: Display Data on HTML from State Variable.
  return (
    <div className="bg-bru1 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-bru5 mb-4">Variants/SKU Register</h2>

      {loading && <div className="text-center text-lg text-bru3 font-semibold">Loading...</div>}
      {error && <div className="text-center text-red-600 font-semibold">{error}</div>}

      {v_itemmid && (
        <div className="mb-6 p-5 border rounded-lg bg-white shadow-md">
          <h3 className="text-xl font-semibold text-gray-900">Item ID: {v_itemmid}</h3>

        {/* Nav-P31: HTML Add-New Button with OnClick */}
          <button onClick={handleOpenModalNew} className="bg-bru4 my-2" >
            + Add New Variant
          </button>


          <p className="text-gray-800">
            Below are the variants associated with the <strong>{v_itemmid}</strong> product.
          </p>
        </div>
      )}

      {h_itemSkuReg.length > 0 ? (
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="text-white">
              <tr className="bg-bru4 text-bru1 text-left">
                <th className="border border-bru5 p-3">Item ID</th>
                <th className="border border-bru5 p-3">First Variant</th>
                <th className="border border-bru5 p-3">Second Variant</th>
                <th className="border border-bru5 p-3">Purchase Price</th>
                <th className="border border-bru5 p-3">Sales Price</th>
                <th className="border border-bru5 p-3">Min stock</th>
                <th className="border border-bru5 p-3">SKU/Part No</th>
              </tr>
            </thead>
            <tbody>
              {h_itemSkuReg.map((v_rcdItemSku, index) => (
                // Nav-P32: Primary key column in Html-Table
                <tr
                  key={index}
                  onClick={() => handleOpenModalEdit(v_rcdItemSku.itemid)} // Click to open modal for update/delete
                  className={`border-t border-bru5 ${index % 2 === 0 ? "bg-bru2" : "bg-bru3"} hover:bg-gray-200 transition duration-200 cursor-pointer`}
                >
                  <td className="border border-bru5 p-3 text-blue-900 hover:text-blue-500 hover:underline font-medium"> {v_rcdItemSku.itemid}  </td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItemSku.ivv1}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItemSku.ivv2}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItemSku.pp}</td>
                  <td className="border border-bru5 p-3 text-gray-800">{v_rcdItemSku.sp || "N/A"}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItemSku.minstk}</td>
                  <td className="border border-bru5 p-3 text-gray-900">{v_rcdItemSku.sku}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-800 text-lg text-center">No variants available for this Product.</p>
      )}


      {/* Nav-P4: Rendering Receiver Page */}
      { v_isModalOpen &&   (
        <ItemSkuManage
          p_itemmid={v_selectedItemId ? null : v_itemmid} // Pass p_itemmid when adding a new item
          p_itemid={v_selectedItemId} // Pass itemid when updating/deleting
          onClose={() => setIsModalOpen(false) }// Close modal
        />
      )}



    </div>
  );
}
