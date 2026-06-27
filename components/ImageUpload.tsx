"use client";

import { useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  buttonText?: string;
  acceptedFormats?: string[];
  maxSize?: number;
}

export default function ImageUpload({
  onUploadSuccess,
  folder = "uploads",
  buttonText = "Upload Image",
  acceptedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  maxSize = 5 * 1024 * 1024, // 5MB
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSuccess = (result: any) => {
    if (result?.info?.secure_url) {
      const url = result.info.secure_url;
      setPreview(url);
      onUploadSuccess(url);
      setUploading(false);
      setError(null);
    }
  };

  const handleUploadAdded = () => {
    setUploading(true);
    setError(null);
  };

  const handleError = (error: any) => {
    console.error("Upload error:", error);
    setError("Failed to upload image. Please try again.");
    setUploading(false);
  };

  return (
    <div className="w-full">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        config={{
          cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          },
        }}
        options={{
          folder,
          maxFiles: 1,
          maxFileSize: maxSize,
          cropping: false,
          sources: ["local"],
          multiple: false,
        }}
        onSuccess={handleSuccess}
        onUploadAdded={handleUploadAdded}
        onError={handleError}
      >
        {({ open }) => (
          <>
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={() => open()}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => {
                      setPreview(null);
                      onUploadSuccess("");
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => open()}
                disabled={uploading}
                className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center gap-2">
                  {uploading ? (
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {uploading ? "Uploading..." : buttonText}
                  </span>
                  <span className="text-xs text-gray-400">
                    Max size: {maxSize / 1024 / 1024}MB
                  </span>
                </div>
              </button>
            )}
          </>
        )}
      </CldUploadWidget>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
