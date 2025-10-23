import Typography from '@/app/[locale]/_components/Base/Typography';
import { ProductDetailPageProps } from '@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage';
import React from 'react';

import { BrochureIcon } from '@/app/[locale]/_components/Icons/SVGIcons';
import { getImageUrl } from '@/app/[locale]/_hooks/utility';
import Link from "next/link";

const CertificationsTab: React.FC<ProductDetailPageProps> = ({ productData }) => {
  const certificates = productData?.certificates || [];

  return (
    <div className='tabs-content spec-tab algn-start'>
      <div className='certification-block'>
        {certificates.length > 0 ? (
          certificates.map(
            (item, index) =>
              item?.src && (
                <div className="tabs-form-group" key={index}>
                  
                  <Link
                    href={getImageUrl(item.src)}
                    className="brochure-document-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="b-d-b-left">
                      <BrochureIcon />
                      <span className="b-d-b-filename">
                        {item.name}
                      </span>
                    </div>
                    <div className="b-d-b-right">
                      <span className="b-d-b-size">  {item?.size !== undefined ? (item.size / (1024 * 1024)).toFixed(2) + " MB" : ""}

                      </span>
                    </div>
                  </Link>
                  <label htmlFor="Shipping & Packaging" className="t-f-g-label">
                    {item?.name}
                  </label>
                </div>
              )
        )
        ) : (
          <Typography variant='p' className='text-gray-500'>No certificates available.</Typography>
        )}
      </div>
    </div>
  );
};


export default CertificationsTab