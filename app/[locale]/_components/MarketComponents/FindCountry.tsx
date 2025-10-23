import React from 'react'
import Typography from '../Base/Typography'
import Image from 'next/image'
import Link from 'next/link'

interface FindCountryProps {
  image: string;      // URL or path to the image
  name: string;       // Country name
  path: string;       // Link to the country-specific page
}

const FindCountry: React.FC<FindCountryProps> = ({ image, name, path }) => {
  return (
    <Link href={path} className='find-country-comp'>
      <div className='f-i-c-img'>
        <Image src={image} alt={name} width={30} height={20} sizes='100vw' />
      </div>
      <Typography className='f-c-c-txt' variant='h5'>
        {name}
      </Typography>
    </Link>
  )
}

export default FindCountry
