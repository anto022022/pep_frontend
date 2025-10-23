'use client'
import React from 'react'
import { AttachIcon } from '../Icons/SVGIcons'

interface AttachmentProps {
  onFileSelect?: (files: File[]) => void;
}

const Attachment = ({ onFileSelect }: AttachmentProps) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && onFileSelect) {
            const fileArray = Array.from(files);
            onFileSelect(fileArray);
        }
    };

    return (
        <label htmlFor="attachFiles" className='attachFile-input'>
            <input 
                type="file" 
                id='attachFiles' 
                multiple
                onChange={handleFileChange}
            />
            <AttachIcon />
        </label>
    )
}

export default Attachment
