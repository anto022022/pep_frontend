import Image from "next/image";
import React from "react";
import Typography from "@/app/[locale]/_components/Base/Typography";
import {  ProductListInterface } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";

interface CartSnippetProps {
  productInfo: ProductListInterface;
  businessName:string;
}

const CartSnippet: React.FC<CartSnippetProps> = ({
  productInfo,
  businessName
}) => {
  return (
    <div className="product-snippet-comp" >
      <div className="p-s-c-left">
        <div className="p-s-c-img">
          <Image
            src={getImageUrl(productInfo?.productImage[0].src)}
            alt={productInfo?.productName}
            sizes="100vw"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="p-s-c-right">
        <div className="p-s-c-info-block">
          <Typography variant="span" className="p-s-c-i-b-name">
            {productInfo?.productName}
          </Typography>
          <div className="stock-order-wrap">
            <Typography className="company-name-grey" variant="span">
              {businessName ?? "Company Name"}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSnippet;
