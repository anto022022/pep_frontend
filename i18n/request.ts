import { getRequestConfig } from "next-intl/server";
import { Locale, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const loginPage = (await import(`@/messages/${locale}/auth/loginPage.json`)).default;
  const dynamicOtp = (await import(`@/messages/${locale}/auth/dynamicOtp.json`)).default;
  const userVerification = (await import(`@/messages/${locale}/auth/userVerification.json`)).default
  const businessDetails = (await import(`@/messages/${locale}/onboarding/businessDetails.json`)).default
  const personalInformation = (await import(`@/messages/${locale}/onboarding/personalInformation.json`)).default
  const businessOperation = (await import(`@/messages/${locale}/onboarding/businessOperation.json`)).default
  const contactInformation = (await import(`@/messages/${locale}/onboarding/contactInformation.json`)).default
  const compliance = (await import(`@/messages/${locale}/onboarding/compliance.json`)).default
  const businessRepresentative = (await import(`@/messages/${locale}/onboarding/businessRepresentative.json`)).default
  const userType = (await import(`@/messages/${locale}/onboarding/userType.json`)).default
  const salesProduct = (await import(`@/messages/${locale}/sales/salesProduct.json`)).default
  const salesOffer = (
    await import(`@/messages/${locale}/sales/salesOffer.json`)
  ).default;
  const common = (
    await import(`@/messages/${locale}/common.json`)
  ).default;
  const categoryPage = (await import(`@/messages/${locale}/market/categoryPage.json`)).default;
  const rfq = (await import(`@/messages/${locale}/sales/rfq.json`)).default
  const leads = (await import(`@/messages/${locale}/sales/leads.json`)).default
  const contact = (await import(`@/messages/${locale}/sales/contact.json`)).default
  const businessProfile = (await import(`@/messages/${locale}/businessProfile/businessProfile.json`)).default;
  const accountSettings = (await import(`@/messages/${locale}/accountSettings/accountSettings.json`)).default;
  const profileSettings = (await import(`@/messages/${locale}/profileSettings/profileSettings.json`)).default;
  const settings = (await import(`@/messages/${locale}/settings/settings.json`)).default
  const userAdminDashboard = (await import(`@/messages/${locale}/dashboard/userAdminDashboard.json`)).default;
  const home = (await import(`@/messages/${locale}/home.json`)).default;


  const productDetailPage = (
    await import(`@/messages/${locale}/market/productDetailPage.json`)
  ).default;
  const salesConnect = (await import(`@/messages/${locale}/sales/salesConnect.json`)).default
  const pricing = (await import(`@/messages/${locale}/pricing.json`)).default
  return {
    locale,
    messages: {
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
      common,
      salesOffer,
      categoryPage,
      rfq,
      leads,
      contact,
      productDetailPage,
      salesConnect,
      businessProfile,
      accountSettings,
      profileSettings,
      settings,
      userAdminDashboard,
      home,
      pricing
    },
  };
});
