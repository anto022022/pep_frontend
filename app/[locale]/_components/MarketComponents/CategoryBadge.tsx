import Link from 'next/link'
import React, { ReactNode } from 'react'
import Typography from '../Base/Typography'

interface CategoryBadgeProps {
  icon: ReactNode
  path: string
  name: string
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ icon, path, name }) => {
  return (
    <Link href={path} className='category-badge-comp'>
      <div className='c-b-c-icon'>
        {icon}
      </div>
      <Typography className='c-c-c-txt' variant='h4'>{name}</Typography>
    </Link>
  )
}

export default CategoryBadge
