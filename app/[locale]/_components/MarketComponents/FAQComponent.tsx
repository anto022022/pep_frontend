import Typography from "@/app/[locale]/_components/Base/Typography";
import { Accordion, AccordionTab } from "primereact/accordion";
import { FC } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  faqs: FaqItem[];
}

export const FAQComponent: FC<FaqProps> = ({ faqs }) => {
  return (
    <section className="section-block faq-block">
      <div className="detail-box-wrapper">
        <Typography variant="h6" className="d-b-w-title">
          FAQ
        </Typography>
        <div className="accordion-comp faq-accordion-comp">
          <Accordion activeIndex={0}>
            {faqs?.map((item: FaqItem, index: number) => (
              <AccordionTab
                header={
                  <>
                    <div className="faq-title">
                      <Typography variant="span" className="f-t-count">
                        {index + 1}
                      </Typography>
                      <Typography variant="h6" className="f-t-title">
                        {item.question}
                      </Typography>
                    </div>
                  </>
                }
                key={index}
              >
                <p className="m-0">{item.answer}</p>
              </AccordionTab>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
