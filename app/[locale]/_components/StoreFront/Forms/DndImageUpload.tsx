import { UploadedImage } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/ProductInformation";
import { useBase64FileUpload } from "@/app/[locale]/_hooks/useFileUpload";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  AddImageIcon,
  BrochureIcon,
  CloseIcon,
  DragDropIcon,
  EditIcon,
  PlaceholderImageIcon,
  TrashIcon,
} from "../../Icons/SVGIcons";
// import { Controller } from "react-hook-form";
import CommonInputDialog from "@/app/[locale]/_components/OverLay/CommonInputDialog";

const mimeToLabel: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/jpg": "JPG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "application/pdf": "PDF",
  // Add more as needed
};

interface DndImageUploadProps {
  value: UploadedImage[] | UploadedImage;
  onChange: (files: UploadedImage[] | string) => void;
  single?: boolean;
  maxUpload?: number;
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
  maxHeight?: number;
  maxWidth?: number;
  className?: string;
  placeHolder?: string;
  from?: string;
  isShowEditBtn?: boolean;
}

const DndImageUpload: React.FC<DndImageUploadProps> = ({
  value,
  onChange,
  single = false,
  maxUpload = 5,
  maxFileSizeMB = 5,
  allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  // maxHeight = 500,
  // maxWidth = 500,
  maxHeight = Infinity,
  maxWidth = Infinity,
  className,
  placeHolder,
  isShowEditBtn = true,
}) => {
  const { uploadFiles, uploading, errors, filePaths } = useBase64FileUpload({
    maxFileSizeMB,
    allowedFileTypes,
    maxHeight,
    maxWidth,
  });
  const dispatch = useAppDispatch();
  const t = useTranslations("common");

  const [uploadingFileCount, setUploadingFileCount] = useState(0);
  const [editingAltIndex, setEditingAltIndex] = useState<number | null>(null);

  const allowedExtensions = allowedFileTypes
    .map(
      (type) => mimeToLabel[type] || type.split("/")[1]?.toUpperCase() || type
    )
    .join(", ");

  const isOnlyImages = allowedFileTypes.every((type) =>
    type.startsWith("image/")
  );

  let translationKey = "";
  let interpolation: Record<string, any> = {};

  if (single && isOnlyImages) {
    translationKey = "dndPlaceholder.single";
    interpolation = {
      types: allowedExtensions,
      size: maxFileSizeMB.toString(),
    };
  } else if (single && !isOnlyImages) {
    translationKey = "dndPlaceholder.singleNoDimension";
    interpolation = {
      types: allowedExtensions,
      size: maxFileSizeMB.toString(),
    };
  } else if (!single && isOnlyImages) {
    translationKey = "dndPlaceholder.multiple";
    interpolation = {
      maxUpload,
      types: allowedExtensions,
      size: maxFileSizeMB.toString(),
    };
  } else {
    translationKey = "dndPlaceholder.multipleNoDimension";
    interpolation = {
      maxUpload,
      types: allowedExtensions,
      size: maxFileSizeMB.toString(),
    };
  }

  const dynamicPlaceholder = placeHolder || t(translationKey, interpolation);

  useEffect(() => {
    if (filePaths.length === 0) return;

    const modifyFilePaths = filePaths.map(({ path, alt, exten, size }) => ({
      src: path,
      alt: alt,
      exten: exten,
      size: size,
    }));

    if (single) {
      onChange(modifyFilePaths);
    } else {
      if (
        (value as UploadedImage[])?.length + modifyFilePaths.length <=
        maxUpload
      ) {
        onChange([...(value as UploadedImage[]), ...modifyFilePaths]);
      } else {
        dispatch(
          showToast({
            title: "Error!",
            message: `Only ${maxUpload} files can be uploaded`,
            theme: "error",
          })
        );
      }
    }

    setUploadingFileCount(0);
  }, [filePaths]);

  // useEffect(() => {
  //   console.log({ editingAltIndex });
  // }, [editingAltIndex]);

  // useEffect(() => {
  //   console.log({ value });
  // }, [value]);

  useEffect(() => {
    if (!errors || errors.length === 0) return;
    errors.forEach((error) =>
      dispatch(
        showToast({
          title: "Error!",
          message: error,
          theme: "error",
        })
      )
    );
    setUploadingFileCount(0);
  }, [errors]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);

    const totalFiles =
      (Array.isArray(value) ? value.length : 0) + fileArray.length;
    if (fileArray.length > maxUpload || totalFiles > maxUpload) {
      dispatch(
        showToast({
          title: "Error!",
          message: `Only ${maxUpload} files can be uploaded`,
          theme: "error",
        })
      );
      return;
    }
    setUploadingFileCount(fileArray.length);
    await uploadFiles(fileArray);
  };

  const handleDelete = (imageToDelete: number | string) => {
    if (typeof value === "string") {
      // If only a single image is uploaded, clear the value
      onChange("");
    } else if (Array.isArray(value)) {
      if (typeof imageToDelete === "number") {
        const updatedImages = value.filter(
          (_, index) => index !== imageToDelete
        );
        onChange(updatedImages);
      }
    } else if (value && typeof value === "object") {
      onChange([{ src: "", alt: "", exten: "", size: 0 }]);
    }
  };

  const handleAltEditCancel = () => {
    setEditingAltIndex(null);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        // if (Array.isArray(value) ? value.length < maxUpload : !value)
        handleFiles(e.dataTransfer.files);
      }}
      className="fileimage-upload-comp"
    >
      {(Array.isArray(value) && value.length === 0) ||
        (!Array.isArray(value) && !value?.src) ? (
        uploading ? (
          uploadingFileCount > 0 && (
            <div className="image-previews-block">
              <div className="i-p-b-main">
                <div className="placeholder-loading-img main-img">
                  <PlaceholderImageIcon />
                </div>
              </div>
              <div className="i-p-b-subimages">
                {Array.from({ length: uploadingFileCount }).map((_, index) => {
                  if (index !== 0) {
                    return (
                      <div className="placeholder-loading-img" key={index}>
                        <PlaceholderImageIcon />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )
        ) : (
          <label className={`f-u-c-label ${className}`}>
            <input
              type="file"
              multiple={!single}
              onChange={(e) => handleFiles(e.target.files)}
              className="f-u-c-input"
              id={"fileInput"}
            />
            <div className="f-u-c-content">
              <DragDropIcon />
              <span className="f-u-c-c-txt">{t("dragAndDrop")}</span>
              <span className="or-txt"> {t("or")}</span>
              <span className="choose-file-btn"> {t("chooseFile")}</span>
              <span className="f-u-c-helper-txt">
                {dynamicPlaceholder
                  ? dynamicPlaceholder
                  : `Upload JPG, JPEG, PNG (Max 5MB) for best quality.`}
              </span>
            </div>
          </label>
        )
      ) : (
        <div className="image-previews-block">
          {single && value ? (
            <div className="i-p-b-main">
              {(() => {
                let file: UploadedImage | undefined;

                if (Array.isArray(value)) {
                  file = value[0]; // safely get the first item
                } else {
                  file = value; // it's already an UploadedImage
                }

                if (!file?.src) return null;

                const isPDF = file.src.toLowerCase().endsWith(".pdf");

                return (
                  <div className="i-p-b-m-item single-img">
                    {isPDF ? (
                      <div className="brochure-document-block-wrapper">
                        <a
                          href={getImageUrl(file.src)}
                          className="brochure-document-block"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <BrochureIcon />
                          <span className="b-d-b-filename">{file.alt}</span>
                        </a>
                        <CloseIcon
                          className="cursor-pointer"
                          onClick={() => handleDelete(file!.src)}
                        />
                      </div>
                    ) : (
                      <>
                        <Image
                          src={getImageUrl(file.src)}
                          width={300}
                          height={240}
                          sizes="100vw"
                          alt={file.alt || "image"}
                          priority
                        />
                        <div className="remove-img action-btn-img">
                          <TrashIcon
                            onClick={() =>
                              handleDelete(Array.isArray(value) ? 0 : value.src)
                            }
                          />
                          {isShowEditBtn && (
                            <EditIcon
                              onClick={() => {
                                setEditingAltIndex(0);
                              }}
                            />
                          )}
                        </div>
                      </>
                    )}
                    {editingAltIndex === 0 && (
                      <div className="alt-edit-section">
                        <CommonInputDialog
                          title={t("title")}
                          placeholderText={t("placeholder")}
                          cancelBtnText={t("cancel")}
                          submitBtnText={t("save")}
                          value={file.alt || ""}
                          handleCancel={handleAltEditCancel}
                          handleSubmit={(values: any) => {
                            const newImages = Array.isArray(value)
                              ? [...value]
                              : [value];
                            newImages[0].alt = values;
                            onChange(newImages);
                            setEditingAltIndex(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            Array.isArray(value) && (
              <>
                <div className="i-p-b-main">
                  <div className="i-p-b-m-item single-img">
                    <Image
                      src={getImageUrl(value[0].src)}
                      width={300}
                      height={240}
                      sizes="100vw"
                      alt={value[0].alt}
                      priority
                    />
                    <div className="remove-img action-btn-img">
                      <TrashIcon onClick={() => handleDelete(0)} />
                      <EditIcon
                        onClick={() => {
                          setEditingAltIndex(0);
                        }}
                      />
                    </div>
                  </div>
                  <div className="alt-edit-section">
                    {editingAltIndex === 0 && (
                      <>
                        <div className="video-url-block wid-80">
                          <CommonInputDialog
                            title={t("title")}
                            placeholderText={t("placeholder")}
                            cancelBtnText={t("cancel")}
                            submitBtnText={t("save")}
                            value={value[0].alt || ""}
                            handleCancel={handleAltEditCancel}
                            handleSubmit={(values: any) => {
                              const newImages = [...value];
                              newImages[0].alt = values;
                              onChange(newImages);
                              setEditingAltIndex(null);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>{" "}
                <div className="i-p-b-subimages">
                  {value.length > 1 &&
                    value.map((img, index) => {
                      if (index !== 0) {
                        return (
                          <div className="i-p-b-s-item" key={index}>
                            <Image
                              src={getImageUrl(img.src)}
                              width={300}
                              height={240}
                              sizes="100vw"
                              alt={img?.alt}
                              priority
                            />
                            <div className="remove-img action-btn-img">
                              <TrashIcon onClick={() => handleDelete(index)} />
                              {isShowEditBtn && (
                                <EditIcon
                                  onClick={() => setEditingAltIndex(index)}
                                />
                              )}
                            </div>
                            {editingAltIndex === index && (
                              <div className="alt-edit-section">
                                <CommonInputDialog
                                  title={t("title")}
                                  placeholderText={t("placeholder")}
                                  cancelBtnText={t("cancel")}
                                  submitBtnText={t("save")}
                                  value={value[index].alt || ""}
                                  handleCancel={handleAltEditCancel}
                                  handleSubmit={(values: any) => {
                                    const newImages = [...value];
                                    newImages[index].alt = values;
                                    onChange(newImages);
                                    setEditingAltIndex(null);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      }
                    })}
                  {uploadingFileCount > 0 &&
                    Array.from({ length: uploadingFileCount }).map(
                      (_, index) => (
                        <div className="placeholder-loading-img" key={index}>
                          <PlaceholderImageIcon />
                        </div>
                      )
                    )}
                  {uploadingFileCount === 0 &&
                    (Array.isArray(value)
                      ? value.length < maxUpload
                      : !value) && (
                      <label
                        htmlFor="addImageSmall"
                        className="add-image-small"
                      >
                        <AddImageIcon />
                        <span className="a-i-s-txt">
                          {allowedFileTypes.includes("application/pdf") &&
                            "Add PDF Files "}
                          {allowedFileTypes.some((type) =>
                            type.startsWith("image/")
                          ) && "Add Images"}
                        </span>

                        <input
                          type="file"
                          multiple={!single}
                          id={"addImageSmall"}
                          className="a-i-input"
                          onChange={(e) => handleFiles(e.target.files)}
                        />
                      </label>
                    )}
                </div>
                `
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DndImageUpload;
