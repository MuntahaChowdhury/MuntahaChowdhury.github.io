/* eslint-disable @typescript-eslint/no-explicit-any */
// ✅ A.Import React-lib and custom components. 

"use client";  
import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";  
import LOV from "@/components/shared/LOV";  
//import ItemSkuReg from "@/components/item/itemSkuReg"; // Import the ItemSkuReg component

// Define props for Update
   //interface ItemManageProps {p_itemmid: number | null;}


// ✅ B.Define Interface and props (if needed)
interface TypeItem {
  itemmid: number | null; // Use null to differentiate between an empty state and a real item
  itemcat: string;
  itemsrvc: string;
  itemmast: string;
  idesc: string;
  pub: string;
  gp: string;
  itemvar1: string;
  itemvar2: string;
  cdomain: string;
  invgrp: string;
  operation: string;
}

// ✅ C.Open Main Function that exports HTML
export default function ItemManageSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItemManage />
    </Suspense>
  )
}

const ItemManage = () => {
   const router = useRouter(); // ✅ Initialize Next.js router


  // ✅ C1: Declare State Variables.
  const [formData, setFormData] = useState<TypeItem>({
    itemmid: null, // Initially null, will be updated when the item is saved
    itemcat: "",
    itemsrvc: "INVENTORY", // Default value
    itemmast: "",
    idesc: "",
    pub: "N", // 'N' means Not Published
    gp: "N",
    itemvar1: "N",
    itemvar2: "N",
    cdomain: "buyerpanda.com", // Default domain
    invgrp: "ECOMMERCE", // Default inventory group
    operation: "ITEMMASTI", // API operation type
  });

  // const [isSubmitted, setIsSubmitted] = useState(false); // ✅ Track submission state
  // const [savedItemMid, setSavedItemMid] = useState<number | null>(null); // ✅ Store new itemmid after saving
  const [isLoading, setIsLoading] = useState(false); // ✅ Track loading state

        //Nav-R1: Read Value from URL {Dynamic Route Parameters}
          const params = useParams();
          const pitemmid = params.id ? Number(params.id) : null; // Convert to number if needed
 

  // ✅ C2: Define useEffect (reload)
  useEffect(() => {
    const fetchItemData = async () => {
      if (pitemmid !== null) {               //Nav-R2: Modify useEffect for execution
        setIsLoading(true);  
       
        try {
        // 1: Prepare ASKFOR and CONDITION.
            const v_askfor = 'ITEMMAST';
            const v_cnd = `itemmid=${pitemmid}`;
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
            itemcat: v_resRtData[0].itemcat,
            itemsrvc: v_resRtData[0].itemsrvc,
            itemmast: v_resRtData[0].itemmast,
            idesc: v_resRtData[0].idesc,
            pub: v_resRtData[0].pub,
            gp: v_resRtData[0].gp,
            itemvar1: v_resRtData[0].itemvar1,
            itemvar2: v_resRtData[0].itemvar2,
            cdomain: v_resRtData[0].cdomain,
            invgrp: v_resRtData[0].invgrp,
            operation: "ITEMMASTU", // Keep the operation type
          });
        } catch (error) {
          console.error("❌ Error fetching item data:", error);
          alert("Failed to fetch item data. Please try again.");
        } finally {
          setIsLoading(false); // Stop loading
        }
      }
    };

    fetchItemData(); // Call the fetch function
  }, [pitemmid]); // Trigger when p_itemmid changes

    // ✅ C3: Define Handle Functions ==================

  // Handle insert (POST)
  const handleInsert = async () => {
    try {
      const v_resRt = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await v_resRt.json(); // Parse the response
      console.log("API Response Data:", responseData); // Debugging log

      if (!v_resRt.ok) {
        throw new Error(`API Error: ${responseData.error || "Network response was not ok"}`);
      }

      // ✅ Check if API returned an itemmid and update the state
      if (responseData.data?.itemmid) {
        console.log("✅ Updating itemmid to:", responseData.data.itemmid);

        //setSavedItemMid(responseData.data.itemmid); // Save the new itemmid
        setFormData((prevData) => ({
          ...prevData,
          itemmid: responseData.data.itemmid, // Update form state with new itemmid
        }));
      } else {
        console.warn("⚠️ API response did not contain itemmid:", responseData);
      }

      alert(`Item added successfully! Item MID: ${responseData.data?.itemmid || "N/A"}`);
      //setIsSubmitted(true); // Keep form open for further actions
    } catch (error: any) {
      console.error("❌ Error submitting form:", error);
      alert(`Submission failed: ${error.message || JSON.stringify(error)}`);
    }
  };

  // Handle update (PUT)
  const handleUpdate = async () => {
    try {
      const v_resRt = await fetch(`/api/item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const v_resRtData = await v_resRt.json(); // Parse the response

      if (!v_resRt.ok) {
        throw new Error(`API Error: ${v_resRtData.error || "Network response was not ok"}`);
      }

      alert(`Item updated successfully! Item MID: ${formData.itemmid}`);
      //setIsSubmitted(true); // Keep form open for further actions
    } catch (error: any) {
      console.error("❌ Error updating form:", error);
      alert(`Update failed: ${error.message || JSON.stringify(error)}`);
    }
  };

  // Handle delete (DELETE)
  const handleDelete = async () => {
    if (formData.itemmid === null) {
      alert("No item to delete.");
      return;
    }

    const v_payload = JSON.stringify({
      operation: "ITEMMASTD",
      itemmid: formData.itemmid,
    });

    try {
      const v_resRt = await fetch(`/api/item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: v_payload,
      });

      const v_resRtData = await v_resRt.json(); // Parse the response

      if (!v_resRt.ok) {
        throw new Error(`API Error: ${v_resRtData.error || "Network response was not ok"}`);
      }

      alert(`Item deleted successfully! Item MID: ${formData.itemmid}`);
      router.push("/item"); // Redirect to the item list page after deletion
    } catch (error: any) {
      console.error("❌ Error deleting item:", error);
      alert(`Deletion failed: ${error.message || JSON.stringify(error)}`);
    }
  };

// Navigation
  const handleCancel = () => {
          router.push("/item");
        };
//input changes in the form
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          const { name, value } = e.target;
         setFormData((prevData) => ({ ...prevData, [name]: value })); // Update the state dynamically
     };
// Handle LOV selection
  const handleLOVChange = (field: keyof TypeItem) => (selectedOption: { value: string; label: string } | null) => {
       setFormData((prevData) => ({
         ...prevData,
        [field]: selectedOption ? selectedOption.value : "", // ✅ Store only `value`
       }));
    };
  // Handle radio button changes
   const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
     setFormData((prevData) => ({ ...prevData, [name]: value })); // Update the state dynamically
   };


// D: Display Data on HTML from State Variable.   
  return (
    // <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="bg-transparent py-2 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Form */}
        <div className="flex-1 bg-bru1 rounded-lg shadow-xl  h-[85vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-bru3">
            <h2 className="text-2xl font-semibold text-gray-800">
              {pitemmid !== null ? "Edit Item" : "Add New Item"}
            </h2>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ✅ Item MID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item MID</label>
                  <input
                    type="number"
                    name="itemmid"
                    value={formData.itemmid !== null ? formData.itemmid : ""}
                    disabled
                    className="px-3 py-2 text-black border-bru3 shadow-sm sm:text-sm bg-bru2"
                  />
                </div>

                {/* ✅ Item Category - LOV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Category</label>
                  <LOV
                    p_lovName="itemcat"
                    placeholder="Select an Item Category"
                    onChange={handleLOVChange("itemcat")}
                    value={formData.itemcat}
                  />
                </div>

                {/* ✅ Item Service - LOV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Service</label>
                  <LOV
                    p_lovName="itemsrvc"
                    placeholder="Select an Item Service"
                    onChange={handleLOVChange("itemsrvc")}
                    value={formData.itemsrvc}
                  />
                </div>

                {/* ✅ Item Mast */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Mast</label>
                  <input
                    type="text"
                    name="itemmast"
                    value={formData.itemmast}
                    onChange={handleInputChange}
                    className="px-3 py-2 text-black border-gray-300 shadow-sm sm:text-sm bg-white"
                  />
                </div>

                {/* ✅ Description */}
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="idesc"
                    value={formData.idesc ?? ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-bru3 sm:text-sm"
                  />
                </div>

                {/* ✅ Item Variant 1 - LOV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Variant</label>
                  <LOV
                    p_lovName="itemvar"
                    placeholder="First Variant"
                    onChange={handleLOVChange("itemvar1")}
                    value={formData.itemvar1}
                  />
                </div>

                {/* ✅ Item Variant 2 - LOV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Second Variant</label>
                  <LOV
                    p_lovName="itemvar"
                    placeholder="Second Variant"
                    onChange={handleLOVChange("itemvar2")}
                    value={formData.itemvar2}
                  />
                </div>

                {/* ✅ Global */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Global</label>
                  <div className="mt-1 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gp"
                        value="Y"
                        checked={formData.gp === "Y"}
                        onChange={handleRadioChange}
                        className="accent-bru5"
                      />
                      <span className="ml-2 mt-2 text-bru4">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gp"
                        value="N"
                        checked={formData.gp === "N"}
                        onChange={handleRadioChange}
                        className="accent-bru5"
                      />
                      <span className="ml-2 mt-2 text-bru4">No</span>
                    </label>
                  </div>
                </div>

                {/* ✅ Publication Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Publication</label>
                  <div className="mt-1 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pub"
                        value="Y"
                        checked={formData.pub === "Y"}
                        onChange={handleRadioChange}
                        className="accent-bru5"
                      />
                      <span className="ml-2 mt-2 text-bru4">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pub"
                        value="N"
                        checked={formData.pub === "N"}
                        onChange={handleRadioChange}
                        className="accent-bru5"
                      />
                      <span className="ml-2 mt-2 text-bru4">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-4">
                {/* Cancel Button (always visible) */}
                <button
                  type="button"
                  onClick={handleCancel}        className="bg-gray-500 border-gray-800 hover:bg-gray-600 hover:border-gray-900"
                >
                  Cancel
                </button>

                {/* Insert Button (only visible when p_itemmid is null) */}
                {formData.itemmid === null && (
                  <button onClick={handleInsert} className="bg-bru4">
                    Create
                  </button>
                )}

                {/* Update Button (only visible when p_itemmid is not null) */}
                {formData.itemmid !== null && (
                  <button onClick={handleUpdate} className="bg-bru4">
                    Update
                  </button>
                )}

                {/* Delete Button (only visible when p_itemmid is not null) */}
                {formData.itemmid !== null && (
                  <button onClick={handleDelete} className="bg-red-500 border-red-800 hover:bg-red-600 hover:border-red-900">
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}