type ContactPointType = {
    "@type": "ContactPoint",
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string;
};

interface HomePageSchemaInterface {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
    contactPoint: ContactPointType
}


export const HomePageSchema: HomePageSchemaInterface = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pepagora",
    "url": "https://www.pepagora.com",
    "logo": "https://www.pepagora.com/logo.png",
    "sameAs": [
        "https://www.facebook.com/pepagora",
        "https://x.com/pepagora"
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-1234567890",
        "contactType": "Customer Service",
        "areaServed": "IN",
        "availableLanguage": "English"
    }
};