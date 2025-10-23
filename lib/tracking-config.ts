/**
 * Tracking Configuration for Google Tag Manager
 * 
 * This file contains all the tracking IDs and configurations that should be
 * set up in Google Tag Manager once it's implemented on the website.
 * 
 * Instructions:
 * 1. Google Tag Manager is already implemented in _document.tsx
 * 2. Set up the following tracking codes in your GTM container
 * 3. Configure triggers and variables as needed
 */

export const trackingConfig = {
  // Google Analytics
  googleAnalytics: {
    measurementId: 'G-GGCMPXN113',
    // This should be configured in GTM with the following code:
    // gtag('config', 'G-GGCMPXN113');
  },

  // LinkedIn Insight Tag
  linkedin: {
    partnerId: '8621049',
    // This should be configured in GTM with the following code:
    // _linkedin_partner_id = "8621049";
    // window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    // window._linkedin_data_partner_ids.push(_linkedin_partner_id);
  },

  // Meta Pixel (Facebook)
  metaPixel: {
    pixelId: '609093465218163',
    // This should be configured in GTM with the following code:
    // fbq('init', '609093465218163');
    // fbq('track', 'PageView');
  },

  // Pinterest Pixel
  pinterest: {
    tagId: '2613630897052',
    // This should be configured in GTM with Pinterest Pixel code
  },

  // Google Tag Manager
  gtm: {
    containerId: 'GTM-PPD9QB75',
    // Already implemented in _document.tsx
  }
};

/**
 * GTM Setup Instructions:
 * 
 * 1. Google Analytics (GA4):
 *    - Create a new tag in GTM
 *    - Tag Type: Google Analytics: GA4 Configuration
 *    - Measurement ID: G-GGCMPXN113
 *    - Trigger: All Pages
 * 
 * 2. LinkedIn Insight Tag:
 *    - Create a new tag in GTM
 *    - Tag Type: Custom HTML
 *    - HTML: LinkedIn Insight Tag code with partner ID 8621049
 *    - Trigger: All Pages
 * 
 * 3. Meta Pixel:
 *    - Create a new tag in GTM
 *    - Tag Type: Custom HTML
 *    - HTML: Meta Pixel code with ID 609093465218163
 *    - Trigger: All Pages
 * 
 * 4. Pinterest Pixel:
 *    - Create a new tag in GTM
 *    - Tag Type: Pinterest Tag
 *    - Tag ID: 2613630897052
 *    - Trigger: All Pages
 * 
 * 5. Google Search Console:
 *    - Add TXT record to DNS: google-site-verification=cZr8Sh8pJdhX8zfm2BpUIHYbZr7rNE_6GoiCYif-Lsk
 *    - This needs to be done at the DNS provider level, not in the code
 */

export default trackingConfig;
