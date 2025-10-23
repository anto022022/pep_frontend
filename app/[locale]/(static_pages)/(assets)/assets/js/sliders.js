var swiper = new Swiper(".ai-empower-slider", {
    slidesPerView: 3.5,
    spaceBetween: 20,
    grabCursor: true,
    breakpoints: {
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
    },
});