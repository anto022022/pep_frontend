# Pricing Page - React Component

This directory contains the React components converted from the original `pricing.html` file.

## Structure

```
pricing/
├── page.tsx                 # Main page component
├── layout.tsx              # Layout wrapper
├── PricingComponent.tsx    # Main pricing component
├── components/             # Individual component files
│   ├── PricingHero.tsx     # Hero section with plan picker
│   ├── GrowthPlans.tsx     # Growth plans with API integration
│   ├── FoundationPlans.tsx # Foundation plans
│   ├── FeatureComparison.tsx # Feature comparison table
│   └── FAQSection.tsx      # FAQ section
└── README.md              # This file
```

## Key Features Converted

### 1. PricingHero Component
- Hero section with main heading and description
- Plan picker toggle (Grow/Foundation)
- Arrow SVG graphic

### 2. GrowthPlans Component
- Dynamic plan loading from API (`https://api.pepagora.com/get-pricing`)
- Country-based pricing (IN, AE, DEFAULT)
- Billing toggle (Monthly/Yearly)
- Plan cards with features and pricing
- Payment link integration
- Enterprise plan card

### 3. FoundationPlans Component
- Free and Explore plans
- Country-based pricing configuration
- Billing toggle functionality
- Payment link handling

### 4. FeatureComparison Component
- Detailed feature comparison table
- Toggle functionality for showing/hiding comparison
- Mobile-responsive design
- Section headers with icons

### 5. FAQSection Component
- Categorized FAQ items
- Expandable categories and questions
- Interactive toggles

## API Integration

The GrowthPlans component fetches pricing data from:
```
GET https://api.pepagora.com/get-pricing?country={countryCode}
```

## Country Support

The pricing adapts based on the `countryCode` cookie:
- **IN**: Indian Rupees (₹)
- **AE**: US Dollars ($) with UAE-specific links
- **DEFAULT**: US Dollars ($) with default links

## Styling

The components use CSS classes that should match the original HTML styling. Make sure the following CSS files are available:
- `/css/pricing.css`
- `/css/custom.css`
- `/css/responsive.css`
- And other referenced stylesheets

## Usage

The pricing page is accessible at `/pricing` and integrates with the existing Next.js routing system.

## Dependencies

- React 18+
- Next.js 13+ (App Router)
- TypeScript
- Client-side cookie handling for country detection
