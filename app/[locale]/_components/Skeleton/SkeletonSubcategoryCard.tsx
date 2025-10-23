import { Skeleton } from 'primereact/skeleton'
import React from 'react'
import { PlaceholderImageIcon } from '../Icons/SVGIcons'

const SkeletonSubcategoryCard: React.FC = () => {
  return (
    <div className='skel-sub-category sub-category-comp'>
      <div className='s-c-c-header'>
        <Skeleton width="120px" height='16px' className='s-c-c-title' />
        <Skeleton width="20px" height='20px' className='show-more-icon' />
      </div>
      <div className='s-c-c-body'>
        <div className='s-c-c-b-left stats-card'>
          <div className="stat-item">
            <Skeleton width="70px" height='13px' />
            <Skeleton width="45px" height='15px' />
          </div>
          <div className="stat-item">
            <Skeleton width="120px" height='13px' />
            <Skeleton width="30px" height='15px' />
          </div>
          <div className="stat-item">
            <Skeleton width="90px" height='13px' />
            <Skeleton width="70px" height='15px' />
          </div>
        </div>
        <div className='s-c-c-b-right s-c-c-b-img'>
          <Skeleton width="110px" height='124px' />
          <div className='placeholder-icon'>
            <PlaceholderImageIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonSubcategoryCard