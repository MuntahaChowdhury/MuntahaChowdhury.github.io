"use client";  // Necessary because useSearchParams is a client-side hook
import ItemManage from "@/components/item/itemManage";
import ItemSkuReg from "@/components/item/itemSkuReg"; // Import the ItemSkuReg component
import ItemImg from "@/components/item/itemImg";



export default function ManageItemPage() {

  return (
    <div className="p-6 flex flex-col space-y-6">
      <h2 className="text-4xl font-bold my-4 text-white text-center">Edit Item</h2>
      <div className="flex flex-row space-x-6">
        <div>
          <ItemManage />
          <ItemImg />
        </div>
        <ItemSkuReg />
      </div>
    </div>


  );
}
