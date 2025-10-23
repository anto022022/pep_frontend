'use client'
import React, { useState } from 'react'

const SizesButton = ({ data, defaultActive }) => {

    const [active, setActive] = useState(defaultActive);

    const handleSizes = (size) => {
        setActive(size)
    }
    
    return (
        <div className='sizesbutton-comp'>
            <label className='s-c-label'>Available Sizes</label>
            <div className='s-c-buttons-block'>
                {data.map((item, index) => {
                    return <button className={`btn-comp ${active == item.sizes ? 'active' : ''}`} key={index} onClick={() => handleSizes(item.sizes)}>{item.sizes}</button>
                })}
            </div>
        </div>
    )
}

export default SizesButton