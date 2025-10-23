"use client";
import { useState } from "react";
import { useUploadImageFileMutation } from "../_store/apiReducer/fileUploadApi";

export interface UploadedFile {
  path: string;
  alt: string;
  exten: string;
  size: number;
}

interface UploadResponse {
  message: string;
  result: UploadedFile[];
}

interface UseBase64FileUploadOptions {
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
  minFileSizeMB?: number;
}

export function useBase64FileUpload({
  maxFileSizeMB = 5,
  minFileSizeMB = 0,
  allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "video/mp4",
    "video/webm",
    "application/pdf",
  ],
  maxWidth,
  maxHeight,
}: UseBase64FileUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [filePaths, setFilePaths] = useState<UploadedFile[]>([]);

  const [uploadImageFile] = useUploadImageFileMutation();

  /**
   * Validate file dimensions (images and videos)
   */
  const validateFileDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          if (
            (maxWidth && img.width > maxWidth) ||
            (maxHeight && img.height > maxHeight)
          ) {
            resolve(false);
          } else {
            resolve(true);
          }
        };
        img.src = URL.createObjectURL(file);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.onloadedmetadata = () => {
          if (
            (maxWidth && video.videoWidth > maxWidth) ||
            (maxHeight && video.videoHeight > maxHeight)
          ) {
            resolve(false);
          } else {
            resolve(true);
          }
        };
        video.src = URL.createObjectURL(file);
      } else {
        resolve(true);
      }
    });
  };

  /**
   * Convert the provided File objects to base64 and upload them to the server.
   * @param selectedFiles The array of File objects from an <input type="file" multiple />.
   */
  async function uploadFiles(
    selectedFiles: File[]
  ): Promise<UploadedFile[] | null> {
    if (!selectedFiles || selectedFiles.length === 0) return null;

    setUploading(true);
    setErrors([]);

    const validFiles: File[] = [];
    const newErrors: string[] = [];

    // Validate files
    for (const file of selectedFiles) {
      if (!allowedFileTypes.includes(file.type)) {
        newErrors.push(`File type ${file.type} not allowed : ${file.name}`);
      } else if (file.size > maxFileSizeMB * 1024 * 1024) {
        newErrors.push(`File size exceeds ${maxFileSizeMB}MB: ${file.name}`);
      } else if (file.size < minFileSizeMB * 1024 * 1024) {
        newErrors.push(`File size less than ${minFileSizeMB}MB: ${file.name}`);
      } else {
        const isValid = await validateFileDimensions(file);
        if (!isValid) {
          newErrors.push(`File dimensions exceed limits: ${file.name}`);
        } else {
          validFiles.push(file);
        }
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validFiles.length === 0) {
      setUploading(false);
      return null;
    }

    try {
      const formData = new FormData();

      validFiles.forEach((file) => {
        formData.append("files", file); // "files" should match the API key
      });

      try {
        const response: UploadResponse = await uploadImageFile(
          formData
        ).unwrap();
        const paths = response.result;
        setFilePaths(paths);
        setUploading(false);
        return paths;
      } catch (e) {
        throw new Error(`Upload failed`);
      }
    } catch (err: any) {
      console.error("Error uploading files:", err);
      setErrors([err.message || "Unknown error"]);
      setUploading(false);
      return null;
    }
  }

  return {
    uploadFiles,
    uploading,
    errors,
    filePaths,
  };
}
