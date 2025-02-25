/* eslint-disable @typescript-eslint/no-explicit-any */

// api/user/s3/route.ts
//==============================================================================================================================

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

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
//  function genFolderPath(cdomain: string, folderName: string): string { return `${cdomain}/${folderName}/`;}

// Function to sanitize file names
function sanitizeText(text: string): string {
  return text
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/-+/g, "_") // Replace hyphens with underscores
    .replace(/[^\w.]/g, "") // Remove invalid characters except for dots
    .toLowerCase(); // Convert to lowercase
}

//==============================================================================================================================
// POST request to upload a document
//==============================================================================================================================

export async function POST(req: NextRequest) {
  console.log("API-S3 route is called for uploading a file");

  try {
    // Parse the FormData from the request
    const formData = await req.formData();
    const body: { [key: string]: any } = {};

    formData.forEach((value, key) => {
      body[key] = value;
    });

    const { cdomain, folderName, fileName, file } = body;
    const formattedFileName = sanitizeText(fileName);

    // Validation
    if (!cdomain || !folderName || !formattedFileName || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing required fields or invalid file" },
        { status: 400 }
      );
    }

    // Generate S3 object key
    //const folderPath = genFolderPath(cdomain, folderName);
    //const s3Key = `${folderPath}${formattedFileName}`;
    const s3Key = `${cdomain}/${folderName}/${formattedFileName}`;
    console.log("Generated S3 Key:", s3Key);

    // Read the file's Blob content
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload file to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: file.type,
    });

    console.log(`Uploading file to S3: ${s3Key}`);
    await s3Client.send(uploadCommand);

    const objectUrl = `${S3_BASE_URL}/${s3Key}`;
    console.log(`S3 Object URL: ${objectUrl}`);
    return NextResponse.json({ message: "File uploaded successfully", fileUrl: objectUrl, result: "success" });

  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return NextResponse.json(
      { error: "Failed to upload file to S3" },
      { status: 500 }
    );
  }
}
//==============================================================================================================================
// DELETE request to remove a document
//==============================================================================================================================

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

    let objectKey = fileKey;
    const v_cantStartWith = S3_BASE_URL + "/"
    if (fileKey.startsWith(v_cantStartWith)) {
      objectKey = fileKey.replace(v_cantStartWith, "");
    }
    console.log('ObjectKey', objectKey)

    // Delete file from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    });

    console.log(`Deleting file from S3: ${fileKey}`);
    await s3Client.send(deleteCommand);

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
// GET Images
//==============================================================================================================================

export async function GET(req: Request) {
  console.log('S3 GET has been called')
  // 1.  Extract Param
  const { searchParams } = new URL(req.url);
  const v_cdomain = searchParams.get('cdomain');  // Use lowercase as query parameters are usually lowercase.
  const v_folder = searchParams.get('folder');
  if (!v_cdomain || !v_folder) { return NextResponse.json({ error: 'AskFor and Cnd are required parameters' }, { status: 400 }); }
  const v_url = `${S3_BASE_URL}/${v_cdomain}/${v_folder}/`;
  console.log('s3 url', v_url);


  try {
    // Define the folder path
    const v_folderPrefix = `${v_cdomain}/${v_folder}/`;

    // List objects in the folder
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: v_folderPrefix,
    });
    const { Contents } = await s3Client.send(command);
    if (!Contents || Contents.length === 0) { return NextResponse.json({ images: [] }, { status: 200 }); }

    // Generate full image URLs
    const imageUrls = Contents.map((file: any) => `${S3_BASE_URL}/${file.Key}`);


    return NextResponse.json({ images: imageUrls }, { status: 200 });
  } catch (error) {
    console.error("Error fetching images from S3:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}


//==============================================================================================================================

