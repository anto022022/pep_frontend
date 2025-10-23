'use client';

import '@/app/[locale]/dev_styles.css';
import aiPower1 from "@/public/img/static-site/ai-power-sme-1.png";
import aiPower2 from "@/public/img/static-site/ai-power-sme-2.png";
import aiPower3 from "@/public/img/static-site/ai-power-sme-3.png";
import aiPower4 from "@/public/img/static-site/ai-power-sme-4.png";
import aiPower5 from "@/public/img/static-site/ai-power-sme-action.png";
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const AiEmpowerSlider = () => {

    const slides = [
        aiPower1,
        aiPower2,
        aiPower3,
        aiPower4,
        aiPower5,
    ];

    return (
        <>
            <div className="ai-empower-slider mt-4 p-2" style={{ position: 'relative' }}>

                <div className="swiper-button-prev custom-nav">
                    <span className='c-n-icon'>←</span>
                </div>
                <Swiper
                    modules={[Pagination, Navigation]}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    slidesPerView={3.5}
                    spaceBetween={20}
                    grabCursor={true}
                    breakpoints={{
                        320: {
                            slidesPerView: 1.3,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 2.5,
                        },
                        1200: {
                            slidesPerView: 3.5,
                        },
                    }}
                >

                    {slides.map((src, index) => (
                        <SwiperSlide key={index}>
                            <div className="ai-power-img">
                                <Image
                                    src={src}
                                    width={464}
                                    height={464}
                                    alt="ai-power-sme"
                                />
                            </div>
                        </SwiperSlide>
                    ))}

                </Swiper>
                <div className="swiper-button-next custom-nav">
                    <span className='c-n-icon'>→</span>
                </div>
            </div>
        </>
    )
}

export default AiEmpowerSlider
