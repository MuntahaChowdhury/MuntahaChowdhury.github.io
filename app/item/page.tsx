"use client";

// import React, { useState } from "react";
import React from "react";
import ItemCatReg from "@/components/item/itemCatReg";
import ItemReg from "@/components/item/itemReg";

export default function ItemPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        Product Categories & Items
      </h1>

      <div className="flex gap-6">


        {/* Category List */}
        <div className="w-1/3">
          <ItemCatReg />
        </div>

        {/* Item List */}
        <div className="w-2/3">
          <ItemReg/>
        </div>


        
      </div>
    </div>
  );
}
