"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import ImageGallery from "@/components/shared/imageGallery";

export default function ItemImgSuspense() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ItemImg />
        </Suspense>
    )
}

const ItemImg = () => {
    const [v_cdomain] = useState("buyerpanda.com"); // Fixed value
    const [images, setImages] = useState<string[]>([]);
    // Read v_itemmid from URL params
    const params = useParams();
    const v_itemmid = params.id ? Number(params.id) : null; // Convert to number if available

    const [displaySet] = useState("A"); // Default hidden field
    const [annotation, setAnnotation] = useState(""); // User input
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [uploadSuccessful, setUploadSuccessful] = useState<boolean>(false);


    const handleUpload = async () => {
        if (!file) { setMessage("Please select a file to upload."); return; }
        // Clear message before upload
        setMessage("");
        // Ensure v_itemmid is available
        if (!v_itemmid) { setMessage("Error: v_itemmid is missing. Cannot generate the filename."); return; }
        // Ensure annotation is provided
        if (!annotation) { setMessage("Error: Annotation is required."); return; }

        try {
            // ✅ CFolder Name
            const folderName = `${v_itemmid}`;

            // ✅ Corrected Filename Format
            // const fileName = `${v_itemmid}_${displaySet}_${annotation}.jpg`;
            const fileExt = file.name.split('.').pop(); // Get the actual extension
            const fileName = `${v_itemmid}_${displaySet}_${annotation}.${fileExt}`;

            // Create FormData object
            const formData = new FormData();
            formData.append("cdomain", v_cdomain);
            formData.append("folderName", folderName); // ✅ Corrected Path
            formData.append("fileName", fileName);
            formData.append("file", file);

            // Send the FormData to the API
            const response = await fetch("/api/s3", {
                method: "POST",
                body: formData,
            });

            const jsonResponse = await response.json();

            if (response.ok) {
                const uploadedFileUrl = `${folderName}/${fileName}`;
                setMessage(`✅ Upload Successful: ${uploadedFileUrl}`);
                setUploadSuccessful(true);
            } else {
                setMessage(`❌ Upload Failed: ${jsonResponse.error}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setMessage("❌ An error occurred during upload.");
        }
    };


    useEffect(() => {
        if (!v_itemmid) return;

        const fetchImages = async () => {
            try {
                const v_epRt = `/api/s3?cdomain=${v_cdomain}&folder=${v_itemmid}`;
                const v_resRt = await fetch(v_epRt, { method: "GET", headers: { "Content-Type": "application/json" }, });
                const v_resRtData = await v_resRt.json();
                if (v_resRtData.images) { setImages(v_resRtData.images); }

            } catch (error) {
                console.error("Error fetching images:", error);
            }
            setUploadSuccessful(false);
        };

        fetchImages();
    }, [v_itemmid, v_cdomain, uploadSuccessful]);


    return (
        <div className="bg-transparent py-2 px-2 lg:px-4" >
            <div className="flex-1 bg-bru1 rounded-lg shadow-xl py-4" >
                <div className="border-b border-bru3">
                    <h2 className="px-6 py-2 text-2xl font-semibold text-gray-800">
                        Product Images
                    </h2>
                </div>

                <div className="px-6 py-4">
                    
                    {/* Image Gallery */}
                    <div className="flex justify-center items-center mb-4">
                        <ImageGallery images={images} />
                    </div>

                    {/* Hidden Inputs */}
                    <input type="hidden" value={v_cdomain} />
                    <input type="hidden" value={displaySet} />

                    {/* Annotation Input */}
                    <div>
                        <label className="text-bru5">
                            Annotation:
                            <input
                                type="text"
                                value={annotation}
                                onChange={(e) => setAnnotation(e.target.value)}
                                required
                                className="px-3 py-2 text-black border-gray-300 shadow-sm sm:text-sm bg-white"
                            />
                        </label>
                    </div>

                    {/* File Input */}
                    <div className="my-4">
                        <label className="text-bru5">
                            File:
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                required
                                className="px-3 py-2 text-black border-gray-300 shadow-sm sm:text-sm bg-white"
                            />
                        </label>
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        className="bg-bru5"
                    >
                        Upload File
                    </button>

                    {/* Message Display */}
                    {message && (
                        <div className="text-bru5">
                            <strong>{message}</strong>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


