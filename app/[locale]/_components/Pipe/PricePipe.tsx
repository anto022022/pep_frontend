import React from "react";
import { ProductPricing } from "../../_interface/SalesProductInterface";
import { PricingType } from "../../_models/StoreFront";

interface PricePipeProps {
  pricing?: ProductPricing;
  currency: string;
  unit?: string;
}

export const PricePipe: React.FC<PricePipeProps> = ({
  pricing,
  currency,
  unit,
}) => {
  {
    const formatPrice = (value: number, isIndia: boolean): string => {
      if (isIndia) {
        if (value >= 1e5) {
          // Lakhs format
          return ` ${(value / 1e5).toFixed(2)} Lakh`;
        } else {
          return ` ${value.toLocaleString("en-IN")}`;
        }
      } else {
        if (value >= 1e6) {
          // Millions format
          return ` ${(value / 1e6).toFixed(2)} Million`;
        } else {
          return ` ${value.toLocaleString("en-US")}`;
        }
      }
    };

    if (!pricing) {
      return <div>-</div>;
    }

    switch (pricing.pricingType) {
      case PricingType.FIXED:
        return (
          <div>
            {currency} {formatPrice(pricing.unitPrice, currency === "₹")} / per{" "}
            {unit ? unit : "Unit"}
          </div>
        );

      case PricingType.PRICE_RANGE:
        return (
          <div>
            {currency} {formatPrice(pricing.minPrice, currency === "₹")} -{" "}
            {currency} {formatPrice(pricing.maxPrice, currency === "₹")} / per{" "}
            {unit ? unit : "Unit"}
          </div>
        );
      case PricingType.BULK: {
        const { bulkPrices } = pricing;

        return (
          // <div>
          //   <ul style={{ marginTop: 4, paddingLeft: 0, listStyle: "none" }}>
          //     {visiblePrices.map((bulk, index) => (
          //       <li
          //         key={index}
          //         style={{
          //           display: "flex",
          //           justifyContent: "space-between",
          //           alignItems: "center",
          //           paddingRight: 4,
          //           gap: "15px",
          //         }}
          //       >
          //         <span>
          //           {bulk.minQty} - {bulk.maxQty} {unit}: {currency}{" "}
          //           {bulk.price}
          //         </span>
          //         {index === 0 && bulkPrices.length > 1 && (
          //           <span
          //             className="material-symbols-rounded"
          //             onClick={() => setExpanded(!expanded)}
          //             style={{
          //               color: "#94979b",
          //               fontWeight: "300",
          //               cursor: "pointer",
          //               fontSize: "25px",
          //             }}
          //           >
          //             {expanded ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          //           </span>
          //         )}
          //       </li>
          //     ))}
          //   </ul>
          // </div>
          <div>
            {bulkPrices.length === 1
              ? `${currency} ${bulkPrices[0].price}`
              : `${currency} ${
                  bulkPrices[bulkPrices.length - 1].price
                } - ${currency} ${bulkPrices[0].price}`}
          </div>
        );
      }

      case PricingType.NEGOTIABLE:
        return <div>Negotiable</div>;

      case PricingType.REQUEST_QUOTE:
        return <div>Request Quote</div>;

      default:
        return <div>NA</div>;
    }
  }
};
