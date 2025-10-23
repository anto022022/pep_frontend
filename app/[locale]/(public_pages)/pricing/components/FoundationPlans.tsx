"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { formatPayment } from '@/app/[locale]/_hooks/utility';

export default function FoundationPlans() {
  const t = useTranslations('pricing.foundationPlans');
  const router = useRouter();



  return (
    <section className="foundation-section">
      <div className="foundation-header">
        <h2>{t('title')}</h2>
        <p className="subtitle">{t('subtitle')}</p>
        <p className="description">
          {t('description')}
        </p>
      </div>

      <div className="foundation-cards">
        {/* Free Plan */}
        <div 
          className="foundation-card"
          data-month-link-inr="/authenticate"
          data-year-link-inr="/authenticate"
          data-month-link-usd="/authenticate"
          data-year-link-usd="/authenticate"
        >
          <div className="plan-header">
            <div className="plan-title">
              <h3>{t('free.title')}</h3>
              <p className="tagline">{t('free.subtitle')}</p>
            </div>
            <div className="plan-price">
              <p className="price">{formatPayment(0, '₹').formatted}</p>
            </div>
          </div>
          <div className="plan-body">
            <h4>{t('free.features.title')}</h4>
            <ul className="feature-list">
              {t.raw('free.features.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              className="btn-outline"
              onClick={() => router.push("/authenticate")}
            >
              {t('free.button')}
            </button>
          </div>
        </div>

        {/* Explore Plan */}
        <div 
          className="foundation-card"
          data-month-link-inr="/authenticate"
          data-year-link-inr="/authenticate"
          data-month-link-usd="/authenticate"
          data-year-link-usd="/authenticate"
        >
          <div className="plan-header">
            <div className="plan-title">
              <h3>{t('explore.title')}</h3>
              <p className="tagline">{t('explore.subtitle')}</p>
            </div>
            <div className="plan-price">
              <p className="price">
                <span className="amount">{formatPayment(599, '₹').amount}</span>
                <span className="currency">{formatPayment(599, '₹').symbol}</span>
                <span className="billing">/ month</span><br />
                <small>billed yearly</small>
              </p>
            </div>
          </div>
          <div className="plan-body">
            <h4>{t('explore.features.title')}</h4>
            <ul className="feature-list">
              {t.raw('explore.features.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              className="btn-outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open("https://rzp.io/rzp/42kpwmOQ", "_blank");
              }}
            >
              {t('explore.button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
