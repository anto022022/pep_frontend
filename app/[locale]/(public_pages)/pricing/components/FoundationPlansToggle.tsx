"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PlanConfigs, BillingType, CountryCode } from '../types';
import { formatPayment } from '@/app/[locale]/_hooks/utility';

export default function FoundationPlansToggle({ countryId }: { countryId?: string }) {
  const t = useTranslations('pricing.foundationPlansToggle');
  const router = useRouter();
  const [billingType, setBillingType] = useState<BillingType>('yearly');
  const [countryCode, setCountryCode] = useState<CountryCode>(countryId || 'US');

  useEffect(() => {
    // Get country code from cookie
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    };

    const country = (getCookie('countryCode') as CountryCode) || countryId || 'US';
    setCountryCode(country);
  }, []);

  const planConfigs: PlanConfigs = {
    Explore: {
      IN: {
        currency: "₹",
        monthPrice: "899",
        yearPrice: "8999",
        monthLink: "https://rzp.io/rzp/Vklri4rj",
        yearLink: "https://rzp.io/rzp/zk5u6nM"
      },
      AE: {
        currency: "$",
        monthPrice: "10",
        yearPrice: "100",
        monthLink: "https://pay.pepagora.com/b/aFadRafsvgAYffN6eGgnK0A",
        yearLink: "https://pay.pepagora.com/b/8x26oI803ckIffN46ygnK0y"
      },
      DEFAULT: {
        currency: "$",
        monthPrice: "10",
        yearPrice: "100",
        monthLink: "https://pay.pepagora.com/b/dRm6oI4NR70o6JhcD4gnK0z",
        yearLink: "https://pay.pepagora.com/b/cNi5kE1BFfwU2t18mOgnK0x"
      }
    }
  };

  const getExploreConfig = () => {
    return planConfigs.Explore[countryCode as keyof typeof planConfigs.Explore] || planConfigs.Explore.DEFAULT;
  };

  const handlePlanButtonClick = (monthLink: string, yearLink: string) => {
    const link = billingType === "monthly" ? monthLink : yearLink;
    if (link) {
      if (link.startsWith('/')) {
        // Internal route
        router.push(link);
      } else {
        // External URL
        window.location.href = link;
      }
    } else {
      alert("No link configured for this plan.");
    }
  };

  const exploreConfig = getExploreConfig();

  return (
    <section className="plans-section foundation-plans">
      <h2><span className="highlight">{t('title')}</span></h2>

      {/* Billing Toggle */}
      <div className="billing-toggle">
        <button 
          className={`billing-option ${billingType === 'monthly' ? 'active' : ''}`}
          onClick={() => setBillingType('monthly')}
        >
          {t('billingToggle.monthly')}
        </button>
        <button 
          className={`billing-option ${billingType === 'yearly' ? 'active' : ''}`}
          onClick={() => setBillingType('yearly')}
        >
          {t('billingToggle.yearly')}
        </button>
      </div>

      <div className="plans-slider" data-billing={billingType}>
        <div className="plans-container">
          {/* Free Plan */}
          <div className="plan-card" id="Free">
            <h3>{t('free.title')}</h3>
            <p className="plan-subtitle">{t('free.subtitle')}</p>

            <div className="price monthly-price" style={{ display: billingType === 'monthly' ? 'block' : 'none' }}>
              {(() => {
                const currency = countryCode === 'IN' ? '₹' : '$';
                const formatted = formatPayment(0, currency);
                return (
                  <>
                    <span className="currency-symbol">{formatted.symbol}</span>
                    <span className="amount">{formatted.amount}</span>
                    <span className="unit"> /month</span>
                  </>
                );
              })()}
            </div>
            <div className="price yearly-price" style={{ display: billingType === 'yearly' ? 'block' : 'none' }}>
              {(() => {
                const currency = countryCode === 'IN' ? '₹' : '$';
                const formatted = formatPayment(0, currency);
                return (
                  <>
                    <span className="currency-symbol">{formatted.symbol}</span>
                    <span className="amount">{formatted.amount}</span>
                    <span className="unit"> /year</span>
                  </>
                );
              })()}
            </div>

            <p className="billing-info">
              {billingType === 'monthly' ? 'billed monthly' : 'billed once yearly'}
            </p>
            <hr />
            <p className="info-label"><strong>{t('free.features.title')}</strong></p>
            <ul className="features">
              {t.raw('free.features.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              className="plan-button"
              onClick={() => handlePlanButtonClick("/authenticate", "/authenticate")}
            >
              {t('free.button')}
            </button>
          </div>

          {/* Explore Plan */}
          <div className="plan-card" id="Explore">
            <h3>{t('explore.title')}</h3>
            <p className="plan-subtitle">{t('explore.subtitle')}</p>

            <div className="price monthly-price" style={{ display: billingType === 'monthly' ? 'block' : 'none' }}>
              {(() => {
                const formatted = formatPayment(exploreConfig.monthPrice, exploreConfig.currency);
                return (
                  <>
                    <span className="currency-symbol">{formatted.symbol}</span>
                    <span className="amount">{formatted.amount}</span>
                    <span className="unit"> /month</span>
                  </>
                );
              })()}
            </div>
            <div className="price yearly-price" style={{ display: billingType === 'yearly' ? 'block' : 'none' }}>
              {(() => {
                const formatted = formatPayment(exploreConfig.yearPrice, exploreConfig.currency);
                return (
                  <>
                    <span className="currency-symbol">{formatted.symbol}</span>
                    <span className="amount">{formatted.amount}</span>
                    <span className="unit"> /year</span>
                  </>
                );
              })()}
            </div>

            <p className="billing-info">
              {billingType === 'monthly' ? 'billed monthly' : 'billed once yearly'}
            </p>
            <hr />
            <p className="info-label"><strong>{t('explore.features.title')}</strong></p>
            <ul className="features">
              {t.raw('explore.features.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              className="plan-button"
              onClick={() => handlePlanButtonClick(exploreConfig.monthLink, exploreConfig.yearLink)}
            >
              {t('explore.button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
