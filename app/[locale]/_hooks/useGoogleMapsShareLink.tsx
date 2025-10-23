import CopyLink from "@/app/[locale]/_components/Common/CopyLink";
import React from 'react';

interface MapEmbedAndCopyProps {
    embedUrl?: string;
}

function getGoogleMapsShareLink(embedUrl?: string): string | null {
    if (!embedUrl) return null;
    try {
        const decodedUrl = decodeURIComponent(embedUrl);
        const latLngMatch = decodedUrl.match(/!2d([-.\d]+)!3d([-.\d]+)/);
        const lng = latLngMatch?.[1];
        const lat = latLngMatch?.[2];
        const placeMatch = decodedUrl.match(/!2s([^!]+)/);
        const place = placeMatch?.[1]?.replace(/\+/g, ' ') ?? 'Location';

        if (!lat || !lng) return null;

        const queryParam = encodeURIComponent(place);
        return `https://www.google.com/maps?q=${queryParam}&ll=${lat},${lng}`;
    } catch {
        return null;
    }
}

const GoogleMapsShareLink: React.FC<MapEmbedAndCopyProps> = ({ embedUrl }) => {
    const shareLink = getGoogleMapsShareLink(embedUrl);

    if (!embedUrl) return null;

    return (
        <>
            <div className='embed-map'>
                <iframe
                    src={embedUrl}
                    width="400"
                    height="200"
                    style={{ border: '0' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map"
                />
            </div>
            <CopyLink textToCopy={shareLink ?? embedUrl} />
        </>
    );
};

export default GoogleMapsShareLink;