import React from 'react';

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pricing-layout">
      {children}
    </div>
  );
}
