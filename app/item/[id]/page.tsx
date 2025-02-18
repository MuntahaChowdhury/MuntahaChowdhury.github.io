"use client";  // Necessary because useSearchParams is a client-side hook
//import { useParams } from "next/navigation";
//import { useParams, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import ItemManage from "@/components/item/itemManage";
import ItemSkuReg from "@/components/item/itemSkuReg"; // Import the ItemSkuReg component



export default function ManageItemPage() {
    const params = useParams();
    const p_itemmid = params.id ? Number(params.id) : null;


    //const params = useParams(); // Get the dynamic [id] value
    //const searchParams = useSearchParams(); // Get query parameters
    //Extract values from URL
    //const itemId = params.id;
    //const p_ivv1 = searchParams.get("p_ivv1") || ""; // Default to empty string if null
    //const p_ivv2 = searchParams.get("p_ivv2") || "";


    return (
        <div className="p-6 flex flex-col space-y-6">
            <h2 className="text-4xl text-white ml-10 font-bold mt-10">Edit Item</h2>
            <div className="flex flex-row space-x-6">
                <ItemManage p_itemmid={p_itemmid} /> {/* Ensure p_itemmid is defined */}
                <ItemSkuReg p_itemmid={p_itemmid} />
                {/* <ItemSkuReg p_itemmid={p_itemmid} p_ivv1={p_ivv1} p_ivv2={p_ivv2} /> */}
            </div>
        </div>


    );
}
