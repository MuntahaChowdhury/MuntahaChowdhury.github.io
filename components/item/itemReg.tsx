"use client";
import React, { useState, useEffect } from "react";
import { v_host } from "@/components/constants";
import { useRouter } from "next/navigation"; // ✅ Import Next.js router

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

interface Props {
    p_itemCat: string | null;
}




export default function ItemReg({ p_itemCat }: Props) {
    const [h_itemReg, setItemReg] = useState<ItemDetail[]>([]);
    const router = useRouter(); // ✅ Initialize Next.js router
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const handleAddNewItem = () => { router.push("/item/add"); };


    useEffect(() => {
        if (!p_itemCat) return; // Don't fetch if no category is selected
        const v_epItem = `${v_host}/ridbiz/useritemmast/?mkrid=RIDBIZ&cdomain=buyerpanda.com&itemcat=${p_itemCat}`;
        const fetchItemReg = async () => {
            try {
                setLoading(true);
                setError(null);

                const v_resVw = await fetch(v_epItem);
                if (!v_resVw.ok) throw new Error(`Failed to fetch data. Status: ${v_resVw.status}`);

                const v_resVwWrap = await v_resVw.json();
                const v_resVwData = v_resVwWrap.items || []; // Ensure it's always an array
                console.log(' SQL-Out Data', v_epItem);
                setItemReg(v_resVwData);

            } catch (err) {
                console.error("❌ Fetch Error:", err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchItemReg();
    }, [p_itemCat]);


    return (
        <div className="bg-bru3 p-6 rounded-lg shadow-lg">

            <h2 className="text-3xl font-bold mb-4 text-bru5">Item Register</h2>
            {loading && <div className="text-center text-lg text-blue-700 font-semibold">Loading...</div>}
            {error && <div className="text-center text-red-600 font-semibold">{error}</div>}


            {p_itemCat && (
                <div className="mb-6 p-5 border rounded-lg bg-gray-200 shadow-md">
                    <h3 className="text-xl font-semibold text-gray-900">Category: {p_itemCat}</h3>
                    <button onClick={handleAddNewItem} className="bg-bru5 my-4" >
                        + Add New Item
                    </button>
                    <p className="text-bru5">
                        Below are the items associated with the <strong>{p_itemCat}</strong> category.
                    </p>
                </div>
            )}


            {h_itemReg.length > 0 ? (
                <div className="overflow-x-auto maz-h-80">
                    <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg relative">


                        <thead className="bg-bru2 text-black sticky top-0">
                            <tr>
                                <th className="border-2 border-bru4 p-3 text-left">Item MID</th>
                                <th className="border-2 border-bru4 p-3 text-left">Service</th>
                                <th className="border-2 border-bru4 p-3 text-left">Category</th>
                                <th className="border-2 border-bru4 p-3 text-left">Item Name</th>
                                <th className="border-2 border-bru4 p-3 text-left">First Variant</th>
                                <th className="border-2 border-bru4 p-3 text-left">Second Variant</th>
                                <th className="border-2 border-bru4 p-3 text-left">Description</th>
                                <th className="border-2 border-bru4 p-3 text-left">GP</th>
                                <th className="border-2 border-bru4 p-3 text-left">PUB</th>
                                <th className="border-2 border-bru4 p-3 text-left">Maker Date</th>
                            </tr>
                        </thead>


                        <tbody>
                            {h_itemReg.map((v_rcdItem, index) => (
                                <tr
                                    key={index}
                                    className={`border-t-2 border-bru4 ${index % 2 === 0 ? "bg-white" : "bg-bru1"} hover:bg-blue-50 transition duration-200`}
                                >
                                    <td className="border-2 border-bru4 p-3 cursor-pointer text-blue-700 hover:text-blue-900 font-medium"
                                        onClick={() => router.push(`/item/${v_rcdItem.itemmid}?p_ivv1=${encodeURIComponent(v_rcdItem.itemvar1)}&p_ivv2=${encodeURIComponent(v_rcdItem.itemvar2)}`)}>
                                        {v_rcdItem.itemmid}
                                    </td>

                                    <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItem.itemsrvc}</td>
                                    <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItem.itemcat}</td>
                                    <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItem.itemmast}</td>
                                    <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItem.itemvar1}</td>
                                    <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItem.itemvar2}</td>
                                    <td className="border-2 border-bru4 p-3 text-gray-800">{v_rcdItem.idesc || "N/A"}</td>
                                    <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItem.gp}</td>
                                    <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItem.pub}</td>
                                    <td className="border-2 border-bru4 p-3 text-gray-900">{v_rcdItem.mkrdate || "N/A"}</td>
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
