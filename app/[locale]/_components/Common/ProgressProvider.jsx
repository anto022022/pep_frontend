'use client'

import React from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressProvider = ({ children }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="2px"
                color="#d92c27"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    )
}

export default ProgressProvider