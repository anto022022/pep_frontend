import { OfferDiscountListInterface } from '@/app/[locale]/_interface/MarketPlaceInterface'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

const TrendingOfferCard = ({ item }: { item?: OfferDiscountListInterface }) => {
    const t = useTranslations("home")
    return (
        <Link
            href={`/p/${item?.liveUrl}`}
            className="product-card cursor-pointer"
            key={item?._id}
        >
            <div className="p-c-img">
                <Image
                    width={120}
                    height={120}
                    src={`${process.env.NEXT_PUBLIC_BUCKET_URL}${item?.productImage?.[0]?.src}`}
                    alt="Product"
                />
            </div>
            <div className="p-c-info">
                <span className="p-c-i-name">
                    {item?.productName}
                </span>
                <div className="dicount-price-wrapper">
                    <span className="discount-badge">
                        {t("common.discountBadge")}
                    </span>
                    <div className="price-wrapper">
                        <span className="price-txt">
                            ₹
                            {
                                item?.activeOffer?.offerInfo?.pricing
                                    ?.unitPrice
                            }
                        </span>
                        <span className="price-txt strike-txt">
                            ₹{item?.pricing?.unitPrice}
                        </span>
                        <span className="discount-txt">
                            {
                                item?.activeOffer?.offerInfo
                                    ?.discountPercent
                            }
                            % OFF
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default TrendingOfferCard