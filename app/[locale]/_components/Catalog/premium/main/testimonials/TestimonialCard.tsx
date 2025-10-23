import React from "react";
import Image from "next/image";
import quotes from "../../../../../../../public/img/icons/quote.svg";

interface TestimonialCardProps {
  review: string;
  name: string;
  company: string;
}

const TestimonialCard = ({ review, name, company }: TestimonialCardProps) => {
  return (
    <div className="catalog-pg-testimonial-card-container">
      {/* Quotes icon at top */}
      <div className="catalog-pg-testimonial-card-header">
        <Image src={quotes} alt="quotes" width={24} height={24} />
      </div>

      {/* Description in middle */}
      <div className="catalog-pg-testimonial-card-content">
        <p className="catalog-pg-testimonial-card-review">{review}</p>
      </div>

      {/* Footer at bottom */}
      <div className="catalog-pg-testimonial-card-footer">
        <div className="catalog-pg-testimonial-name">{name}</div>
        <div className="catalog-pg-testimonial-company">{company}</div>
      </div>
    </div>
  );
};

export default TestimonialCard;
