import Image from 'next/image'
import React from 'react'
import { useTranslations } from 'next-intl'

const ReadyGrowCard = ({ title, subtitle, image }: { title: string, subtitle: string, image: string }) => {
    const t = useTranslations("home")
    return (
        <div className="col-6 col-xl-3">
            <div className="ready-grow-card">
                <span className="r-g-b-title">
                    {t(title)}
                </span>
                <div className="r-g-b-img-subtxt">
                    <div className="r-g-b-img">
                        <Image
                            width={164}
                            height={154}
                            src={image}
                            alt="List your products"
                        />
                    </div>
                    <span className="r-g-b-subtxt">
                        {t(subtitle)}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ReadyGrowCard