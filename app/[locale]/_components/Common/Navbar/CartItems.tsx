import { Variant } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import Typography from "@/app/[locale]/_components/Base/Typography";
import RFQPricePipe from "@/app/[locale]/_components/Pipe/RFQPricePipe";
import {
  Currency,
  ProductPricing,
} from "@/app/[locale]/_interface/SalesProductInterface";
import React, { ReactNode } from "react";

interface CartItemsProps {
  children: ReactNode;
  selectedVariants: { _id: string; quantity: number }[];
  variants: Variant[];
  currency: Currency;
  totalOrderQuantity: number;
  offer?: ProductPricing;
  productInfoPricing?: any;
}

const CartItems: React.FC<CartItemsProps> = ({
  children,
  selectedVariants,
  variants,
  currency,
  totalOrderQuantity = 0,
  offer,
  productInfoPricing,
}) => {
  return (
    <div className="order-summary-item-comp">
      {children}
      <div className="order-summary-item-comp">
        {selectedVariants.map((v: any) => {
          const fullVariant = variants.find((variant) => v._id === variant._id);
          if (!fullVariant) return null;
          const pieces = v.quantity;
          return (
            <div
              className="order-selected-items"
              style={{ margin: "2px 0px" }}
              key={v._id}
            >
              <div className="o-s-i-left">
                <div className="size-color-badge">
                  {Object.entries(fullVariant.attributes).map(
                    ([key, value]) => (
                      <Typography
                        key={`${key}`}
                        variant="span"
                        className="s-c-b-txt"
                      >
                        {key} : {value}
                      </Typography>
                    )
                  )}
                </div>
                <Typography variant="span" className="o-s-i-price-txt">
                  <RFQPricePipe
                    currency={currency}
                    // pricing={fullVariant?.pricing}
                    pricing={productInfoPricing?.pricing}
                    totalOrderQuantity={totalOrderQuantity}
                    offer={offer}
                  />
                </Typography>
              </div>
              <div className="o-s-i-right">
                <Typography variant="span" className="o-s-i-price-txt">
                  x {pieces}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartItems;
