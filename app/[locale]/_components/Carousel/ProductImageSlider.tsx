"use client";
import { productImages } from "@/app/[locale]/_models/sales/product";
import Image from "next/image";
import NoImage from "@/public/img/NoImage.jpg";
import { FC, useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getImageUrl } from "../../_hooks/utility";
import {
  ChevronRightIcon,
  HeartIcon,
  SerachStatusIcon,
} from "../Icons/SVGIcons";

interface imageSliderProps {
  ProductImageData: productImages[];
  showNavigation?: boolean;
  showPagination?: boolean;
  showWishlist?: boolean;
  showSearchStatus?: boolean;
  showSaleBadge?: boolean;
  imageWidth?: number;
  imageHeight?: number;
}
const ProductImageSlider: FC<imageSliderProps> = ({
  ProductImageData,
  showNavigation = true,
  showPagination = true,
  showSearchStatus = true,
  showSaleBadge = false,
  showWishlist = true,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleHeart = () => setIsLiked((prev) => !prev);

  return (
    <div className="single-image-slider-comp-main">
      {isMounted && (
        ProductImageData[0]?.src ? (
          <Swiper
          modules={[Navigation, Pagination]}
          navigation={
            showNavigation
              ? {
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }
              : false
          }
          pagination={showPagination ? { clickable: true } : false}
          className="single-image-slider-comp"
        >
          {ProductImageData?.map((item: any, index: number) => (
            <SwiperSlide className="s-i-s-c-img" key={index}>
              <Image
                src={getImageUrl(item?.src ?? "")}
                alt={
                  item?.alt === "" || item?.alt === undefined
                    ? item?.src
                    : item?.alt
                }
                width={252}
                height={252}
                sizes="100vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        ):(
          <Swiper
          modules={[Navigation, Pagination]}
          navigation={
            showNavigation
              ? {
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }
              : false
          }
          pagination={showPagination ? { clickable: true } : false}
          className="single-image-slider-comp"
        >
          
            <SwiperSlide className="s-i-s-c-img" >
              <Image
                src={NoImage}
                alt={"Product Image"}
                width={252}
                height={252}
                sizes="100vw"
              />
            </SwiperSlide>
          
        </Swiper>
        )
        
      )}
      <div className="options-group">
        {showWishlist && (
          <div className="o-g-item" onClick={toggleHeart}>
            <HeartIcon
              className={`o-g-i-icon ${isLiked ? "heart-added" : ""}`}
            />
          </div>
        )}
        {showSearchStatus && (
          <div className="o-g-item">
            <SerachStatusIcon className="o-g-i-icon search-status" />
          </div>
        )}
      </div>
      {/* For Best Seller add class "best-seller" if Hot Selling add class "hot-selling" "product-badge" class is common dont remove in any cases */}
      {showSaleBadge && <span className="product-badge">Newly added</span>}
      {showNavigation && (
        <>
          <button
            ref={prevRef}
            className={`nav-arrow-icon nav-arrow-icon-left`}
          >
            <ChevronRightIcon />
          </button>
          <button
            ref={nextRef}
            className={`nav-arrow-icon nav-arrow-icon-right`}
          >
            <ChevronRightIcon />
          </button>
        </>
      )}
    </div>
  );
};

export default ProductImageSlider;
