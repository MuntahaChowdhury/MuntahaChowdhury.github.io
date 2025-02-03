"use client";

import React, { useState } from "react";
// import Header from "@/components/uishell/header";
// import Footer from "@/components/uishell/Footer";
import ReturnButton from "@/component/return";

const S3UploadPage = () => {
  const [v_cdomain, setCdomain] = useState("buyerpanda.com");
  const [v_folderName, setFolderName] = useState("testfolder");
  const [v_file, setFile] = useState<File | null>(null);
  const [v_message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!v_file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      // Create FormData object
      const v_formData = new FormData();
      v_formData.append("cdomain", v_cdomain);
      v_formData.append("folderName", v_folderName);
      v_formData.append("fileName", v_file.name);
      v_formData.append("file", v_file);

      // Send the FormData to the API
      const v_resRt = await fetch("/api/s3", {
        method: "POST",
        body: v_formData,
      });

      const v_resRtWrap = await v_resRt.json();

      if (v_resRt.ok) {
        setMessage(`File uploaded successfully: ${v_resRtWrap.fileKey}`);
      } else {
        setMessage(`Upload failed: ${v_resRtWrap.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred during the upload.");
    }
  };

  return (
    <>
      {/* <Header /> */}
      <div className="relative flex items-center justify-center min-h-screen px-4 py-10 text-white">
        <ReturnButton />    {/* Remove relative from above */}
        <div className="form-bg">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Upload File to S3</h2>
          </div>

          <form className="space-y-6">
            {/* Cdomain */}
            <div>
              <label className="block text-sm font-medium">Cdomain</label>
              <input
                type="text"
                value={v_cdomain}
                onChange={(e) => setCdomain(e.target.value)}
              />
            </div>

            {/* Folder Name */}
            <div>
              <label className="block text-sm font-medium">Folder Name</label>
              <input
                type="text"
                value={v_folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium">File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
            >
              Upload File
            </button>
          </form>

          {/* Message */}
          {v_message && (
            <div className="mt-5 text-center text-white">
              <strong>{v_message}</strong>
            </div>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </>

  );
};

export default S3UploadPage;
