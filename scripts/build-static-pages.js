const fs = require('fs');
const path = require('path');

// Configuration for each static page
const pagesConfig = {
    'legal.html': {
        title: 'Legal',
        description: 'Privacy Policy, Terms of Service, and other legal documents for Pepagora',
        keywords: 'privacy policy, terms of service, legal, pepagora',
        bodyClass: 'legal',
        css: 'legal/custom.css'
    },
    'about-us.html': {
        title: 'About Us',
        description: 'Learn about Pepagora - your trusted B2B marketplace for global trade',
        keywords: 'about pepagora, company, B2B marketplace, global trade',
        bodyClass: 'about',
        css: 'custom.css'
    },
    'contact-us.html': {
        title: 'Contact Us',
        description: 'Get in touch with Pepagora for support, partnerships, and inquiries',
        keywords: 'contact pepagora, support, customer service, help',
        bodyClass: 'contact',
        css: 'contact-us.css'
    },
    'leadership.html': {
        title: 'Leadership',
        description: 'Meet the leadership team and advisors behind Pepagora',
        keywords: 'leadership, team, advisors, pepagora executives',
        bodyClass: 'leadership',
        css: 'leadership.css'
    },
    'partnership.html': {
        title: 'Partnership',
        description: 'Partner with Pepagora to grow your business globally',
        keywords: 'partnership, business partnership, pepagora partners',
        bodyClass: 'partnership',
        css: 'custom.css'
    },
    'pricing.html': {
        title: 'Pricing',
        description: 'Transparent pricing plans for Pepagora B2B marketplace services',
        keywords: 'pricing, plans, subscription, pepagora cost',
        bodyClass: 'pricing',
        css: 'pricing.css'
    },
    'trust.html': {
        title: 'Trust Center',
        description: 'Security, compliance, and trust information for Pepagora users',
        keywords: 'trust, security, compliance, data protection',
        bodyClass: 'trust',
        css: 'custom.css'
    },
    'impact.html': {
        title: 'Impact',
        description: 'Pepagora\'s impact on global trade and business growth',
        keywords: 'impact, global trade, business growth, sustainability',
        bodyClass: 'impact',
        css: 'impact/custom.css'
    }
};

// Function to extract content between body tags
function extractBodyContent(htmlContent) {
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        let bodyContent = bodyMatch[1];

        // Remove the header and footer sections from the original content
        bodyContent = bodyContent.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
        bodyContent = bodyContent.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

        // Remove any existing dynamic header/footer divs
        bodyContent = bodyContent.replace(/<div[^>]*id="dynamic-header"[^>]*>[\s\S]*?<\/div>/gi, '');
        bodyContent = bodyContent.replace(/<div[^>]*id="dynamic-footer"[^>]*>[\s\S]*?<\/div>/gi, '');

        // Remove any script tags that load header/footer
        bodyContent = bodyContent.replace(/<script>[\s\S]*?loadHeader[\s\S]*?<\/script>/gi, '');
        bodyContent = bodyContent.replace(/<script>[\s\S]*?loadFooter[\s\S]*?<\/script>/gi, '');

        return bodyContent.trim();
    }
    return '';
}

// Function to extract page-specific scripts
function extractPageScripts(htmlContent) {
    const scriptMatches = htmlContent.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
    if (scriptMatches) {
        return scriptMatches
            .filter(script =>
                !script.includes('loadHeader') &&
                !script.includes('loadFooter') &&
                !script.includes('DOMContentLoaded')
            )
            .join('\n');
    }
    return '';
}

// Function to build a single page
function buildPage(pageName, config) {
    const inputPath = path.join(__dirname, '..', 'static-pages', pageName);
    const outputPath = path.join(__dirname, '..', 'static-pages', pageName);
    const layoutPath = path.join(__dirname, '..', 'static-pages', 'layout.html');

    try {
        // Read the original page content
        const originalContent = fs.readFileSync(inputPath, 'utf8');

        // Read the layout template
        const layoutTemplate = fs.readFileSync(layoutPath, 'utf8');

        // Extract content and scripts from original page
        const pageContent = extractBodyContent(originalContent);
        const pageScripts = extractPageScripts(originalContent);

        // Replace placeholders in layout template
        let finalContent = layoutTemplate
            .replace(/\{\{PAGE_TITLE\}\}/g, config.title)
            .replace(/\{\{PAGE_DESCRIPTION\}\}/g, config.description)
            .replace(/\{\{PAGE_KEYWORDS\}\}/g, config.keywords)
            .replace(/\{\{PAGE_BODY_CLASS\}\}/g, config.bodyClass)
            .replace(/\{\{PAGE_CSS\}\}/g, config.css)
            .replace(/\{\{PAGE_CONTENT\}\}/g, pageContent)
            .replace(/\{\{PAGE_SCRIPTS\}\}/g, pageScripts);

        // Write the final page
        fs.writeFileSync(outputPath, finalContent, 'utf8');

    } catch (error) {
        console.error(`❌ Error building ${pageName}:`, error.message);
    }
}

// Main build function
function buildAllPages() {
    Object.entries(pagesConfig).forEach(([pageName, config]) => {
        buildPage(pageName, config);
    });
}

// Run the build
if (require.main === module) {
    buildAllPages();
}

module.exports = { buildAllPages, buildPage };
