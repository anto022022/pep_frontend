import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface VariantsColorPipeProps {
  attributeKey: string;
  attributeValue: string;
  variants: any[];
  isSelected?: boolean;
  handleClick?: (key: string, value: string) => void;
}

interface imgInterface {
  alt: string;
  src: string;
}

export const VariantsColorPipe: React.FC<VariantsColorPipeProps> = ({
  attributeKey,
  attributeValue,
  variants,
  isSelected = false,
  handleClick,
}) => {
  const [colors, setColors] = useState<imgInterface>();

  useEffect(() => {
    prepareImagesArray();
  }, []);

  const prepareImagesArray = () => {
    try {
      let color: imgInterface | undefined;
      for (let i = 0; i < variants.length; i++) {
        // debugger;
        if (!variants[i]?.available) continue;
        if (!variants[i]?.attributes[attributeKey]) continue;
        if (variants[i]?.attributes[attributeKey] !== attributeValue) continue;
        if (!variants[i]?.variantImg || variants[i]?.variantImg.length === 0)
          continue;
        color = variants[i].variantImg[0];
        break;
      }
      if (color) setColors(color);
      //   return
      //   const imagePath = rowData[src];

      //   const isFullUrl = isValidImageUrl(imagePath);
      //   const normalizedPath = normalizeImagePath(imagePath);

      //   return isFullUrl
      //     ? normalizedPath
      //     : `${process.env.NEXT_PUBLIC_API_URL_AG||"https://api.sandbox.pepagora.org/"}${normalizedPath}`;
    } catch (err) { }
  };

  return (
    // <div>
    //   {/* {colors?.src ? (
    //     <div className="tabs-form-group">
    //     </div>
    //   ) : (
    //     <button className={`btn-comp`}>{attributeValue}</button>
    //   )} */}
    //   {colors?.src && (
    //     <div className="tabs-form-group">
    //       <div className="product-variants-block">
    //         <div className="p-v-item">
    //           <Tooltip target=".v-1" appendTo={"self"} />
    //           <Image
    //             src={`${process.env.NEXT_PUBLIC_API_URL_AG||"https://api.sandbox.pepagora.org/"}${colors?.src}`}
    //             width={48}
    //             height={48}
    //             sizes="50vw"
    //             alt="Variant"
    //             className="p-v-img v-1"
    //             data-pr-tooltip="Grey"
    //             data-pr-position="top"
    //           ></Image>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div
      className={`c-c-img ${isSelected ? "selected" : ""}`}
      onClick={() => handleClick && handleClick(attributeKey, attributeValue)}
    >
      <Image
        // src={`https://pepagora.s3.ap-south-1.amazonaws.com/${colors?.src ? encodeURIComponent(colors.src) : ""
        //   }`}
         src={getImageUrl(colors?.src ?? "")}
        width={48}
        height={48}
        sizes="50vw"
        alt="Variant"
        className="p-v-img v-1"
        data-pr-tooltip="Grey"
        data-pr-position="top"
      ></Image>
    </div>
  );
};
