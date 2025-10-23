import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import leftArrowIcon from "../../../../../../../public/img/icons/left-arrow-icon-inf.svg";
import rightArrowIcon from "../../../../../../../public/img/icons/right-arrow-icon-inf.svg";
import TestimonialCard from "./TestimonialCard";

interface TestimonialData {
  review: string;
  name: string;
  company: string;
}

const TestimonialMobile = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

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

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Touch/Drag functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = startX - currentX;
    const threshold = 50; // Minimum drag distance to trigger change

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - next testimonial
        nextTestimonial();
      } else {
        // Swiped right - previous testimonial
        prevTestimonial();
      }
    }
  };

  // Mouse drag functionality for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextTestimonial();
      } else {
        prevTestimonial();
      }
    }
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        setCurrentX(e.clientX);
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        const diff = startX - currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            nextTestimonial();
          } else {
            prevTestimonial();
          }
        }
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, startX, currentX, nextTestimonial, prevTestimonial]);

  return (
    <div className="catalog-pg-testimonial-mobile-root">
      <div className="catalog-pg-testimonial-mobile-header">
        <div className="catalog-pg-testimonial-mobile-title-section">
          <h5 className="catalog-pg-testimonial-mobile-title">Testimonials</h5>
          <p className="catalog-pg-testimonial-mobile-subtitle">
            Loved by Industry Leaders
          </p>
        </div>

        <div className="catalog-pg-testimonial-mobile-arrows">
          <div
            className="catalog-pg-testimonial-mobile-arrow catalog-pg-testimonial-mobile-arrow-left"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <Image src={leftArrowIcon} alt="Previous" width={50} height={50} />
          </div>
          <div
            className="catalog-pg-testimonial-mobile-arrow catalog-pg-testimonial-mobile-arrow-right"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <Image src={rightArrowIcon} alt="Next" width={50} height={50} />
          </div>
        </div>
      </div>

      <div className="catalog-pg-testimonial-mobile-container">
        <div
          className="catalog-pg-testimonial-mobile-card-wrapper"
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <TestimonialCard
            review={testimonials[currentIndex].review}
            name={testimonials[currentIndex].name}
            company={testimonials[currentIndex].company}
          />
        </div>

        {/* <div className="catalog-pg-testimonial-mobile-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`catalog-pg-testimonial-mobile-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default TestimonialMobile;
