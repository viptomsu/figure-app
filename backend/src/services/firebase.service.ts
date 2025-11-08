import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { Bucket, File } from "@google-cloud/storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type guard function for error handling
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Helper function to infer content type from filename
function inferContentType(fileName: string): string | null {
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon'
  };
  return mimeTypes[ext] || null;
}

let bucket: Bucket | null;
try {
  const require = createRequire(import.meta.url);
  const serviceAccount: admin.ServiceAccount = require(path.join(
    __dirname,
    "../config/firebase/serviceAccountKey.json"
  ));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "shop-a080e.appspot.com",
  });

  bucket = admin.storage().bucket();
  console.log("Firebase initialized successfully");
} catch (error: unknown) {
  const errorMessage = isError(error) ? error.message : "Unknown error";
  console.warn("Firebase not properly configured:", errorMessage);
  console.warn("Using mock Firebase storage");
  bucket = null;
}

// Upload image function
export const uploadImageToFirebase = async (
  fileBuffer: Buffer,
  fileName: string,
  compress: boolean = false,
  contentType?: string
): Promise<string> => {
  try {
    if (!bucket) {
      console.warn("Firebase storage not available, returning mock URL");
      return `https://mock-firebasestorage.googleapis.com/images/${uuidv4()}-${fileName}`;
    }

    let bufferToUpload: Buffer = fileBuffer;
    let finalContentType: string;

    if (!Buffer.isBuffer(bufferToUpload)) {
      throw new TypeError("The fileBuffer argument must be of type Buffer.");
    }

    if (compress) {
      bufferToUpload = await sharp(fileBuffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();
      finalContentType = "image/jpeg";
    } else {
      // Use provided content type or infer from filename
      finalContentType = contentType || inferContentType(fileName) || "application/octet-stream";
    }

    const remoteFileName: string = `images/${uuidv4()}-${fileName}`;
    const downloadToken: string = uuidv4();
    const file: File = bucket.file(remoteFileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: finalContentType,
        firebaseStorageDownloadTokens: downloadToken,
      },
    });

    return new Promise<string>((resolve, reject) => {
      stream.on("error", (error: Error) => {
        console.error("Error uploading image:", error);
        reject(error);
      });

      stream.on("finish", () => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(remoteFileName)}?alt=media&token=${downloadToken}`;
        console.log("Uploaded image URL:", imageUrl);
        resolve(imageUrl);
      });

      stream.end(bufferToUpload);
    });
  } catch (error: unknown) {
    const errorMessage = isError(error) ? error.message : "Unknown error";
    console.error("Error during image upload:", errorMessage);
    throw error;
  }
};

export const uploadFileToFirebase = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  try {
    if (!bucket) {
      console.warn("Firebase storage not available, returning mock URL");
      return `https://mock-firebasestorage.googleapis.com/cv/${uuidv4()}-${fileName}`;
    }

    const remoteFileName: string = `cv/${uuidv4()}-${fileName}`;
    const downloadToken: string = uuidv4();
    const file: File = bucket.file(remoteFileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: contentType,
        firebaseStorageDownloadTokens: downloadToken,
      },
    });

    return new Promise<string>((resolve, reject) => {
      stream.on("error", (error: Error) => {
        console.error("Error uploading file:", error);
        reject(error);
      });

      stream.on("finish", () => {
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(remoteFileName)}?alt=media&token=${downloadToken}`;
        console.log("Uploaded file URL:", fileUrl);
        resolve(fileUrl);
      });

      stream.end(fileBuffer);
    });
  } catch (error: unknown) {
    const errorMessage = isError(error) ? error.message : "Unknown error";
    console.error("Error during file upload:", errorMessage);
    throw error;
  }
};