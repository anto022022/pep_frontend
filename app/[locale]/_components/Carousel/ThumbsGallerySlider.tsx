import { FC, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

//Images
import Typography from "@/app/[locale]/_components/Base/Typography";
import { ProductImage } from "@/app/[locale]/_interface/RfqInterface";
import Image from "next/image";
import { Swiper as SwiperType } from "swiper";
import { getImageUrl } from "../../_hooks/utility";
// import { sliderImages } from '@/sampleData';

interface ThumbsGallerySliderInterFace {
  sliderImages: ProductImage[];
  isViewDetailPage?: boolean;
}

const ThumbsGallerySlider: FC<ThumbsGallerySliderInterFace> = ({
  sliderImages,
  isViewDetailPage = false,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div
      className={`preview-thumb-gallery-block ${isViewDetailPage ? "gallery-preview-block" : ""
        }`}
    >
      <div className="preview-gallery-main">
        <Swiper
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Thumbs]}
          className="preview-slider-comp"
        >
          {sliderImages.map((image, index) => {
            return (
              <SwiperSlide key={index}>
                <a target="_blank" href={getImageUrl(image.src)} rel="noopener noreferrer"
                  onClick={(e) => e.preventDefault()} style={{ cursor: 'default' }}>
                  <Image
                    src={getImageUrl(image.src)}
                    width={380}
                    height={360}
                    alt={image.alt}
                    sizes="100vw"
                  />
                </a>
                {index === 0 && (
                  <Typography variant="span" className="preview-txt">
                    Main Thumbnail
                  </Typography>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={8}
        slidesPerView={isViewDetailPage ? "auto" : 5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbs-slider-comp"
        breakpoints={
          isViewDetailPage
            ? {}
            : {
              767: {
                slidesPerView: 3,
              },
              1100: {
                slidesPerView: 4,
              },
              1450: {
                slidesPerView: 5,
              },
            }
        }
      >
        {sliderImages.map((image, index) => {
          return (
            <SwiperSlide key={index}>
              <Image
                src={getImageUrl(image.src)}
                width={64}
                height={64}
                alt={image.alt}
                sizes="4vw"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ThumbsGallerySlider;
