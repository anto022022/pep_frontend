import React from 'react'
import { PlaceholderImageIcon } from '../Icons/SVGIcons'
import Typography from '../Base/Typography'

const PlaceholderGallerySlider = () => {
    return (
        <>
            <div className='placeholder-thumbs-slider'>
                <div className='p-t-s-img p-t-s-main'>
                    <PlaceholderImageIcon />
                    <Typography variant='span' className='preview-txt'>Main Thumbnail</Typography>
                </div>
                <div className='p-t-s-sub-image'>
                    <div className='p-t-s-img p-t-s-s-i-img'>
                        <PlaceholderImageIcon />
                    </div>
                    <div className='p-t-s-img p-t-s-s-i-img'>
                        <PlaceholderImageIcon />
                    </div>
                    <div className='p-t-s-img p-t-s-s-i-img'>
                        <PlaceholderImageIcon />
                    </div>
                    <div className='p-t-s-img p-t-s-s-i-img'>
                        <PlaceholderImageIcon />
                    </div>
                    <div className='p-t-s-img p-t-s-s-i-img'>
                        <PlaceholderImageIcon />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlaceholderGallerySlider