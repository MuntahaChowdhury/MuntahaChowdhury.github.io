/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react";
// import { v_host } from "@/components/constants";

interface Props {
    onSelectItemCat: (g_itemCat: string) => void;
}



export default function ItemCatReg({ onSelectItemCat }: Props) {
    const [h_itemCat, setItemCat] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        // const v_epVw = `${v_host}/ridbiz/useritemcat/?mkrid=RIDBIZ&cdomain=buyerpanda.com`;

        const fetchUserItemCat = async () => {
            try {
                setLoading(true);
                setError(null);

                // const v_resVw = await fetch(v_epVw);
                const v_resVw = await fetch('/api/item/test');
                if (!v_resVw.ok) throw new Error(`Failed to fetch data. Status: ${v_resVw.status}`);
                const v_resVwWrap = await v_resVw.json();
                const v_resVwData = v_resVwWrap.items;
                setItemCat(v_resVwData);  //send data to h_itemCat variable to use in HTML

            } catch (err) {
                console.error("❌ Fetch Error:", err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchUserItemCat();
    }, [])


    return (
        <div className="p-6 bg-bru3 text-gray-900 rounded shadow-md">

            <h2 className="text-2xl font-bold text-bru5 mb-4"> Category Register</h2>
            {loading && <p className="text-bru4 font-semibold">Loading...</p>}
            {error && <p className="text-red-500 font-semibold">Error: {error}</p>}



            {h_itemCat.length > 0 ? (
                <table className="min-w-full bg-white border-2 border-bru4 shadow-sm">

                    <thead>
                        <tr className="bg-bru2 text-left">
                            <th className="p-3 border-2 border-bru4">Item Category</th>
                        </tr>
                    </thead>

                    <tbody>
                        {h_itemCat.map((v_rcdItemCat, index) => (
                            <tr key={index}
                                className="border-b-2 border-bru4 bg-bru1 last:border-b-0 cursor-pointer hover:bg-blue-200 transition duration-200"
                                onClick={() => onSelectItemCat(v_rcdItemCat.itemcat)}
                            >
                                <td className="p-3 border">{v_rcdItemCat.itemcat}</td>
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