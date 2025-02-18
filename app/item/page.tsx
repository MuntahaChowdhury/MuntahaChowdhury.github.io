// calls to display Item Categories and Items
"use client";

import React, { useState } from "react";
import ItemCatReg from "@/components/item/itemCatReg";
import ItemReg from "@/components/item/itemReg";

export default function ItemPage() {
    const [g_itemCat, setGitemCat] = useState<string | null>(null);
    return (
        <div className="p-6">

            <h1 className="text-3xl text-center font-bold mt-4 mb-8 text-white">
                Product Categories & Items
            </h1>

            <div className="flex gap-6">

                {/* Category List */}
                <div className="w-1/3">
                    <ItemCatReg onSelectItemCat={setGitemCat} />
                </div>

                {/* Item List */}
                <div className="w-2/3">
                    <ItemReg p_itemCat={g_itemCat} />
                </div>

            </div>


        </div>
    )
}