/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Mark this as a Client Component for React (Next.js)

import { useSearchParams } from "next/navigation";
// import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Import Next.js router
import LOV from "@/components/shared/LOV"; // Import LOV component


// ✅ Nav-R1: Define Props ================
interface ItemSkuProps {
  p_itemid: number | null; // Required for update/delete
  p_itemmid: number | null; // Required for add
  onClose: () => void; //  Add onClose prop to handle closing the pop-up
}

// ✅ Define TypeScript interface for item data structure
interface TypeSku {
  itemid: number | null;
  itemmid: number | null;
  ivv1: string;
  ivv2: string;
  pp: string;
  sp: string;
  minstk: string;
  sku: string;
}

export default function ItemSkuManage({ p_itemid, p_itemmid, onClose }: ItemSkuProps) {
 
// ✅ C1: Declare State Variables.
  // const router = useRouter(); //  Initialize Next.js router
  const searchParams = useSearchParams(); // Get query parameters
  const v_ivv1 = searchParams.get("pivv1") || ""; // Extract values from URL , Default to empty string if null
  const v_ivv2 = searchParams.get("pivv2") || "";
  // const [isLoading, setIsLoading] = useState(false); // Track loading state

  const [formData, setFormData] = useState<TypeSku>({
    itemid: null,
    itemmid: p_itemmid, // Initialize with p_itemmid for add operations
    ivv1: "",
    ivv2: "",
    pp: "",
    sp: "",
    minstk: "",
    sku: "",
   });


// ✅ C2: Define useEffect.=======================
useEffect(() => {

  const fetchItemData = async () => {
    if (p_itemid !== null) {
       //setIsLoading(true); 
      try {
        // 1: Prepare ASKFOR and CONDITION.
           const v_askfor = 'ITEMSKU';
           const v_cnd = `itemid=${p_itemid}`;
           const v_epRt = `/api/item/?askfor=${v_askfor}&cnd=${v_cnd}`;
        // 2: Call Route
           const v_resRt = await fetch(v_epRt,{
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });  
        // 3: Extract JSON-Object
         const v_resRtWrap = await v_resRt.json();        // Route Return-Build Full Part
         const v_resRtStr = v_resRtWrap.data;             // Route Return-Build Data Part in JSON-String Format
         const v_resRtData = v_resRtStr.map(JSON.parse);  // Route Return-Build Data Part in JSON-ObjectFormat
           
        // 4: Load to State Variable.
        setFormData({
          itemmid: v_resRtData[0].itemmid,
          itemid: v_resRtData[0].itemid,
          ivv1: v_resRtData[0].ivv1,
          ivv2: v_resRtData[0].ivv2,
          pp: v_resRtData[0].pp,
          sp: v_resRtData[0].sp,
          minstk: v_resRtData[0].minstk,
          sku: v_resRtData[0].sku,
        });
      } catch (error) {
        console.error("❌ Error fetching item data:", error);
        alert("Failed to fetch item data. Please try again.");
      } finally {
        //setIsLoading(false); // Stop loading
      }
    }
  };

  fetchItemData(); // Call the fetch function
}, [p_itemid]); // Trigger when p_itemid changes


// ✅ C3: Handle Functions==========================
  // input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Update the state dynamically
  };

  // Handle insert (POST)
  const handleInsert = async () => {

    // ✅ 1. Build and Stringify Payload
    const v_payload = JSON.stringify( {
      operation: "ITEMSKUI",
      ...formData,
    });

   
    try {
     // ✅  2. Call Route
        const v_resRt = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: v_payload,
      });

      // ✅  3. Extract Route Return-Build Response to JSON-Jobject
      const v_resRtWrap = await v_resRt.json();  //Full Return-Build(result,data,status)
      const v_resRtStr = v_resRtWrap.data;       //Return-Build data part in JSON-String format
      const v_resRtData = JSON.parse(v_resRtStr); //Return-Build data part in JSON-Object format


      // ✅ 4. Set Form Data - PK (only for handleInsert)
      if (v_resRtData?.itemid) {
         setFormData((prevData) => ({
          ...prevData,
          itemid: v_resRtData.itemid, // Update formData with the new itemid
        }));

       alert(`New Record Action Result: ${v_resRtData.result} and ID: ${v_resRtData?.itemid || "N/A"}`);
      
      } else {
        console.warn("⚠️ API response did not contain itemid:", v_resRt);
      }
    
    } catch (error: any) {
      console.error("❌ Error submitting form:", error);
      alert(`Submission failed: ${error.message || JSON.stringify(error)}`);
    }
  };

  // Handle update (PUT)
  const handleUpdate = async () => {
    //1. Building and Stringify Payload 
    const v_payload = JSON.stringify( {
      operation: "ITEMSKUU",
      ...formData,
    });

     //2. Call Route
    try {
      const v_resRt = await fetch(`/api/item`, {    //Full response Return-Build,Network..

        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: v_payload,
      });

      // 3. Extract Route Return-Build Response to JSON-Jobject
      const v_resRtWrap = await v_resRt.json();  //Full Return-Build(result,data,status)
      const v_resRtStr = v_resRtWrap.data;       //Return-Build data part in JSON-String format
      const v_resRtData = JSON.parse(v_resRtStr); //Return-Build data part in JSON-Object format

      alert(`Updated Action Result: ${v_resRtData.result}`);
      //setIsSubmitted(true); // Keep form open for further actions

    } catch (error: any) {
      console.error("❌ Error updating form:", error);
      alert(`Update failed: ${error.message || JSON.stringify(error)}`);
    }
  };

  // Handle delete (DELETE)
  const handleDelete = async () => {
    if (formData.itemid === null) {alert("No item to delete."); return; }
  
    //1. Building and Stringify Payload 
    const v_payload = JSON.stringify({
      operation: "ITEMSKUD",
      itemid: formData.itemid,
    });

    //2. Call Route
    try {
      const v_resRt = await fetch(`/api/item`, {   //Full response Return-Build,Network..
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: v_payload,
      });

      // 3. Extract Route Return-Build Response to JSON-Jobject
      const v_resRtWrap = await v_resRt.json();        // Route Return-Build Full Part
      const v_resRtStr = v_resRtWrap.data;             // Route Return-Build Data Part in JSON-String Format
      const v_resRtData = JSON.parse(v_resRtStr);      // Route Return-Build Data Part in JSON-ObjectFormat
   
      alert(` Delete action result: ${v_resRtData.result}`);
      onClose(); // Close the pop-up after deletion
    
    } catch (error: any) {
      console.error("❌ Error deleting item:", error);
      alert(`Deletion failed: ${error.message || JSON.stringify(error)}`);
    }
  };


  // Handle LOV selection
  const handleLOVChange = (field: keyof TypeSku) => (selectedOption: { value: string; label: string } | null) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOption ? selectedOption.value : "", // ✅ Store only `value`
    }));
  };


  //✅ D: Display Data on HTML from State Variable.
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-bru1 rounded-lg shadow-lg w-full max-w-4xl mx-4 h-[85vh] overflow-y-auto">
        <div className="border-b border-bru4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 px-6 py-4 ">
            {p_itemid !== null ? "Edit Item" : "Item Variant"}
          </h2>
          <button
            onClick={onClose} // Close the pop-up
            className="text-gray-500 border-0 hover:text-gray-700 m-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4 ">
          {/* Item ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Item.ID</label>
            <input
              type="number"
              name="itemid"
              value={ formData.itemid || ""}
              disabled
              className="px-3 py-2 text-black border-bru3 shadow-sm sm:text-sm bg-bru2"
            />
          </div>

          {/* Item MID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Item MID</label>
            <input
              type="number"
              name="itemmid"
              value={formData.itemmid || ""}
              disabled
              className="px-3 py-2 text-black border-bru3 shadow-sm sm:text-sm bg-bru2"
            />
          </div>

          <p>Variant: {v_ivv1} & {v_ivv2} </p>



          {/* Item First Variant - LOV */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{v_ivv1}</label>
            <LOV
              p_lovName={v_ivv1}
              placeholder={`Select ${v_ivv1}`}
              onChange={handleLOVChange("ivv1")}
              value={formData.ivv1}
            />
          </div>

          {/* Item Second Variant - LOV */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{v_ivv2}</label>
            <LOV
              p_lovName={v_ivv2}
              placeholder={`Select ${v_ivv2}`}
              onChange={handleLOVChange("ivv2")}
              value={formData.ivv2}
            />
          </div>

          {/* Purchase Price*/}
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
            <input
              type="text"
              name="pp"
              value={formData.pp}
              onChange={handleInputChange}
              className="px-3 py-2 text-black border-gray-300 shadow-sm sm:text-sm bg-white"
            />
          </div>

          {/* Sales Price */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700">Sales Price</label>
            <input
              type="text"
              name="sp"
              value={formData.sp}
              onChange={handleInputChange}
              className="px-3 py-2 text-black border-gray-300 shadow-sm sm:text-sm bg-white"
            />
          </div>

          {/* Minimum Stock - LOV */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Stock</label>
            <input
              type="text"
              name="minstk"
              value={formData.minstk}
              onChange={handleInputChange}
              className="px-3 py-2 text-black border-gray-300 shadow-sm sm:text-sm bg-white"
            />
          </div>

          {/* Stock Unit or Part No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Unit</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="px-3 py-2 text-black border-gray-300 shadow-sm sm:text-sm bg-white"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-4 px-6 py-4 ">
         
          {/* Cancel Button (always visible ) */}
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 border-gray-800 hover:bg-gray-600 hover:border-gray-900"
          >
            Cancel
          </button>


          {/* Insert Button (only visible when p_itemmid is null) */}
          {formData.itemid === null && (
            <button onClick={handleInsert} className="bg-bru4">
              Create
            </button>
          )}

          {/* Update Button (only visible when p_itemmid is not null) */}
          {formData.itemid !== null && (
            <button onClick={handleUpdate} className="bg-bru4"    >
              Update
            </button>
          )}

          {/* Delete Button (only visible when p_itemmid is not null) */}
          {formData.itemid !== null && (
            <button onClick={handleDelete} className="bg-red-500 border-red-800 hover:bg-red-600 hover:border-red-900"   >
              Delete
            </button>
          )}


        </div>

      </div>
    </div>
  );
};