"use client";
import {
  TrashIcon,
  UploadIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import {
  UploadedFile,
  useBase64FileUpload,
} from "@/app/[locale]/_hooks/useFileUpload";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface UploadCardProps {
  onChange: (file: UploadedFile | null) => void;
  value?: UploadedFile | null;
}

const UploadCard: React.FC<UploadCardProps> = ({ onChange, value }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(""); // show preview if value exists
  const ps = useTranslations("profileSettings");
  const { uploadFiles, uploading, errors } = useBase64FileUpload({
    maxFileSizeMB: 5,
  });

  useEffect(() => {
    if (localFile && localFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(localFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview("");
    }
  }, [localFile]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setLocalFile(file);

    const uploaded = await uploadFiles([file]);
    if (uploaded?.length) {
      const fileWithSrc = {
        ...uploaded[0],
        src: uploaded[0].path,
      };
      onChange(fileWithSrc);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalFile(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (value?.path && !localFile) {
      const sanitized = value.path;
      const url = getImageUrl(sanitized);
      setPreview(url);
    } else if (!localFile) {
      setPreview("");
    }
  }, [value?.path, localFile]);

  return (
    <div
      className="upload-card"
      onClick={() => !localFile && fileInputRef.current?.click()}
    >
      {!localFile && !value?.path ? (
        <>
          <UploadIcon size={28} color="#374151" />
          <p>
            {uploading
              ? ps("profileSettings.fieldsAddress.Uploading")
              : ps("profileSettings.fieldsAddress.UploadProfilePic")}
          </p>
          {errors.length > 0 && (
            <p className="text-xs text-red-500">{errors[0]}</p>
          )}
        </>
      ) : preview ? (
        <div className="preview-container">
          <Image
            src={preview || ""} // never pass undefined
            alt={value?.alt || "preview"}
            width={120}
            height={120}
          />{" "}
          <button type="button" className="remove-btn" onClick={handleRemove}>
            <TrashIcon />
          </button>
        </div>
      ) : (
        <>
          <UploadIcon size={28} color="#374151" />
          <p>
            {uploading
              ? ps("profileSettings.fieldsAddress.Uploading")
              : ps("profileSettings.fieldsAddress.UploadProfilePic")}
          </p>
          {errors.length > 0 && (
            <p className="text-xs text-red-500">{errors[0]}</p>
          )}
        </>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadCard;
