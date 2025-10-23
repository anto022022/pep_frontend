"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PricingHeroProps {
  onPlanTypeChange: (planType: 'grow' | 'foundation') => void;
}

export default function PricingHero({ onPlanTypeChange }: PricingHeroProps) {
  const t = useTranslations('pricing.hero');
  const [activePlanType, setActivePlanType] = useState<'grow' | 'foundation'>('grow');

  const handleToggle = (planType: 'grow' | 'foundation') => {
    setActivePlanType(planType);
    onPlanTypeChange(planType);
  };
  return (
    <section className="pricing-hero">
              <div className="hero-content">
                <h1>
                  {t('title')} <br />
                  {t('titleBreak')}<span className="highlight">{t('titleHighlight')}</span>
                </h1>
                <h2>{t('subtitle')}</h2>
                <p>
                  {t('description')}
                </p>
                <div className="plan-picker">
                  <p>{t('planPicker.text')}</p>
          <div className="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="86" height="98" viewBox="0 0 86 98" fill="none">
              <g clipPath="url(#clip0_1_29786)">
                <path
                  d="M36.3389 88.6424C35.6723 89.2032 34.8301 89.0107 34.2568 88.4562C29.3755 83.8162 27.0499 77.3213 25.9197 70.8172C24.8762 64.819 24.7744 58.6547 25.5181 52.6108C27.0278 40.3434 31.8276 28.6241 38.5089 18.2807C42.3034 12.4057 46.7137 6.95676 51.6954 2.05162C52.3097 1.44549 53.4255 1.63205 53.9446 2.25129C54.5489 2.97582 54.3385 3.87074 53.745 4.50055C45.6748 13.0379 38.7449 22.8007 34.1487 33.6482C29.6297 44.317 27.341 56.0455 28.7591 67.6257C29.5923 74.3981 31.4982 81.6339 36.5188 86.556C37.0877 87.1168 36.9002 88.1668 36.3326 88.6381L36.3389 88.6424Z"
                  fill="#232323" />
                <path
                  d="M25.4717 86.9219C27.6185 87.0414 29.7504 87.2899 31.887 87.5046C32.9278 87.6115 33.9624 87.714 35.0056 87.804C35.3293 87.8328 35.6468 87.8573 35.9662 87.8925C35.9211 87.5548 35.8867 87.2151 35.8416 86.8774C35.7699 86.3633 35.7025 85.843 35.6265 85.3352C35.6187 85.2927 35.6115 85.2226 35.6076 85.2013C35.5906 85.0781 35.5737 84.9549 35.5567 84.8317C35.517 84.5534 35.4729 84.2814 35.4332 84.0031C35.2768 82.9938 35.114 81.9802 34.9513 80.9666C34.8728 80.4757 34.7837 79.9867 34.7096 79.4896C34.6084 78.8436 34.4569 78.0421 34.6799 77.3975C34.856 76.8876 35.1724 76.4841 35.7154 76.3302C36.1753 76.2025 36.8093 76.3066 37.1312 76.6872C37.9143 77.6098 38.0559 78.8689 38.267 80.0275C38.4669 81.0947 38.6456 82.1659 38.8031 83.2409C39.0908 85.1213 39.8955 89.5981 39.8483 90.002C39.7828 90.607 39.4385 91.0376 38.9573 91.29C38.6719 91.5013 38.3264 91.6246 37.9853 91.6209C37.7756 91.6152 35.5234 91.3392 34.9755 91.2852C33.9028 91.1842 32.8301 91.0831 31.7555 90.9714C29.5342 90.7447 27.3154 90.501 25.1274 90.0651C23.3724 89.715 23.6511 86.8144 25.4804 86.9093L25.4717 86.9219Z"
                  fill="#232323" />
              </g>
              <defs>
                <clipPath id="clip0_1_29786">
                  <rect width="42.1557" height="88.8036" fill="white"
                    transform="matrix(0.822407 0.5689 0.5689 -0.822407 0.476562 73.1797)" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="btn-main">
            <div className="toggle-button">
                      <div 
                        className={`toggle-option ${activePlanType === 'grow' ? 'active' : ''}`}
                        onClick={() => handleToggle('grow')}
                      >
                        {t('planPicker.grow')}
                      </div>
                      <div 
                        className={`toggle-option ${activePlanType === 'foundation' ? 'active' : ''}`}
                        onClick={() => handleToggle('foundation')}
                      >
                        {t('planPicker.foundation')}
                      </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
