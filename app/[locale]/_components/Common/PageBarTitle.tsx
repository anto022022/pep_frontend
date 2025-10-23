'use client'
import Image from 'next/image'
import React from 'react'
import Typography from '../Base/Typography'
interface PageBarProps{
    name:string;
    image:string;
}

const PageBarTitle:React.FC<PageBarProps> = ({
    name,
    image
}) => {
    return (
        <div className='page-title-bar'>
            <div className='p-t-b-left'>
                <Typography className='p-t-b-title'>{name}</Typography>
            </div>
            <div className='p-t-b-right'>
                <div className='p-t-b-img abs'>
                    <Image src={image} alt='Image' width={140} height={120}></Image>
                </div>
            </div>
        </div>
    )
}

export default PageBarTitle