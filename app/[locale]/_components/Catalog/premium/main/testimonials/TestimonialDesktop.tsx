import React, { useState, useRef } from "react";
import Image from "next/image";
import leftArrowIcon from "../../../../../../../public/img/icons/left-arrow-icon-inf.svg";
import rightArrowIcon from "../../../../../../../public/img/icons/right-arrow-icon-inf.svg";
import TestimonialCard from "./TestimonialCard";

interface TestimonialData {
  review: string;
  name: string;
  company: string;
}

const TestimonialDesktop = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate how many cards to show at once (responsive)
  const getCardsPerView = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width >= 1200) return 3;
      if (width >= 900) return 2;
      return 1;
    }
    return 3;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardsPerView = getCardsPerView();
      const newIndex = Math.max(0, currentIndex - cardsPerView);
      setCurrentIndex(newIndex);

      const cardWidth = 350 + 20; // card width + gap
      const scrollAmount = cardWidth * cardsPerView;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardsPerView = getCardsPerView();
      const maxIndex = Math.max(0, testimonials.length - cardsPerView);
      const newIndex = Math.min(maxIndex, currentIndex + cardsPerView);
      setCurrentIndex(newIndex);

      const cardWidth = 350 + 20; // card width + gap
      const scrollAmount = cardWidth * cardsPerView;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const testimonials: TestimonialData[] = [
    {
      review:
        "Exceptional service and outstanding quality! The team at Pepagora has transformed our business operations completely. Their innovative solutions and dedicated support have helped us achieve remarkable growth in just six months.",
      name: "Sarah Johnson",
      company: "TechCorp Solutions",
    },
    {
      review:
        "Working with Pepagora has been a game-changer for our company. Their expertise in digital transformation and commitment to excellence is unmatched. We've seen a 40% increase in efficiency since partnering with them.",
      name: "Michael Chen",
      company: "Global Industries Ltd",
    },
    {
      review:
        "The level of professionalism and attention to detail at Pepagora is remarkable. They delivered our project ahead of schedule while maintaining the highest quality standards. Highly recommended for any business looking to scale.",
      name: "Emily Rodriguez",
      company: "InnovateTech Inc",
    },
    {
      review:
        "Pepagora's team went above and beyond our expectations. Their innovative approach and deep industry knowledge helped us solve complex challenges that seemed impossible. The results speak for themselves - outstanding performance!",
      name: "David Thompson",
      company: "Future Dynamics",
    },
    {
      review:
        "From day one, Pepagora demonstrated their commitment to our success. Their strategic insights and technical expertise have been instrumental in our company's growth. We couldn't have achieved these results without their partnership.",
      name: "Lisa Wang",
      company: "NextGen Enterprises",
    },
    {
      review:
        "The collaboration with Pepagora has been nothing short of exceptional. Their team's dedication, innovative solutions, and customer-centric approach have exceeded all our expectations. A truly remarkable partnership!",
      name: "James Anderson",
      company: "Strategic Solutions Group",
    },
    {
      review:
        "Pepagora's expertise and professionalism are unmatched in the industry. They've helped us streamline our operations and achieve unprecedented growth. Their commitment to excellence is evident in every project they deliver.",
      name: "Maria Garcia",
      company: "Advanced Systems Corp",
    },
  ];
  return (
    <div className="catalog-pg-testimonial-root">
      <h5 className="catalog-pg-infrastructure-title">Testimonials</h5>
      <div className="catalog-pg-testimonial-sub-sec">
        <p className="catalog-pg-testimonial-paragraph">
          Loved by Industry Leaders
        </p>
        <div className="catalog-pg-testimonial-arrow">
          <Image
            src={leftArrowIcon}
            alt="leftArrowIcon"
            width={50}
            height={50}
            className="catalog-pg-testimonial-arrow-left"
            onClick={scrollLeft}
            style={{ cursor: "pointer" }}
          />
          <Image
            src={rightArrowIcon}
            alt="rightArrowIcon"
            width={50}
            height={50}
            className="catalog-pg-testimonial-arrow-right"
            onClick={scrollRight}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <div
        className="catalog-pg-testimonial-card-section"
        ref={scrollContainerRef}
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            review={testimonial.review}
            name={testimonial.name}
            company={testimonial.company}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialDesktop;
