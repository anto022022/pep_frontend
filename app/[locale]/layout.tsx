// import { Geist, Geist_Mono } from "next/font/google";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-phone-input-2/lib/style.css";
import "../../app/[locale]/(static_pages)/(assets)/assets/css/style.css";
import "../../assets/css/final-styles.css";
import "../../assets/scss/main.css";
import "../../assets/scss/nav-style.css";
import "./globals.css";
import "./not-found-page.css";
import "./settings.css";
// import "../../assets/scss/d_styles.scss";
import { PrimeReactProvider } from "primereact/api";
import { ReduxProviders } from "./_store/provider";
// import "../assets/scss/temp_styles.scss";
import ClientReduxInitializer from "@/app/[locale]/_components/Common/ClientReduxInitializer";
import Initializer from "@/app/[locale]/_components/Common/Initializer";
import ToastPop from "@/app/[locale]/_components/Common/ToastPop";
import CookieConsent from "@/app/[locale]/_components/CookieConsent";
import HtmlAttributes from "@/app/[locale]/_components/HtmlAttributes";
import { Locale, routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Script from "next/script";
// Location detection handled in middleware

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Pepagora User Admin",
//   description: "Pepagora User Admin B2B",
// };
// const messages = await getMessages();

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  // const { locale } = await params;
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Location detection is handled in middleware
  let messages: Record<string, any> = {};
  try {
    const loginPage = (await import(`@/messages/${locale}/auth/loginPage.json`))
      .default;
    const dynamicOtp = (
      await import(`@/messages/${locale}/auth/dynamicOtp.json`)
    ).default;
    const userVerification = (
      await import(`@/messages/${locale}/auth/userVerification.json`)
    ).default;
    const businessDetails = (
      await import(`@/messages/${locale}/onboarding/businessDetails.json`)
    ).default;
    const personalInformation = (
      await import(`@/messages/${locale}/onboarding/personalInformation.json`)
    ).default;
    const businessOperation = (
      await import(`@/messages/${locale}/onboarding/businessOperation.json`)
    ).default;
    const contactInformation = (
      await import(`@/messages/${locale}/onboarding/contactInformation.json`)
    ).default;
    const compliance = (
      await import(`@/messages/${locale}/onboarding/compliance.json`)
    ).default;
    const businessRepresentative = (
      await import(
        `@/messages/${locale}/onboarding/businessRepresentative.json`
      )
    ).default;
    const userType = (
      await import(`@/messages/${locale}/onboarding/userType.json`)
    ).default;
    const salesProduct = (
      await import(`@/messages/${locale}/sales/salesProduct.json`)
    ).default;
    const salesOffer = (
      await import(`@/messages/${locale}/sales/salesOffer.json`)
    ).default;
    const common = (await import(`@/messages/${locale}/common.json`)).default;

    const categoryPage = (
      await import(`@/messages/${locale}/market/categoryPage.json`)
    ).default;
    const rfq = (await import(`@/messages/${locale}/sales/rfq.json`)).default;
    const leads = (await import(`@/messages/${locale}/sales/leads.json`))
      .default;
    const contact = (await import(`@/messages/${locale}/sales/contact.json`))
      .default;

    const productDetailPage = (
      await import(`@/messages/${locale}/market/productDetailPage.json`)
    ).default;
    const salesConnect = (
      await import(`@/messages/${locale}/sales/salesConnect.json`)
    ).default;
    const businessProfile = (
      await import(`@/messages/${locale}/businessProfile/businessProfile.json`)
    ).default;
    const accountSettings = (
      await import(`@/messages/${locale}/accountSettings/accountSettings.json`)
    ).default;
    const freeCatalog = (
      await import(`@/messages/${locale}/catalog/freeCatalog.json`)
    ).default;
    const profileSettings = (
      await import(`@/messages/${locale}/profileSettings/profileSettings.json`)
    ).default;
    const settings = (
      await import(`@/messages/${locale}/settings/settings.json`)
    ).default;
    const userAdminDashboard = (
      await import(`@/messages/${locale}/dashboard/userAdminDashboard.json`)
    ).default;
    const home = (await import(`@/messages/${locale}/home.json`)).default;
    const pricing = (await import(`@/messages/${locale}/pricing.json`)).default;
    messages = {
      loginPage,
      dynamicOtp,
      userVerification,
      businessDetails,
      personalInformation,
      businessOperation,
      contactInformation,
      compliance,
      businessRepresentative,
      userType,
      salesProduct,
      salesOffer,
      common,
      categoryPage,
      rfq,
      leads,
      contact,
      productDetailPage,
      salesConnect,
      businessProfile,
      accountSettings,
      freeCatalog,
      profileSettings,
      settings,
      userAdminDashboard,
      home,
      pricing,
    };
  } catch (e) {
    console.log(e);
    notFound();
  }

  return (
    // lang="en" dir={`${locale == "ar" ? "rtl" : "ltr"}`}
    <html>
      <head>
        <meta name="theme-color" content="#171A1C" />
        <meta
          name="permissions-policy"
          content="camera=*, microphone=*, geolocation=*"
        />
        {/* <meta http-equiv="Permissions-Policy" content="camera=*, microphone=*, geolocation=*" /> */}
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=*, microphone=*, geolocation=*"
        />

        {/* Tracking bots config */}

        {/* Verification meta tags */}
        <meta
          name="facebook-domain-verification"
          content="2k1e6vj2qn9iwsm9wvk4jghmnppt59"
        />
        <meta
          name="p:domain_verify"
          content="aab6720dc425babff57ca0e7788f401f"
        />
        <meta
          name="google-site-verification"
          content="cZr8Sh8pJdhX8zfm2BpUIHYbZr7rNE_6GoiCYif-Lsk"
        />

        {/* Preconnect / dns-prefetch for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.clarity.ms" />

        {/* Google tag (gtag.js) - Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GGCMPXN113"
          strategy="afterInteractive"
        />
        <Script id="gtag-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GGCMPXN113');
          `}
        </Script>

        {/* Meta Pixel (Facebook) */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '609093465218163');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "spgliumyeo");
          `}
        </Script>

        {/* LinkedIn Insight (we will add via GTM later but keep here for now if needed) */}
        <Script id="linkedin" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "8621049";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>

        {/* affiliate pepagora  */}
        <Script id="affiliatePepagora " strategy="afterInteractive">
          {`function() {
          var gs = document.createElement('script');
          gs.src = 'https://affiliate.pepagora.com/pr/js[';gs.type]
          (https://affiliate.pepagora.com/pr/js';gs.type) = 'text/javascript';
          gs.async = 'true';
          gs.onload = gs.onreadystatechange = function() 
          {var rs = this.readyState;
          if (rs && rs != 'complete' && rs != 'loaded') return;
          try {growsumo._initialize('pk_DjYzpwlLkyz74h2jmoMsX2d5wql5aj8k');
          if (typeof(growsumoInit) === 'function') {growsumoInit();}} 
          catch (e) {}};
          var s =document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(gs, s);
          })();`}
        </Script>

        {/* partnerStack */}
        <Script id="partnerStack" strategy="afterInteractive">
          {`function() {
          var gs = document.createElement('script');
          gs.src = 'https://js.partnerstack.com/v1/';gs.type = 'text/javascript';
          gs.async = 'true';
          gs.onload = gs.onreadystatechange = function() {var rs = this.readyState;
          if (rs && rs != 'complete' && rs != 'loaded') return;
          try {growsumo._initialize('pk_public_key');
          if (typeof(growsumoInit) === 'function') {growsumoInit();}}
          catch (e) {}};var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(gs, s);
          })();`}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) - must appear immediately after <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PPD9QB75"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Tag Manager (head script) - dataLayer + gtm.js */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PPD9QB75');
          `}
        </Script>
        {/* // <> */}
        <HtmlAttributes locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <ReduxProviders>
            <CookieConsent />
            <ClientReduxInitializer />

            <PrimeReactProvider value={{ ripple: true }}>
              <ToastPop />
              {/* Initializing data Component */}
              <Initializer />
              {children}
            </PrimeReactProvider>
            {/*  */}
          </ReduxProviders>
        </NextIntlClientProvider>

        {/* LinkedIn noscript pixel (optional fallback) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=8621049&fmt=gif"
          />
        </noscript>

        {/* Facebook noscript fallback (optional) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=609093465218163&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
