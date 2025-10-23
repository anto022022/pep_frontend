"use client";
import React, { useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";

//Images
import {
  DownloadProcessIcon,
  ShareProductIcon
} from "@/app/[locale]/_components/Icons/SVGIcons";
import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { useUpdateProductShareMutation } from "@/app/[locale]/_store/apiReducer/marketApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import style from "@/assets/styles-modules/product-details.module.css";
import Image from "next/image";
import { useDispatch } from "react-redux";

const ProductDetailGallerySlider: React.FC<ProductDetailPageProps> = ({
  productData,
}) => {
  const dispatch = useDispatch();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  // const [isLiked, setIsLiked] = useState(false);
  // const toggleHeart = () => setIsLiked((prev) => !prev);
  const [updateProductShare] = useUpdateProductShareMutation();
  const isMobile = useIsMobile();
  const handleCopyProductLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        dispatch(
          showToast({
            title: "Copied!",
            message: "Product link copied to clipboard.",
            theme: "success",
          })
        );
      },
      () => {
        dispatch(
          showToast({
            title: "Error",
            message: "Failed to copy link.",
            theme: "error",
          })
        );
      }
    );
    if (productData?.uniqueId) {
      updateProductShare({ id: productData?.uniqueId });
    }
  };
  const handleBrochureDownload = (
    productData: ProductDetailPageProps["productData"]
  ) => {
    const brochure = productData?.productBrochure;
    if (!brochure?.src) return;

    const fileUrl = getImageUrl(brochure.src);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.setAttribute("download", brochure.alt || "brochure.pdf"); // Browser will try to download
    link.setAttribute("target", "_blank"); // Optional: open in new tab if download fails

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="preview-thumb-gallery-block product-detail-gallery-block">
      <div className="preview-gallery-main">
        <Swiper
          spaceBetween={10}
          navigation={false}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Thumbs, Pagination]}
          className="preview-slider-comp"
          pagination={{ clickable: true }}
        >
          {productData?.productImage?.map(
            (image, index: React.Key | null | undefined) => {
              return (
                <SwiperSlide key={index}>
                  {/* <a href={getImageUrl(image.src)}></a> */}
                  <Image
                    src={getImageUrl(image.src)}
                    width={380}
                    height={360}
                    alt={
                      image.alt == "" || image.alt == undefined
                        ? image?.src
                        : image?.alt
                    }
                    sizes="100vw"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </SwiperSlide>
              );
            }
          )}
        </Swiper>

        <div className="options-group">
          {/* <div className="o-g-item" onClick={toggleHeart}>
           <HeartIcon
              className={`o-g-i-icon ${isLiked ? "heart-added" : ""}`}
            />
          </div> */}
          <div className="o-g-item" onClick={handleCopyProductLink}>
            <ShareProductIcon className="o-g-i-icon" />
          </div>
        </div>

        {productData?.productBrochure && (
          <div className="options-group bottom-right">
            <div
              onClick={() => handleBrochureDownload(productData)}
              className="o-g-item content-item"
            >
              <DownloadProcessIcon className="o-g-i-icon" />
              <span className="c-i-txt">Download Brochure</span>
            </div>
          </div>
        )}
      </div>
      {!isMobile && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={"auto"}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className={`${style.productImageSideScroll} thumbs-slider-comp`}
        >
          {productData?.productImage?.map(
            (image, index: React.Key | null | undefined) => {
              return (
                <SwiperSlide key={index}>
                  <Image
                    src={getImageUrl(image.src)}
                    width={64}
                    height={64}
                    alt={image.alt}
                    sizes="10vw"
                  />
                </SwiperSlide>
              );
            }
          )}
        </Swiper>
      )}
    </div>
  );
};

export default ProductDetailGallerySlider;
