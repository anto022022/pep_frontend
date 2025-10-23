"use client";
import LanguageLinks from "@/app/[locale]/(static_pages)/_components/LanguageLinks";
import {
  useGetCategoryHomeQuery,
  useNewsletterSubscribeMutation,
} from "@/app/[locale]/_store/apiReducer/commonApi";
import facebook from "@/public/img/static-site/Icons/Facebook.svg";
import instagram from "@/public/img/static-site/Icons/Instagram.svg";
import linkedin from "@/public/img/static-site/Icons/LinkedIn.svg";
import twitter from "@/public/img/static-site/Icons/Twitter.svg";
import youtube from "@/public/img/static-site/Icons/YouTube.svg";
import isolateLogo from "@/public/img/static-site/Isolation_Mode-logo.png";
import PepLogo from "@/public/img/static-site/pepagora-logo.svg";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CloseIcon, FooterActionIcon } from "../Icons/SVGIcons";

const FooterPage = () => {
  const t = useTranslations("home");
  const { data: categories } = useGetCategoryHomeQuery();

  // Create a mapping function to get liveUrl by category name
  const getLiveUrlByName = (categoryName: string) => {
    if (!categories?.data) return "";

    const category = categories.data.find((cat) =>
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );

    return category ? category.liveUrl : "";
  };
  // Map category names to their corresponding liveUrl for footer
  const footerCategoryUrls = {
    apparel: getLiveUrlByName("Apparel & Fashion"),
    industrial: getLiveUrlByName("Industrial Equipment & Machinery"),
    home: getLiveUrlByName("Home & Lifestyle"),
    health: getLiveUrlByName("Health & Personal Care"),
    food: getLiveUrlByName("Food & Agriculture"),
    construction: getLiveUrlByName("Construction"),
    electronics: getLiveUrlByName("Electronics & Electrical"),
    automotive: getLiveUrlByName("Automotive & Transport"),
    raw: getLiveUrlByName("Raw Materials & Chemicals"),
    sports: getLiveUrlByName("Sports & Entertainment"),
    tools: getLiveUrlByName("Tools & Hardware"),
    packaging: getLiveUrlByName("Packaging & Printing"),
    office: getLiveUrlByName("Office Supplies & Equipment"),
    services: getLiveUrlByName("Services & Support"),
  };

  const ActionCard = ({
    title,
    subtitle,
    buttonText,
    buttonHref,
    buttonClassName = "p-btn-comp p-btn-primary p-btn-rounded p-btn-md",
    className = "action-cards a-c-primary",
    showIcon = false,
  }) => {
    return (
      <div className={className}>
        <div className="a-c-text">
          <div className="a-c-t-label">{title}</div>
          <div className="a-c-t-title">{subtitle}</div>
        </div>
        <Link href={buttonHref} className={buttonClassName}>
          <span className="b-c-txt">{buttonText}</span>
        </Link>
        {showIcon && <FooterActionIcon />}
      </div>
    );
  };

  // FooterSection.jsx - Reusable footer section component
  const FooterSection = ({
    title,
    links,
    badge,
    isPricing = false,
  }: {
    title: string;
    links?: any;
    badge?: string;
    isPricing?: boolean;
  }) => {
    return (
      <div className="f-s-d-r-item">
        <div className="f-s-d-r-i-title">
          {isPricing ? (
            <Link href="/pricing">
              <span className="f-s-d-r-i-title footer-title-bold">{title}</span>
              {badge && (
                <div className="p-badge p-badge-primary">
                  <span>{badge}</span>
                </div>
              )}
            </Link>
          ) : (
            <>
                        <Link href="/pricing">

              <span className="f-s-d-r-i-title footer-title-bold">{title}</span>
              {badge && (
                <div className="p-badge p-badge-primary">
                  <span>{badge}</span>
                </div>
              )} 
              </Link>
            </>
          )}
        </div>
        {links && (
          <div className="list-link">
            {links.map((link, index) => (
              <Link key={index} href={link.href}>
                {link.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  //FooterSections.jsx - Reusable footer section component for trust center
  const FooterSections = ({
    title,
    links,
    badge,
    titleLink = "/s/trust",
  }: {
    title: string;
    links?: { href: string; text: string }[];
    badge?: string;
    titleLink?: string;
  }) => {
    return (
      <div className="f-s-d-r-item">
        <div className="f-s-d-r-i-title">
          <Link href={titleLink}>
            <span className="f-s-d-r-i-title footer-title-bold">{title}</span>
            {badge && (
              <div className="p-badge p-badge-primary">
                <span>{badge}</span>
              </div>
            )}
          </Link>
        </div>

        {links && (
          <div className="list-link">
            {links.map((link, index) => (
              <Link key={index} href={link.href}>
                {link.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };
  // AccordionItem.jsx - Reusable accordion item component
  const AccordionItem = ({
    id,
    title,
    children,
    isExpanded = false,
  }: {
    id: string;
    title: string;
    children: any;
    isExpanded?: boolean;
  }) => {
    return (
      <div className="accordion-item">
        <h2 className="accordion-header" id={`heading${id}`}>
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse${id}`}
            aria-expanded={isExpanded}
            aria-controls={`collapse${id}`}
          >
            <span>{title}</span>
            <span className="material-symbols-rounded">
              {/* This would need to be passed from t function */}
              add
            </span>
          </button>
        </h2>
        <div
          id={`collapse${id}`}
          className="accordion-collapse collapse"
          aria-labelledby={`heading${id}`}
          data-bs-parent="#footerAccordion"
        >
          <div className="accordion-body">
            <div className="f-s-d-r-item-group">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  // SocialMediaLinks.jsx - Reusable social media component
  const SocialMediaLinks = ({ socialLinks }: { socialLinks: any }) => {
    return (
      <div className="f-s-b-t-l-top">
        {socialLinks.map((social, index) => (
          <Link key={index} href={social.url} target="_blank">
            <Image width={32} height={32} src={social.icon} alt={social.name} />
          </Link>
        ))}
      </div>
    );
  };

  // NewsletterForm.jsx - Reusable newsletter component
  const NewsletterForm = ({
    title,
    placeholder,
    buttonText,
  }: {
    title: string;
    placeholder: string;
    buttonText: string;
  }) => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">(
      ""
    );
    const [newsletterSubscribe] = useNewsletterSubscribeMutation();
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email) {
        setMessage("Please enter your email address");
        setMessageType("error");
        return;
      }

      if (!email.includes("@")) {
        setMessage("Please enter a valid email address");
        setMessageType("error");
        return;
      }

      setIsSubmitting(true);
      setMessage("");

      try {
        // You can replace this with your actual API endpoint
        const response = await newsletterSubscribe({ email }).unwrap();

        if (response.ok) {
          setMessage("Thank you for subscribing to our newsletter!");
          setMessageType("success");
          setEmail("");
        } else {
          const errorData = await response.json();
          setMessage(
            errorData.message || "Failed to subscribe. Please try again."
          );
          setMessageType("error");
        }
      } catch (error) {
        setMessage("Something went wrong. Please try again later.");
        setMessageType("error");
      } finally {
        setIsSubmitting(false);
      }
    };

    const clearMessage = () => {
      setMessage("");
      setMessageType("");
    };

    return (
      <div className="f-s-b-t-right">
        <div className="f-s-b-t-r-label">{title}</div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (message) clearMessage();
            }}
            required
          />
          <button
            type="submit"
            className="p-btn-comp p-btn-tertiary p-btn-rounded p-btn-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : buttonText}
          </button>
        </form>
        {message && (
          <div className={`newsletter-message ${messageType}`}>
            {message}
            <CloseIcon onClick={clearMessage} className="message-close" />
          </div>
        )}
      </div>
    );
  };

  // Main optimized Footer component
  const Footer = ({
    t,
    isolateLogo,
    PepLogo,
    footerCategoryUrls,
  }: {
    t: any;
    isolateLogo: any;
    PepLogo: any;
    footerCategoryUrls: any;
  }) => {
    // Configuration objects for better maintainability
    const socialMediaLinks = [
      {
        name: "Facebook",
        url: "https://www.facebook.com/pepagora",
        icon: facebook,
      },
      { name: "Twitter", url: "https://x.com/Pepagora", icon: twitter },
      {
        name: "YouTube",
        url: "https://www.youtube.com/@pepagora",
        icon: youtube,
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/pepagora",
        icon: instagram,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/company/pepagora",
        icon: linkedin,
      },
    ];

    const getToKnowUsLinks = [
      { href: "/s/about-us", text: t("footer.sections.getToKnowUs.links.ab1") },
      {
        href: "/s/leadership",
        text: t("footer.sections.getToKnowUs.links.ab2"),
      },
      { href: "/s/impact", text: t("footer.sections.getToKnowUs.links.ab3") },
      {
        href: "/s/partnership",
        text: t("footer.sections.getToKnowUs.links.ab8"),
      },
      {
        href: "/s/contact-us",
        text: t("footer.sections.getToKnowUs.links.ab7"),
      },
    ];

    const industriesLinks = [
      {
        href: `/c/${footerCategoryUrls.apparel}`,
        text: t("footer.sections.industries.links.in1"),
      },
      {
        href: `/c/${footerCategoryUrls.industrial}`,
        text: t("footer.sections.industries.links.in2"),
      },
      {
        href: `/c/${footerCategoryUrls.home}`,
        text: t("footer.sections.industries.links.in3"),
      },
      {
        href: `/c/${footerCategoryUrls.health}`,
        text: t("footer.sections.industries.links.in4"),
      },
      {
        href: `/c/${footerCategoryUrls.food}`,
        text: t("footer.sections.industries.links.in5"),
      },
      {
        href: `/c/${footerCategoryUrls.construction}`,
        text: t("footer.sections.industries.links.in6"),
      },
      {
        href: `/c/${footerCategoryUrls.electronics}`,
        text: t("footer.sections.industries.links.in7"),
      },
      {
        href: `/c/${footerCategoryUrls.automotive}`,
        text: t("footer.sections.industries.links.in8"),
      },
      {
        href: `/c/${footerCategoryUrls.raw}`,
        text: t("footer.sections.industries.links.in9"),
      },
      {
        href: `/c/${footerCategoryUrls.sports}`,
        text: t("footer.sections.industries.links.in10"),
      },
      {
        href: `/c/${footerCategoryUrls.tools}`,
        text: t("footer.sections.industries.links.in11"),
      },
      {
        href: `/c/${footerCategoryUrls.packaging}`,
        text: t("footer.sections.industries.links.in12"),
      },
      {
        href: `/c/${footerCategoryUrls.office}`,
        text: t("footer.sections.industries.links.in13"),
      },
      {
        href: `/c/${footerCategoryUrls.services}`,
        text: t("footer.sections.industries.links.in14"),
      },
    ];

    const businessToolsLinks = [
      {
        href: "/app/sales-sell-offer",
        text: t("footer.sections.businessTools.links.bl1"),
      },
      {
        href: "/app/catalog",
        text: t("footer.sections.businessTools.links.bl2"),
      },
      {
        href: "/app/leads",
        text: t("footer.sections.businessTools.links.bl3"),
      },
      {
        href: "/app/sales-connect",
        text: t("footer.sections.businessTools.links.bl4"),
      },
      {
        href: "/app/sourcing-rfq",
        text: t("footer.sections.businessTools.links.bl5"),
      },
      {
        href: "/app/settings/account-settings",
        text: t("footer.sections.businessTools.links.b17"),
      },
    ];

    const helpLegalLinks = [
      { href: "/s/contact-us", text: t("footer.sections.helpLegal.links.hl1") },
      // { href: "/s/faq", text: t("footer.sections.helpLegal.links.hl2") },
      {
        href: "/s/cancellation",
        text: t("footer.sections.helpLegal.links.hl3"),
      },
      {
        href: "/s/legal#privacy-policy",
        text: t("footer.sections.helpLegal.links.hl4"),
      },
      {
        href: "/s/legal#privacy-policy",
        text: t("footer.sections.helpLegal.links.hl5"),
      },
    ];

    const blogLinks = [
      {
        href: "https://blog.pepagora.com/",
        text: `Pepagora ${t("footer.sections.getToKnowUs.links.ab9")}`,
      },
    ];
    return (
      <footer className="footer-section">
        <div className="container-fluid">
          <div className="f-s-details">
            <div className="d-flex-767">
              <Image
                width={185}
                height={36}
                src={isolateLogo}
                alt="Isolation_Mode-logo"
                className="img-fluid"
              />
            </div>

            <div className="f-s-d-left">
              <ActionCard
                title={t("footer.company.title")}
                subtitle={t("footer.company.subtitle")}
                buttonText={t("footer.company.button")}
                buttonHref="/authenticate"
                showIcon={true}
              />

              <ActionCard
                title={t("footer.source.title")}
                subtitle={t("footer.source.subtitle")}
                buttonText={t("footer.source.button")}
                buttonHref="/app/sourcing-rfq"
                buttonClassName="p-btn-comp p-btn-secoundary p-btn-rounded p-btn-md"
                className="action-cards a-c-secoundary"
              />
            </div>

            <div className="f-s-d-rigth d-none-767">
              <div className="f-s-d-r-item-group">
                <FooterSection
                  title={t("footer.sections.getToKnowUs.title")}
                  links={getToKnowUsLinks}
                />
                <FooterSections
                  title={t("footer.sections.trustCenter.title")}
                  titleLink={"/s/trust"}
                />
                <FooterSections
                  title={t("footer.sections.blog.title")}
                  titleLink={blogLinks[0].href}
                />
              </div>

              <div className="f-s-d-r-item-group">
                <FooterSection
                  title={t("footer.sections.industries.title")}
                  links={industriesLinks}
                />
              </div>

              <div className="f-s-d-r-item-group">
                <FooterSection
                  title={t("footer.sections.businessTools.title")}
                  links={businessToolsLinks}
                />
              </div>

              <div className="f-s-d-r-item-group">
                <FooterSection
                  title={t("footer.sections.pricing.title")}
                  badge={t("footer.sections.pricing.badge")}
                  isPricing={true}
                />
                <FooterSection
                  title={t("footer.sections.helpLegal.title")}
                  links={helpLegalLinks}
                />
              </div>
            </div>

            {/* Mobile Accordion */}
            <div
              className="accordion d-flex-767 accordion-plus"
              id="footerAccordion"
            >
              <AccordionItem
                id="Company"
                title={t("footer.sections.getToKnowUs.title")}
              >
                <FooterSection
                  title={t("footer.sections.getToKnowUs.title")}
                  links={getToKnowUsLinks}
                />
                <FooterSections
                  title={t("footer.sections.trustCenter.title")}
                  titleLink={"/s/trust"}
                />
                <FooterSection
                  title={t("footer.sections.blog.title")}
                  links={blogLinks}
                />
              </AccordionItem>

              <AccordionItem
                id="Industries"
                title={t("footer.sections.industries.title")}
              >
                <FooterSection
                  title={t("footer.sections.industries.title")}
                  links={industriesLinks}
                />
              </AccordionItem>

              <AccordionItem
                id="Support"
                title={t("footer.sections.helpLegal.title")}
              >
                <FooterSection
                  title={t("footer.sections.pricing.title")}
                  badge={t("footer.sections.pricing.badge")}
                />
                <FooterSection
                  title={t("footer.sections.helpLegal.title")}
                  links={helpLegalLinks}
                />
              </AccordionItem>

              <AccordionItem
                id="Solutions"
                title={t("footer.sections.businessTools.title")}
              >
                <FooterSection
                  title={t("footer.sections.businessTools.title")}
                  links={businessToolsLinks}
                />
              </AccordionItem>
            </div>
          </div>

          <div className="f-s-bottom">
            <div className="f-s-b-top">
              <div className="f-s-b-t-left">
                <SocialMediaLinks socialLinks={socialMediaLinks} />
              </div>
              <div className="f-s-middle d-none-767">
                <div className="logo-block">
                  <Image
                    width={413}
                    height={80}
                    src={PepLogo}
                    alt="pepagora-logo"
                    className="img-fluid"
                  />
                </div>
              </div>
              {/* <NewsletterForm
                title={t("footer.newsletter.title")}
                placeholder={t("footer.newsletter.placeholder")}
                buttonText={t("footer.newsletter.button")}
              /> */}
            </div>

            <div className="f-s-b-bottom">
              <div className="f-s-b-b-left">
                {/* <div className="dropdown d-small d-top-left">
                  <LanguageSelectInputs />
                </div> */}
                <div className="f-s-b-t-l-bottom">
                  <div className="f-s-b-t-label-links-group">
                    <div className="f-s-b-t-l-l-label">
                      {t("footer.globalSites.title")}
                    </div>
                    <LanguageLinks className="f-s-b-t-l-l-actions" />
                  </div>
                </div>
              </div>

              <div className="f-s-b-b-right">{t("footer.copyright")}</div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  return (
    <Footer
      t={t}
      isolateLogo={isolateLogo}
      PepLogo={PepLogo}
      footerCategoryUrls={footerCategoryUrls}
    />
  );
};

export default FooterPage;
