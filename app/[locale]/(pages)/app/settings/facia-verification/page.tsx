"use client"
import { useGetProfileDetailsQuery } from '@/app/[locale]/_store/apiReducer/settingsApi'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = ({ searchParams }: { searchParams: Promise<{ url: string }> }) => {
    const router = useRouter()
    const params = React.use(searchParams)
    const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
    const [isLoading, setIsLoading] = useState(true)
    const { data, isSuccess } = useGetProfileDetailsQuery();

    if (!params.url) {
        router.push("/app/settings/account-settings")
    }

    useEffect(() => {
        if (isSuccess && data?.data) {
            const profile = data.data;
            if (profile.kycStatus === "Completed") {
                router.push("settings/account-settings?type=compliance-settings")
            }
        }
    }, [isSuccess, data]);


    useEffect(() => {
        // Request camera permissions when component mounts
        const requestCameraPermission = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    })
                    setCameraPermission('granted')
                    // Stop the stream immediately as we just needed permission
                    stream.getTracks().forEach(track => track.stop())
                }
            } catch (error) {
                console.error('Camera permission error:', error)
                setCameraPermission('denied')
            } finally {
                setIsLoading(false)
            }
        }

        requestCameraPermission()
    }, [])

    if (isLoading) {
        return (
            <div className="camera-verification-container">
                <div className="loading-state">
                    <p>Requesting camera permissions...</p>
                </div>
            </div>
        )
    }

    if (cameraPermission === 'denied') {
        return (
            <div className="camera-verification-container">
                <div className="error-state">
                    <h3>Camera Access Required</h3>
                    <p>Please enable camera access in your browser settings to continue with facial verification.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-button"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="camera-verification-container">
            <iframe
                src={params.url}
                allow="camera; microphone; geolocation; encrypted-media"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-camera allow-microphone"
                style={{
                    width: "100%",
                    height: "600px",
                    border: "none",
                    borderRadius: "8px"
                }}
                title="Facial Verification"
            />
        </div>
    )
}

export default page