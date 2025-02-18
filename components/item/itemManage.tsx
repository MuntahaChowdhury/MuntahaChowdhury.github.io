/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // ✅ Mark this as a Client Component for React (Next.js)

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Import Next.js router
import { v_host } from "@/components/constants";
import LOV from "@/components/shared/LOV"; // ✅ Import LOV component
//import ItemSkuReg from "@/components/item/itemSkuReg"; // Import the ItemSkuReg component

// Define props for Update
interface ItemManageProps {
  p_itemmid: number | null;
}

// ✅ Define TypeScript interface for item data structure
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

export default function ItemManage({ p_itemmid }: ItemManageProps) {
  const router = useRouter(); // ✅ Initialize Next.js router

  // ✅ Function to navigate back to /item/page.tsx
  const handleCancel = () => {
    router.push("/item");
  };

  // ✅ Define state to manage form data
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

  //const [isSubmitted, setIsSubmitted] = useState(false); // ✅ Track submission state
  //const [savedItemMid, setSavedItemMid] = useState<number | null>(null); // ✅ Store new itemmid after saving
  const [isLoading, setIsLoading] = useState(false); // ✅ Track loading state

  // ✅ Function to fetch item data when p_itemmid is provided
  useEffect(() => {
    const fetchItemData = async () => {
      if (p_itemmid !== null) {
        setIsLoading(true); // Start loading
        try {
          const v_resVw = await fetch(`${v_host}/ridbiz/useritemmast/?mkrid=RIDBIZ&cdomain=buyerpanda.com&itemmid=${p_itemmid}`);
          if (!v_resVw.ok) {
            throw new Error(`Failed to fetch item data: ${v_resVw.statusText}`);
          }
          const v_resVwWrap = await v_resVw.json();
          const v_resVwData = v_resVwWrap.items;
          console.log("ItemMID Data:", v_resVwData[0].itemmast);
          // Update formData with the fetched data
          setFormData({
            itemmid: v_resVwData[0].itemmid,
            itemcat: v_resVwData[0].itemcat,
            itemsrvc: v_resVwData[0].itemsrvc,
            itemmast: v_resVwData[0].itemmast,
            idesc: v_resVwData[0].idesc,
            pub: v_resVwData[0].pub,
            gp: v_resVwData[0].gp,
            itemvar1: v_resVwData[0].itemvar1,
            itemvar2: v_resVwData[0].itemvar2,
            cdomain: v_resVwData[0].cdomain,
            invgrp: v_resVwData[0].invgrp,
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
  }, [p_itemmid]); // Trigger when p_itemmid changes

  // ✅ Function to handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Update the state dynamically
  };

  // ✅ Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (formData.itemmid === null) {
      await handleInsert(); // Call handleInsert if itemmid is null
    } else {
      await handleUpdate(); // Call handleUpdate if itemmid is not null
    }
  };

  // ✅ Function to handle insert (POST)
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

  // ✅ Function to handle update (PUT)
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

  // ✅ Function to handle delete (DELETE)
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

  // ✅ Generalized function to handle LOV selection
  const handleLOVChange = (field: keyof TypeItem) => (selectedOption: { value: string; label: string } | null) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOption ? selectedOption.value : "", // ✅ Store only `value`
    }));
  };

  // ✅ Function to handle radio button changes
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Update the state dynamically
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Form */}
        <div className="flex-1 bg-bru1 rounded-lg shadow-xl overflow-hidden">



          <div className="px-6 py-4 border-b border-bru2">
            <h2 className="text-2xl font-semibold text-bru5">
              {p_itemmid !== null ? "Edit Item" : "Add New Item"}
            </h2>
          </div>


          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (


            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ✅ Item MID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item MID</label>
                  <input
                    type="number"
                    name="itemmid"
                    value={formData.itemmid !== null ? formData.itemmid : ""}
                    disabled
                    className="block py-2 sm:text-sm text-black bg-gray-100"
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
                    className="block py-2 sm:text-sm text-black bg-gray-100"
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  <label className="block text-gray-700">Global</label>
                  <div className="mt-1 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gp"
                        value="Y"
                        checked={formData.gp === "Y"}
                        onChange={handleRadioChange}
                        className="accent-bru3"
                      />
                      <span className="ml-2 mt-1 text-bru4">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gp"
                        value="N"
                        checked={formData.gp === "N"}
                        onChange={handleRadioChange}
                        className="accent-bru3"
                      />
                      <span className="ml-2 mt-1 text-bru4">No</span>
                    </label>
                  </div>
                </div>

                {/* ✅ Publication Status */}
                <div>
                  <label className="block text-gray-700">Publication</label>
                  <div className="mt-1 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pub"
                        value="Y"
                        checked={formData.pub === "Y"}
                        onChange={handleRadioChange}
                        className="accent-bru3"
                      />
                      <span className="ml-2 mt-1 text-bru4">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pub"
                        value="N"
                        checked={formData.pub === "N"}
                        onChange={handleRadioChange}
                        className="accent-bru3"
                      />
                      <span className="ml-2 mt-1 text-bru4">No</span>
                    </label>
                  </div>
                </div>
              </div>



              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-4">

                <button type="button" onClick={handleCancel} className="bg-bru5" >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-bru4"
                >
                  {p_itemmid !== null ? "Update" : "Save"}
                </button>

                {p_itemmid !== null && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 border-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          )}




        </div>
      </div>
    </div>
  );
}