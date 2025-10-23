import React, { ReactNode } from "react";
import Typography from "../Base/Typography";

interface OrderSummaryItemProps {
  children: ReactNode;
  size: string;
  color: string;
  price: string;
  pieces: string | number;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({
  children,
  size,
  color,
  price,
  pieces,
}) => {
  return (
    <div className="order-summary-item-comp">
      {children}
      <div className="order-selected-group">
        <div className="order-selected-items">
          <div className="o-s-i-left">
            <div className="size-color-badge">
              Size: {size} &nbsp; Colour: {color}
            </div>
            <Typography variant="span" className="o-s-i-price-txt">
              {price}
            </Typography>
          </div>
          <div className="o-s-i-right">
            <Typography variant="span" className="o-s-i-price-txt">
              x {pieces} pcs
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryItem;
