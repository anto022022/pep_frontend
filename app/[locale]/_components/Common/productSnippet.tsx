import Image from 'next/image';
import React from 'react';
import Typography from '../Base/Typography';

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
  companyName,
  image,
  name,
  minOrder,
  deliveryDate,
}) => {
  return (
    <div className="product-snippet-comp">
      <div className="p-s-c-left">
        <div className="p-s-c-img">
          <Image
            src={image}
            alt={name}
            sizes="100vw"
            width={70}
            height={70}
          />
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
                <Typography
                  className="stock-status in-stock"
                  variant="span"
                >
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
            {isCompanyName && companyName && (
              <Typography className="company-name-grey" variant="span">
                {companyName}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSnippet;
