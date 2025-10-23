'use client';

import React, { useEffect, useRef } from 'react';
import {
  Autoplay,
  FreeMode,
  Grid,
  Navigation,
  Pagination,
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { LeftArrowIcon } from '../Icons/SVGIcons';

interface ReusableSwiperProps<T extends React.ReactNode> {
  slides: T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  slidesOffsetAfter?: number;
  loop?: boolean;
  grid?: {
    rows: number;
    fill?: 'row' | 'column';
  } | null;
  pagination?: boolean;
  navigation?: boolean;
  autoplay?: false | number;
  freeMode?: boolean;
  breakpoints?: {
    [width: number]: {
      slidesPerView?: number;
      spaceBetween?: number;
      grid?: {
        rows: number;
        fill?: 'row' | 'column';
      };
    };
  };
  nested?: boolean;
  className?: string;
  paginationClass?: string;
}

const ReusableSwiper = <T extends React.ReactNode>({
  slides = [],
  renderItem,
  slidesPerView = 1,
  spaceBetween = 10,
  slidesOffsetAfter = 15,
  loop = false,
  grid = null,
  pagination = false,
  navigation = false,
  autoplay = false,
  freeMode = false,
  breakpoints = {},
  nested = false,
  className = '',
  paginationClass = '',
}: ReusableSwiperProps<T>) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (
      swiperRef.current &&
      navigation &&
      prevRef.current &&
      nextRef.current
    ) {
      const swiper = swiperRef.current;
      if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
      }

      if (swiper.navigation) {
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }
  }, [navigation]);


  return (
    <div className="swiper-relative">
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Pagination, Autoplay, FreeMode, Grid]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={loop}
        freeMode={freeMode}
        breakpoints={breakpoints}
        nested={nested}
        grid={grid || undefined}
        slidesOffsetAfter={slidesOffsetAfter}
        pagination={
          pagination
            ? {
              clickable: true,
              el: `.${paginationClass}`,
            }
            : false
        }
        navigation={
          navigation
            ? {
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }
            : false
        }
        autoplay={
          autoplay
            ? { delay: autoplay, disableOnInteraction: false }
            : false
        }
        className={className}
      >
        {
          slides.length > 0 ? (

            slides?.map((item: T, index: number) => (
              <SwiperSlide key={index}>
                {renderItem ? renderItem(item, index) : item}
              </SwiperSlide>
            ))

          ) : (null)

        }

        <div className="swiper-nav-pagination-grp">
          {navigation && (
            <div className="swiper-nav-grp">
              <button ref={prevRef} className="swiper-nav-btn swiper-nav-prev">
                <LeftArrowIcon />
              </button>
              <button ref={nextRef} className="swiper-nav-btn swiper-nav-next">
                <LeftArrowIcon />
              </button>
            </div>
          )}
          {pagination && <div className={paginationClass}></div>}
        </div>
      </Swiper>
    </div>
  );
};

export default ReusableSwiper;