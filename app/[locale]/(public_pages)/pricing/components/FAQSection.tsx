"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FAQSection() {
  const t = useTranslations('pricing.faq');
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const faqData = t.raw('items') as any[] || [];
  
  // Ensure we have a valid array
  const validFaqData = Array.isArray(faqData) ? faqData : [];

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleQuestion = (categoryId: string, questionIndex: number) => {
    const questionId = `${categoryId}-${questionIndex}`;
    setOpenQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-heading">
          {t.rich('title', {
            span: (chunks) => <span>{chunks}</span>
          })}
        </h2>

        {validFaqData && validFaqData.length > 0 && validFaqData.map((category, categoryIndex) => {
          // Ensure category has required properties with unique fallback keys
          const safeCategory = {
            id: category?.id || `category-${categoryIndex}`,
            title: category?.title || 'Untitled',
            items: Array.isArray(category?.items) ? category.items : []
          };
          
          return (
          <div 
            key={safeCategory.id} 
            className={`faq-category ${openCategories.includes(safeCategory.id) ? 'open' : ''}`}
          >
            <div 
              className="faq-category-title"
              onClick={() => toggleCategory(safeCategory.id)}
            >
              <span>{safeCategory.id}</span>
              <h3>{safeCategory.title}</h3>
            </div>
            <div className="faq-content">
              {safeCategory.items && safeCategory.items.length > 0 && safeCategory.items.map((item, index) => {
                // Create a unique key for each item
                const itemKey = item?.question 
                  ? `${safeCategory.id}-${index}-${item.question.slice(0, 20).replace(/\s+/g, '-')}`
                  : `${safeCategory.id}-item-${index}`;
                
                return (
                <div 
                  key={itemKey}
                  className={`faq-card ${openQuestions.includes(`${safeCategory.id}-${index}`) ? 'faq-open' : ''}`}
                >
                  <div 
                    className={`faq-question ${item?.isRed ? 'red' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleQuestion(safeCategory.id, index);
                    }}
                  >
                    {item?.question || 'No question available'}
                  </div>
                  <div className="faq-answer">
                    {item?.answer || 'No answer available'}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
          );
        })}
        
        {(!validFaqData || validFaqData.length === 0) && (
          <div className="faq-no-data">
            <p>FAQ data is not available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
