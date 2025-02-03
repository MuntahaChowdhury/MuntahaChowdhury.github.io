
// api/user/s3/route.ts
//==============================================================================================================================

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;


// AWS S3 Configuration
const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const BUCKET_NAME = "ridbizecom";
const S3_BASE_URL = `https://${BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com`;

console.log("AWS Connection established successfully");

// Function to generate folder path
function genFolderPath(cdomain: string, folderName: string): string {
  return `${cdomain}/${folderName}/`;
}

// Function to sanitize file names
function sanitizeText(text: string): string {
  return text
     .replace(/\s+/g, "_") // Replace spaces with underscores
     .replace(/-+/g, "_") // Replace hyphens with underscores
     .replace(/[^\w.]/g, "") // Remove invalid characters except for dots
     .toLowerCase(); // Convert to lowercase
}

// POST request to upload a document
export async function POST(req: NextRequest) {
  console.log("API-S3 route is called for uploading a file");

  try {
    // Parse the FormData from the request
    const v_rformData = await req.formData();
    const v_rbody: { [key: string]: string | File } = {};

    v_rformData.forEach((value, key) => {
      v_rbody[key] = value;
    });

    const { cdomain, folderName, fileName, file } = v_rbody;
    const v_formattedFileName = sanitizeText(fileName as string);

    // Validation
    if (!cdomain || !folderName || !v_formattedFileName || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing required fields or invalid file" },
        { status: 400 }
      );
    }

    // Generate S3 object key
    const v_folderPath = genFolderPath(cdomain as string, folderName as string);
    const v_s3Key = `${v_folderPath}${v_formattedFileName}`;

    console.log("Generated S3 Key:", v_s3Key);

    // Read the file's Blob content
    const v_fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload file to S3
    const v_uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: v_s3Key,
      Body: v_fileBuffer,
      ContentType: file.type,
    });

    console.log(`Uploading file to S3: ${v_s3Key}`);
    await s3Client.send(v_uploadCommand);

    const v_objectUrl = `${S3_BASE_URL}/${v_s3Key}`;
    console.log(`S3 Object URL: ${v_objectUrl}`);
    return NextResponse.json({ message: "File uploaded successfully", fileUrl: v_objectUrl, result: "success"});

  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return NextResponse.json(
      { error: "Failed to upload file to S3" },
      { status: 500 }
    );
  }
}

// DELETE request to remove a document
export async function DELETE(req: NextRequest) {
  console.log("API-S3 route is called for deleting a file");

  try {
    const { fileKey } = await req.json();

    if (!fileKey) {
      return NextResponse.json(
        { error: "Missing required field: fileKey" },
        { status: 400 }
      );
    }

    // Delete file from S3
    const v_deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    console.log(`Deleting file from S3: ${fileKey}`);
    await s3Client.send(v_deleteCommand);

    return NextResponse.json({
      message: "File deleted successfully",
      fileKey,
    });
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return NextResponse.json(
      { error: "Failed to delete file from S3" },
      { status: 500 }
    );
  }
}

//==============================================================================================================================

