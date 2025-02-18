// components/item/itemSkuReg.tsx

"use client";
import React, { useState, useEffect } from "react";
import { v_host } from "@/components/constants";
import ItemSkuManage from "@/components/item/itemSkuManage"; // Import the modal component

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

interface Props {
  p_itemmid: number | null;
}

export default function ItemReg({ p_itemmid }: Props) {
  const [h_itemSkuReg, setItemSkuReg] = useState<ItemSku[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null); // Holds itemid for update/delete

 

  // Open modal for adding a new item
  const handleOpenModalNew = () => {
    setSelectedItemId(null); // Ensure no itemid is set for new item
    setIsModalOpen(true);
  };

  // Open modal for updating/deleting an existing item
  const handleOpenModalEdit = (itemid: number) => {
    setSelectedItemId(itemid);
    setIsModalOpen(true);
  };

/*   // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(true);
  };
 */

 // Fetch item data when p_itemmid changes
 useEffect(() => {
  if (!p_itemmid) return;
  const v_epItemSku = `${v_host}/ridbiz/useritemsku/?itemmid=${p_itemmid}`;
  const fetchItemReg = async () => {
    try {
      setLoading(true);
      setError(null);

      const v_resVw = await fetch(v_epItemSku);
      if (!v_resVw.ok) throw new Error(`Failed to fetch data. Status: ${v_resVw.status}`);

      const v_resVwWrap = await v_resVw.json();
      const v_resVwData = v_resVwWrap.items || [];
      setItemSkuReg(v_resVwData);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  fetchItemReg();
}, [p_itemmid]);

  return (
    <div className="bg-bru3 p-6 rounded-lg shadow-lg">

      <h2 className="text-3xl font-bold text-bru5 mb-4">Variants/SKU Register</h2>
      {loading && <div className="text-center text-lg text-blue-700 font-semibold">Loading...</div>}
      {error && <div className="text-center text-red-600 font-semibold">{error}</div>}

      {p_itemmid && (
        <div className="mb-6 p-5 border rounded-lg bg-gray-200 shadow-md">
          <h3 className="text-xl font-semibold text-gray-900">Item ID: {p_itemmid}</h3>
          <button
            onClick={handleOpenModalNew}
            className="bg-bru5 my-4"
          >
            + Add New Variant
          </button>

          <p className="text-gray-800">
            Below are the variants associated with the <strong>{p_itemmid}</strong> product.
          </p>
        </div>
      )}

      {h_itemSkuReg.length > 0 ? (
        <div className="overflow-x-auto max-h-80">
          <table className="relative min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-bru2 text-black sticky top-0">
              <tr>
                <th className="border-2 border-bru4 p-3 text-left">Item ID</th>
                <th className="border-2 border-bru4 p-3 text-left">First Variant</th>
                <th className="border-2 border-bru4 p-3 text-left">Second Variant</th>
                <th className="border-2 border-bru4 p-3 text-left">Purchase Price</th>
                <th className="border-2 border-bru4 p-3 text-left">Sales Price</th>
                <th className="border-2 border-bru4 p-3 text-left">Min stock</th>
                <th className="border-2 border-bru4 p-3 text-left">SKU/Part No</th>
              </tr>
            </thead>
            <tbody>
              {h_itemSkuReg.map((v_rcdItemSku, index) => (
                <tr
                  key={index}
                  onClick={() => handleOpenModalEdit(v_rcdItemSku.itemid)} // Click to open modal for update/delete
                  className={`border-t-2 border-gray-300 ${index % 2 === 0 ? "bg-white" : "bg-bru1"} hover:bg-blue-50 transition duration-200 cursor-pointer`}
                >
                  <td className="border-2 border-bru4 p-3 text-blue-700 hover:text-blue-900 font-medium">
                    {v_rcdItemSku.itemid}
                  </td>
                  <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItemSku.ivv1}</td>
                  <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItemSku.ivv2}</td>
                  <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItemSku.pp}</td>
                  <td className="border-2 border-bru4 p-3 text-gray-800">{v_rcdItemSku.sp || "N/A"}</td>
                  <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItemSku.minstk}</td>
                  <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItemSku.sku}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-800 text-lg text-center">No variants available for this Product.</p>
      )}

      {/* Render the ItemSkuManage Modal */}
      { isModalOpen &&   (
        <ItemSkuManage
          p_itemmid={selectedItemId ? null : p_itemmid} // Pass p_itemmid when adding a new item
          p_itemid={selectedItemId} // Pass itemid when updating/deleting
          onClose={() => setIsModalOpen(false) }// Close modal
        />
      )}
    </div>
  );
}
