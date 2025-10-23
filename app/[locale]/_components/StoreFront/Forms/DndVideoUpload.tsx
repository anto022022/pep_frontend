import { ProductVideo } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AdditionalDetails";
import { useBase64FileUpload } from "@/app/[locale]/_hooks/useFileUpload";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import ButtonIcon from "../../Buttons/ButtonIcon";
import {
  CloseIcon,
  DragDropIcon,
  PlaceholderImageIcon,
  TrashIcon,
} from "../../Icons/SVGIcons";
import InputField from "./InputField";

interface DndVideoUploadProps {
  value: ProductVideo;
  onChange: (value: ProductVideo) => void;
  youtubeUrl: string;
  onYoutubeUrlChange: (value: string) => void;
  className?: string;
}

const DndVideoUpload: React.FC<DndVideoUploadProps> = ({
  value,
  onChange,
  className,
  onYoutubeUrlChange,
  youtubeUrl,
}) => {
  const t = useTranslations("common.dndVideo");
  const { uploadFiles, uploading, errors, filePaths } = useBase64FileUpload({
    maxFileSizeMB: 10,
    allowedFileTypes: ["video/mp4", "video/quicktime"],
    maxHeight: 1080,
    maxWidth: 1920,
  });
  const [isInputShow, setIsInputShow] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const modifyFilePaths = filePaths.map(({ path, alt, exten, size }) => ({
      src: path /*  */,
      alt,
      exten,
      size,
    }));
    // const modifyFilePaths = filePaths[0]?.path;
    onChange(modifyFilePaths[0]);
  }, [filePaths]);

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
  }, [errors]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const newFileArray = [fileArray[0]];
    await uploadFiles(newFileArray);
  };

  const handleDelete = () => {
    onChange({
      src: "",
      alt: "",
      exten: "",
      size: 0,
    });
    onYoutubeUrlChange("");
    setIsInputShow(false);
  };
  const handleURL = (value: string) => {
    const ytUrlRegex =
      /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/;
    const urlPattern =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    if (ytUrlRegex.test(value)) {
      const match = value.match(urlPattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
      }
    }
    return "";
  };
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      className="fileimage-upload-comp f-u-c-video"
    >
      {!value?.src && !youtubeUrl ? (
        uploading ? (
          <div className="image-previews-block">
            <div className="i-p-b-main">
              <div className="placeholder-loading-img main-img">
                <PlaceholderImageIcon />
              </div>
            </div>
          </div>
        ) : (
          <div className={`f-u-c-label ${className}`}>
            <input
              type="file"
              onChange={(e) => handleFiles(e.target.files)}
              className="f-u-c-input"
              id={"fileInputVideo"}
              accept="video/*"
              multiple={false}
            />
            <div className="f-u-c-content">
              <DragDropIcon />
              <span className="f-u-c-c-txt">{t("dragAndDrop")}</span>
              <span className="or-txt">{t("or")}</span>
              {isInputShow ? (
                <div className="video-url-block wid-80">
                  <InputField
                    value={youtubeUrl}
                    onChange={(e) => onYoutubeUrlChange(e.target.value)}
                    placeholder={t("URL")}
                  />
                  <ButtonIcon
                    className="b-c-i-outline b-c-i-grey b-c-i-rounded b-c-i-sm"
                    onClick={() => setIsInputShow(false)}
                  >
                    <CloseIcon />
                  </ButtonIcon>
                </div>
              ) : (
                <div className="btn-wrapper">
                  <label htmlFor={"fileInputVideo"} className="choose-file-btn">
                    {t("chooseFile")}
                  </label>
                  <span
                    className="choose-file-btn"
                    onClick={() => setIsInputShow(true)}
                  >
                    {t("pasteUrl")}
                  </span>
                </div>
              )}

              <span className="f-u-c-helper-txt">{t("helper")}</span>
            </div>
          </div>
        )
      ) : (
        <div className="image-previews-block">
          <div className="i-p-b-m-item single-img">
            {value?.src && (
              <video width="300" height="240" controls autoPlay loop muted>
                <source src={getImageUrl(value?.src)} />
              </video>
            )}
            {youtubeUrl && (
              <>
                <iframe
                  className="img-fluid c-c-cover-img"
                  width="300"
                  height="240"
                  frameBorder="0"
                  allow=" encrypted-media"
                  allowFullScreen
                  src={handleURL(youtubeUrl)}
                ></iframe>
              </>
            )}

            <div className="remove-img" onClick={() => handleDelete()}>
              <TrashIcon />
              <span className="r-i-txt">{t("remove")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DndVideoUpload;
