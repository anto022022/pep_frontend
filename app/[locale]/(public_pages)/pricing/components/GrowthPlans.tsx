"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Plan, PricingData, BillingType, CountryCode } from '../types';
export const formatAmount = (amount: number, currencySymbol: string, currency: string) => {
  // Use US formatting for $ symbol, Indian formatting for others
  const locale = currencySymbol === '$' ? 'en-US' : 'en-IN';
  const formattedAmount = amount.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return {
    symbol: currencySymbol,
    amount: formattedAmount,
    currency: currency
  };
};
export default function GrowthPlans({ countryId }: { countryId?: string }) {
  const t = useTranslations('pricing.growthPlans');
  const C = useTranslations('pricing.common');
  const locale = useLocale(); // Get the current language

  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingType, setBillingType] = useState<BillingType>('yearly');
  const [countryCode, setCountryCode] = useState<string>(countryId || 'US');
  // Function to format amount with proper separation
 

  useEffect(() => {
    // Get country code from cookie
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    };

    const country = getCookie('countryCode') || countryId || 'US';
    setCountryCode(country as CountryCode);
    loadPlans(country);
  }, []);

  const loadPlans = async (country: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"}get-pricing?country=${country}`);
      const data: PricingData = await response.json();
      setPlans(data.data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanButtonClick = (plan: Plan) => {
    const monthLink = countryCode === "IN" || countryCode === "AE" 
      ? plan.withTaxMonthPaymentLink 
      : plan.monthPaymentLink;
    
    const yearLink = countryCode === "IN" || countryCode === "AE"
      ? plan.withTaxYearPaymentLink
      : plan.yearPaymentLink;

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
      console.error("Payment link is missing for this plan!");
      alert(C('paymentLinkMissing'));
    }
  };

  const renderPlanCard = (plan: Plan) => {
    const planName = plan.packageName?.[locale] || 'Unknown Plan';
    const setting = plan.regionalSettings?.[0];
    const monthlyWithTax = setting?.monthlyPrice || 0;
    const yearlyWithTax = setting?.yearlyPrice || 0;
    const billingInfo = plan.billingInfo?.[locale];
    const description = plan.description?.[locale];

    let badge: React.ReactNode = null;
    let cardClassName = "plan-card";

    if (plan?.packageName?.["en"] && typeof plan?.packageName?.["en"] === 'string' && (plan?.packageName?.["en"].toLowerCase() === "scale" ||
        planName.toLowerCase() === "business")) {
      cardClassName = "plan-card highlight-card";
      badge = (
        <>
          <div className="label-top">Save 20% on Yearly</div>
          <div className="label-corner">Most Popular</div>
        </>
      );
    } else if (planName && typeof planName === 'string' && planName.toLowerCase() === "global") {
      badge = <div className="label-corner dark">Recommended</div>;
    }

    const featureList = plan.features && plan.features[locale] && Array.isArray(plan.features[locale])
      ? plan.features[locale].map((f, index) => <li key={index}>{String(f)}</li>)
      : [<li key="no-features">No features listed</li>];

    return (
      <div key={planName} className={cardClassName} id={planName}>
        {badge}
        <h3>{planName}</h3>
        <p className="plan-subtitle">{description || ""}</p>

        <div className="price yearly-price" style={{ display: billingType === 'yearly' ? 'block' : 'none' }}>
          {(() => {
            const formatted = formatAmount(
              yearlyWithTax, 
              setting?.currencySymbol || '₹', 
              setting?.currency || 'INR'
            );
            return (
              <>
                <span>{formatted.symbol}</span>{formatted.amount}
                <span className="unit"> {formatted.currency}<br />/year</span>
              </>
            );
          })()}
        </div>

        {monthlyWithTax && (
          <div className="price monthly-price" style={{ display: billingType === 'monthly' ? 'block' : 'none' }}>
            {(() => {
              const formatted = formatAmount(
                monthlyWithTax, 
                setting?.currencySymbol || '₹', 
                setting?.currency || 'INR'
              );
              return (
                <>
                  <span>{formatted.symbol}</span>{formatted.amount}
                  <span className="unit"> {formatted.currency}<br />/month</span>
                </>
              );
            })()}
          </div>
        )}

                <p className="billing-info">
                  {billingType === 'yearly' ? C('billedOnceYearly') : C('billedMonthly')}
                </p>
        <hr />
        <p className="info-label">
          <strong>{C('billingInfo')}:</strong><br />
          {billingInfo || "For Building A Strong Digital Foundation."}
        </p>
        <p className="info-label"><strong>{C('featureList')}:</strong></p>
        <ul className="features">{featureList}</ul>

        <button 
          className="plan-button" 
          onClick={() => handlePlanButtonClick(plan)}
        >
          {C('choosePlan')} {planName}
        </button>
      </div>
    );
  };

  return (
    <section className="plans-section growth-plans">
      <h2><span className="highlight">{t('title')}</span></h2>
      <p className="subtitle">{t('subtitle')}</p>
      <p className="description">
        {t('description')}
      </p>

      {/* Billing toggle */}
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

      {/* Container for dynamic plans */}
      <div className="plans-container">
        {loading ? (
          <div>{C('loading')}</div>
        ) : (
          <>
            {plans.length > 0 ? plans.map(renderPlanCard) : <div>No plans available</div>}
            
            {/* Enterprise card */}
            <div className="plan-card" id="Enterprise">
              <h3>{t('enterprise.title')}</h3>
              <p className="plan-subtitle">{t('enterprise.subtitle')}</p>
              <hr />
              <p className="info-label">
                <strong>Billing Info:</strong><br />
                {t('enterprise.billingInfo')}
              </p>
              <p className="info-label"><strong>{t('enterprise.features.title')}</strong></p>
              <ul className="features">
                {t.raw('enterprise.features.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <button className="plan-button">{t('enterprise.button')}</button>
            </div>
          </>
        )}
      </div>
      
      <p className="plan-subtitle" style={{ padding: '1rem 0', textAlign: 'left' }}>
        {t('taxNote')}
      </p>
    </section>
  );
}
