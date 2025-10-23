'use client'
import { AttachIcon } from '@/app/[locale]/_components/Icons/SVGIcons'
import React from 'react'

const AttachInput:React.FC = () => {
    
    return (
        <label htmlFor="attachFiles" className='attachFile-input'>
            <input type="file" id='attachFiles' accept="image/*,application/pdf" />
            <AttachIcon />
        </label>
    )
}

export default AttachInput
