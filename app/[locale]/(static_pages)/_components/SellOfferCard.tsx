import React from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const SellOfferCard = ({ title, subtitle, image }: { title: string, subtitle: string, image: string }) => {
    const t = useTranslations("home")
  return (
    <div className="col-xl-6 col-md-6">
    <div className="sell-offers-card">
      <div className="s-o-c-icon">
        <Image
          width={32}
          height={32}
          src={image}
          alt="Handpicked deals for every need"
        />
      </div>
      <div className="s-o-c-content-wrapper">
        <span className="s-o-c-w-title">
          {t(title)}
        </span>
        <span className="s-o-c-w-subtxt">
          {t(subtitle)}
        </span>
      </div>
    </div>
  </div>
  )
}

export default SellOfferCard