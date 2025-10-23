import { Skeleton } from 'primereact/skeleton'
import React from 'react'
import { PlaceholderImageIcon } from '../Icons/SVGIcons'

const SkeletonProductCard: React.FC = () => {
  return (
    <div className='skel-product-card product-listing-card-comp'>
      <div className='p-l-c-c-slides'>
        <Skeleton width="100%" height='250px' />
        <div className='placeholder-icon'>
          <PlaceholderImageIcon />
        </div>
      </div>
      <div className='p-l-c-c-details'>
        <div className='p-l-c-c-d-top'>
          <Skeleton width="220px" height='20px' />
          <div className='product-card-info'>
            <Skeleton width="140px" height='21px' />
            <Skeleton width="100px" height='15px' />
            <Skeleton width="180px" height='15px' />
          </div>
        </div>
        <div className='p-l-c-c-d-bottom-wrapper floating-bottom-wrapper'>
          <div className='p-l-c-c-d-bottom'>
            <Skeleton width="150px" height='18px' />
            <div className='company-meta-badge'>
              <div className='c-m-b-item'>
                <Skeleton width="50px" height='16px' />
              </div>
              <div className='c-m-b-item'>
                <Skeleton width="30px" height='16px' />
              </div>
              <div className='c-m-b-item'>
                <Skeleton width="30px" height='16px' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductCard