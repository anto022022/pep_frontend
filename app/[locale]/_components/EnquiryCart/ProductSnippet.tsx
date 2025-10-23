import Image from "next/image";
import React, { useState } from "react";
import Typography from "../Base/Typography";
import QuantityInput from "@/app/[locale]/_components/Common/QuantityInput";

interface ProductSnippetProps {
  isProductInfo?: boolean;
  isCompanyName?: boolean;
  companyName?: string;
  image: string;
  name: string;
  minOrder?: string | number;
  deliveryDate?: string;
}

const ProductSnippet: React.FC<ProductSnippetProps> = ({
  isProductInfo = true,
  isCompanyName = false,
  companyName = "",
  image,
  name,
  minOrder,
  deliveryDate,
}) => {
  const [quantity, setQuantity] = useState<number>(0);

  return (
    <div className="product-snippet-comp">
      <div className="p-s-c-left">
        <div className="p-s-c-img">
          <Image src={image} alt={name} sizes="100vw" width={70} height={70} />
        </div>
      </div>
      <div className="p-s-c-right">
        <div className="p-s-c-info-block">
          <Typography variant="span" className="p-s-c-i-b-name">
            {name}
          </Typography>
          <div className="stock-order-wrap">
            {isProductInfo && (
              <>
                <Typography className="stock-status in-stock" variant="span">
                  Instock
                </Typography>
                <Typography className="min-order-txt" variant="span">
                  Min. order: {minOrder} pieces
                </Typography>
                <Typography className="min-order-txt" variant="span">
                  Expected Delivery by {deliveryDate}
                </Typography>
              </>
            )}
            {isCompanyName && (
              <Typography className="company-name-grey" variant="span">
                {companyName}
              </Typography>
            )}
          </div>
        </div>
        <div className="price-quantity-block">
          <div className="s-s-c-i-price-quantity">
            <Typography variant="span" className="s-s-c-i-price">
              $0.39 - $12.25
            </Typography>
            <QuantityInput
              quantity={quantity}
              onChange={(val) => setQuantity(val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSnippet;
