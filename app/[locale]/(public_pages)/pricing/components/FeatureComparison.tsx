"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CountryCode } from "../types";

export default function FeatureComparison() {
  const t = useTranslations("pricing.featureComparison");
  const [showComparison, setShowComparison] = useState(false);
  const [showMobileComparison, setShowMobileComparison] = useState(false);
  const [countryCode, setCountryCode] = useState<string>("");

  useEffect(() => {
    // Get country code from cookie
    const getCookie = (name: string) => {
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      return match ? match[2] : null;
    };

    const country = getCookie("countryCode") || "IN";
    setCountryCode(country as CountryCode);
  }, []);

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  const toggleMobileComparison = () => {
    setShowMobileComparison(!showMobileComparison);
  };

  return (
    <>
      {/* Desktop Feature Comparison */}
      <section className="feature-comparison-wrapper">
        <div className="toggle-btn-wrapper">
          <button
            className={`toggle-btn ${showComparison ? "hidden" : ""}`}
            onClick={toggleComparison}
          >
            <span className="plus-icon">+</span> {t("toggleButton")}
          </button>
        </div>

        <div
          className={`feature-comparison-container ${
            showComparison ? "show" : ""
          }`}
        >
          <h2 className="feature-title">
            {t("title")}{" "}
            <span className="highlight">{t("titleHighlight")}</span>
          </h2>

          <div className="comparison-table-wrapper">
            <table
              className="comparison-table"
              style={{ width: "100%", tableLayout: "fixed" }}
            >
              <thead>
                <tr>
                  <th></th>
                  <th style={{ fontSize: "28px", fontWeight: 600 }}>
                    {t("table.headers.free")}
                  </th>
                  <th style={{ fontSize: "28px", fontWeight: 600 }}>
                    {t("table.headers.explore")}
                  </th>
                  <th style={{ fontSize: "28px", fontWeight: 600 }}>
                    {t("table.headers.grow")}
                  </th>
                  <th
                    style={{
                      fontSize: "28px",
                      fontWeight: 600,
                      background: "#fff3f3",
                    }}
                  >
                    {t("table.headers.scale")}
                  </th>
                  <th style={{ fontSize: "28px", fontWeight: 600 }}>
                    {t("table.headers.global")}
                  </th>
                  <th style={{ fontSize: "28px", fontWeight: 600 }}>
                    {t("table.headers.enterprise")}
                  </th>
                </tr>
              </thead>
              <tbody className="table-radius">
                {/* Pricing */}
                <tr className="section-header">
                  <td colSpan={7}>
                    <div className="section-header-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          d="M12 21.5C16.9706 21.5 21 17.4706 21 12.5C21 7.52944 16.9706 3.5 12 3.5M12 21.5C7.02944 21.5 3 17.4706 3 12.5C3 7.52944 7.02944 3.5 12 3.5M12 21.5C9.82538 21.5 8.0625 17.4706 8.0625 12.5C8.0625 7.52944 9.82538 3.5 12 3.5M12 21.5C14.1746 21.5 15.9375 17.4706 15.9375 12.5C15.9375 7.52944 14.1746 3.5 12 3.5M4.6875 16.8744C6.33632 15.9302 9.07573 15.3125 12.1764 15.3125C15.4124 15.3125 18.255 15.9854 19.875 17M4.6875 8.12558C6.33632 9.06975 9.07573 9.6875 12.1764 9.6875C15.4124 9.6875 18.255 9.0146 19.875 8"
                          stroke="#D92D27"
                          strokeWidth="2"
                        />
                      </svg>
                      <span>{t("table.sections.pricing.title")}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Annual Plan ({countryCode === "IN" ? "INR" : "USD"})</td>
                  <td>{countryCode === "IN" ? "₹0" : "$0"}</td>
                  <td>{countryCode === "IN" ? "₹5,999" : "$84"}</td>
                  <td>{countryCode === "IN" ? "₹29,999" : "$588"}</td>
                  <td style={{ background: "#fff3f3" }}>
                    {countryCode === "IN" ? "₹49,999" : "$1,788"}
                  </td>
                  <td>{countryCode === "IN" ? "₹99,999" : "$4,788"}</td>
                  <td>{t("table.sections.pricing.enterprise")}</td>
                </tr>
                <tr>
                  <td>Monthly Plan ({countryCode === "IN" ? "INR" : "USD"})</td>
                  <td>{countryCode === "IN" ? "₹0" : "$0"}</td>
                  <td>{countryCode === "IN" ? "₹599" : "$9"}</td>
                  <td>{countryCode === "IN" ? "₹2,999" : "$59"}</td>
                  <td style={{ background: "#fff3f3" }}>
                    {countryCode === "IN" ? "₹4,999" : "$179"}
                  </td>
                  <td>{countryCode === "IN" ? "₹9,999" : "$479"}</td>
                  <td>{t("table.sections.pricing.enterprise")}</td>
                </tr>

                {/* Website & Presence */}
                <tr className="section-header">
                  <td colSpan={7}>
                    <div className="section-header-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          d="M12 21.5C16.9706 21.5 21 17.4706 21 12.5C21 7.52944 16.9706 3.5 12 3.5M12 21.5C7.02944 21.5 3 17.4706 3 12.5C3 7.52944 7.02944 3.5 12 3.5M12 21.5C9.82538 21.5 8.0625 17.4706 8.0625 12.5C8.0625 7.52944 9.82538 3.5 12 3.5M12 21.5C14.1746 21.5 15.9375 17.4706 15.9375 12.5C15.9375 7.52944 14.1746 3.5 12 3.5M4.6875 16.8744C6.33632 15.9302 9.07573 15.3125 12.1764 15.3125C15.4124 15.3125 18.255 15.9854 19.875 17M4.6875 8.12558C6.33632 9.06975 9.07573 9.6875 12.1764 9.6875C15.4124 9.6875 18.255 9.0146 19.875 8"
                          stroke="#D92D27"
                          strokeWidth="2"
                        />
                      </svg>
                      Website & Presence
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "218px" }}>
                    Professional Catalog
                    <br />
                    <small>
                      A beautifully designed digital storefront to showcase your
                      products with high quality images, videos, and detailed
                      descriptions.
                    </small>
                  </td>
                  <td>Basic</td>
                  <td>Basic</td>
                  <td>Standard</td>
                  <td style={{ background: "#fff3f3" }}>Advanced</td>
                  <td>Elite Multi-Language</td>
                  <td>Custom + API</td>
                </tr>
                <tr>
                  <td>
                    Own Domain Website
                    <br />
                    <small>
                      Establish a strong, professional brand identity and
                      improve SEO with a web address like 'yourcompany.com'.
                      (Available on Scale/Professional plans and above).
                    </small>
                  </td>
                  <td>✘</td>
                  <td>✘</td>
                  <td>✘</td>
                  <td style={{ background: "#fff3f3" }}>✔</td>
                  <td>✔</td>
                  <td>✔</td>
                </tr>
                <tr>
                  <td>
                    Multilingual Catalog & Website
                    <br />
                    <small>
                      Instantly break down language barriers. Your catalog is
                      automatically translated into 10+ languages to connect
                      with buyers around the world.
                    </small>
                  </td>
                  <td>1 Language</td>
                  <td>2 Language</td>
                  <td>4 Languages</td>
                  <td style={{ background: "#fff3f3" }}>8 Languages</td>
                  <td>10+ Languages</td>
                  <td>10+ Languages</td>
                </tr>
                <tr>
                  <td>
                    Business Email (Zoho)
                    <br />
                    <small>
                      Build trust and look more professional with custom email
                      addresses like 'sales@yourcompany.com', powered by Zoho
                      Mail.
                    </small>
                  </td>
                  <td>✘</td>
                  <td>✘</td>
                  <td>✘</td>
                  <td style={{ background: "#fff3f3" }}>1 User</td>
                  <td>3 User</td>
                  <td>On-Request</td>
                </tr>

                {/* Marketplace */}
                <tr className="section-header">
                  <td colSpan={7}>
                    <div className="section-header-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          d="M2.9668 10.9961V15.9979C2.9668 18.8274 2.9668 20.2421 3.84548 21.1211C4.72416 22.0001 6.13837 22.0001 8.9668 22.0001H14.9668C17.7952 22.0001 19.2094 22.0001 20.0881 21.1211C20.9668 20.2421 20.9668 18.8274 20.9668 15.9979V10.9961"
                          stroke="#D92D27"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.9668 18.4922H10.9668"
                          stroke="#D92D27"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10.1038 8.918C9.82182 9.9364 8.79628 11.6932 6.84777 11.9478C5.12733 12.1726 3.82246 11.4216 3.48916 11.1076C3.12168 10.853 2.28416 10.0382 2.07906 9.52904C1.87395 9.01984 2.11324 7.91657 2.28416 7.46678L2.96743 5.48839C3.13423 4.99147 3.5247 3.81617 3.92501 3.41864C4.32533 3.02111 5.13581 3.00382 5.4694 3.00382H12.4749C14.2781 3.02929 18.2209 2.98774 19.0003 3.00382C19.7797 3.0199 20.2481 3.67324 20.3848 3.9533C21.5477 6.77012 22 8.38334 22 9.07076C21.8482 9.80407 21.22 11.1868 19.0003 11.795C16.6933 12.4271 15.3854 11.1977 14.9751 10.7257M9.15522 10.7257C9.47997 11.1245 10.4987 11.9274 11.9754 11.9478C13.4522 11.9681 14.7273 10.9378 15.1802 10.4201C15.3084 10.2674 10.7128 9.89619 11 9"
                          fill="#D92D27"
                        />
                        <path
                          d="M10.1038 8.918C9.82182 9.9364 8.79628 11.6932 6.84777 11.9478C5.12733 12.1726 3.82246 11.4216 3.48916 11.1076C3.12168 10.853 2.28416 10.0382 2.07906 9.52904C1.87395 9.01984 2.11324 7.91657 2.28416 7.46678L2.96743 5.48839C3.13423 4.99147 3.5247 3.81617 3.92501 3.41864C4.32533 3.02111 5.13581 3.00382 5.4694 3.00382H12.4749C14.2781 3.02929 18.2209 2.98774 19.0003 3.00382C19.7797 3.0199 20.2481 3.67324 20.3848 3.9533C21.5477 6.77012 22 8.38334 22 9.07076C21.8482 9.80407 21.22 11.1868 19.0003 11.795C16.6933 12.4271 15.3854 11.1977 14.9751 10.7257M9.15522 10.7257C9.47997 11.1245 10.4987 11.9274 11.9754 11.9478C13.4522 11.9681 14.7273 10.9378 15.1802 10.4201C15.3084 10.2674 10.7128 9.89619 11 9"
                          stroke="#D92D27"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Marketplace & Leads
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    Marketplace Visibility
                    <br />
                    <small>
                      Determines how prominently your business appears in search
                      results. Higher levels act like a digital ad boost,
                      putting you in front of more buyers.
                    </small>
                  </td>
                  <td>Level 6</td>
                  <td>Level 5</td>
                  <td>Level 4</td>
                  <td style={{ background: "#fff3f3" }}>Level 3</td>
                  <td>Level 2 (Top Tier)</td>
                  <td>Level 1 (Highest)</td>
                </tr>
                <tr>
                  <td>
                    Featured Products
                    <br />
                    <small>
                      Showcase your key products in high-traffic spots across
                      the platform—like the homepage and category pages—for
                      maximum exposure.
                    </small>
                  </td>
                  <td>0</td>
                  <td>0</td>
                  <td>3</td>
                  <td style={{ background: "#fff3f3" }}>5</td>
                  <td>10</td>
                  <td>20</td>
                </tr>
                <tr>
                  <td>
                    RFQ Access / Month
                    <br />
                    <small>
                      View and respond directly to active buyer requirements
                      (Requests for Quotation). Each response is an opportunity
                      to win new business.
                    </small>
                  </td>
                  <td>View Only</td>
                  <td>10</td>
                  <td>30</td>
                  <td style={{ background: "#fff3f3" }}>50</td>
                  <td>100</td>
                  <td>200+</td>
                </tr>

                {/* CRM */}
                <tr className="section-header">
                  <td colSpan={7}>
                    <div className="section-header-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="11"
                        viewBox="0 0 22 11"
                        fill="none"
                      >
                        <path
                          d="M9.1038 6.918C8.82182 7.9364 7.79628 9.69318 5.84777 9.94778C4.12733 10.1726 2.82246 9.42158 2.48916 9.10758C2.12168 8.85298 1.28416 8.03824 1.07906 7.52904C0.873947 7.01984 1.11324 5.91657 1.28416 5.46678L1.96743 3.48839C2.13423 2.99147 2.5247 1.81617 2.92501 1.41864C3.32533 1.02111 4.13581 1.00382 4.4694 1.00382H11.4749C13.2781 1.02929 17.2209 0.987737 18.0003 1.00382C18.7797 1.0199 19.2481 1.67324 19.3848 1.9533C20.5477 4.77012 21 6.38334 21 7.07076C20.8482 7.80407 20.22 9.18678 18.0003 9.79498C15.6933 10.4271 14.3854 9.19768 13.9751 8.72568M8.15522 8.72568C8.47997 9.12448 9.4987 9.92738 10.9754 9.94778C12.4522 9.96808 13.7273 8.93778 14.1802 8.42014C14.3084 8.26738 9.7128 7.89619 10 7"
                          fill="#D92D27"
                        />
                        <path
                          d="M9.1038 6.918C8.82182 7.9364 7.79628 9.69318 5.84777 9.94778C4.12733 10.1726 2.82246 9.42158 2.48916 9.10758C2.12168 8.85298 1.28416 8.03824 1.07906 7.52904C0.873947 7.01984 1.11324 5.91657 1.28416 5.46678L1.96743 3.48839C2.13423 2.99147 2.5247 1.81617 2.92501 1.41864C3.32533 1.02111 4.13581 1.00382 4.4694 1.00382H11.4749C13.2781 1.02929 17.2209 0.987737 18.0003 1.00382C18.7797 1.0199 19.2481 1.67324 19.3848 1.9533C20.5477 4.77012 21 6.38334 21 7.07076C20.8482 7.80407 20.22 9.18678 18.0003 9.79498C15.6933 10.4271 14.3854 9.19768 13.9751 8.72568M8.15522 8.72568C8.47997 9.12448 9.4987 9.92738 10.9754 9.94778C12.4522 9.96808 13.7273 8.93778 14.1802 8.42014C14.3084 8.26738 9.7128 7.89619 10 7"
                          stroke="#D92D27"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      CRM & Sales Tools
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    Smart CRM Suite
                    <br />
                    <small>
                      Your all-in-one sales engine. Organize contacts, track
                      leads through a visual pipeline, and manage all your
                      customer interactions in one place.
                    </small>
                  </td>
                  <td>✘</td>
                  <td>Basic</td>
                  <td>✔ Full Suite</td>
                  <td style={{ background: "#fff3f3" }}>✔ Full Suite</td>
                  <td>✔ Full Suite</td>
                  <td>✔ Full Suite</td>
                </tr>
                <tr>
                  <td>
                    AI Lead Scoring
                    <br />
                    <small>
                      Our AI analyzes incoming leads and highlights the ones
                      most likely to convert, so your sales team can focus their
                      time on the best opportunities.
                    </small>
                  </td>
                  <td>✘</td>
                  <td>✘</td>
                  <td>✘</td>
                  <td style={{ background: "#fff3f3" }}>✔</td>
                  <td>✔</td>
                  <td>✔</td>
                </tr>

                {/* Trust & Support */}
                <tr className="section-header">
                  <td colSpan={7}>
                    <div className="section-header-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          d="M20.2012 14.3164C20.2012 16.0687 19.369 17.4725 18.0352 18.7627C16.7288 20.0263 14.8398 21.278 12.5352 22.7334C12.209 22.9394 11.793 22.9394 11.4668 22.7334C9.12277 21.2531 7.24552 19.8542 5.94434 18.5156C4.66364 17.1981 3.8008 15.7958 3.80078 14.3164V6.28809C3.80088 5.90942 4.01481 5.56291 4.35352 5.39355L9.94336 2.59863C11.2383 1.95119 12.7627 1.95132 14.0576 2.59863L19.6484 5.39355C19.987 5.56294 20.2011 5.9095 20.2012 6.28809V14.3164Z"
                          fill="#D92D27"
                          stroke="#D92D27"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.60156 11.6867L11.4016 13.4867L15.0016 9.88672"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Trust & Support</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    Verification Badge
                    <br />
                    <small>
                      Your mark of authenticity. Higher-level badges
                      (TruVerified, TruGlobal) show buyers you've passed
                      rigorous checks, making you a preferred partner.
                    </small>
                  </td>
                  <td>
                    <img
                      src="/images/TruBasic.png"
                      style={{ width: "100%", height: "auto" }}
                      alt=""
                    />
                  </td>
                  <td>
                    <img
                      src="/images/TruAccess.png"
                      style={{ width: "100%", height: "auto" }}
                      alt=""
                    />
                  </td>
                  <td>
                    <img
                      src="/images/TruCertified.png"
                      style={{ width: "100%", height: "auto" }}
                      alt=""
                    />
                  </td>
                  <td style={{ background: "#fff3f3" }}>
                    <img
                      src="/images/TruVerified.png"
                      style={{ width: "100%", height: "auto" }}
                      alt=""
                    />
                  </td>
                  <td>
                    <img
                      src="/images/TruGlobal.png"
                      style={{ width: "100%", height: "auto" }}
                      alt=""
                    />
                  </td>
                  <td>
                    <img
                      src="/images/truSecure.png"
                      style={{ width: "100%", height: "auto" }}
                      alt=""
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    Eco-Business Badge
                    <br />
                    <small>
                      Show your commitment to sustainability. We plant a tree on
                      your behalf, certifying your business as an eco-conscious
                      partner. (Available on Scale/Professional plans and
                      above).
                    </small>
                  </td>
                  <td>✘</td>
                  <td>✘</td>
                  <td>✘</td>
                  <td style={{ background: "#fff3f3" }}>✔ Yes</td>
                  <td>✔ Yes</td>
                  <td>✔ Yes</td>
                </tr>
                <tr>
                  <td>
                    Support Level
                    <br />
                    <small>
                      The type of access you have to our customer success team.
                      Higher tiers include priority access via phone and live
                      chat for faster resolutions.
                    </small>
                  </td>
                  <td>Email</td>
                  <td>Email & Chat</td>
                  <td>Email & Chat</td>
                  <td style={{ background: "#fff3f3" }}>Priority Phone/Chat</td>
                  <td>Priority Phone/Chat</td>
                  <td>Priority Phone/Chat</td>
                </tr>
                <tr>
                  <td>
                    Dedicated Account Manager
                    <br />
                    <small>
                      Your personal growth partner at Pepagora. A real person to
                      provide strategic guidance, answer questions, and help you
                      maximize your ROI. (Available on Scale/Professional plans
                      and above).
                    </small>
                  </td>
                  <td>✘</td>
                  <td>✘</td>
                  <td>✘</td>
                  <td style={{ background: "#fff3f3" }}>✔ Yes</td>
                  <td>✔ Yes</td>
                  <td>Dedicated Team</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="toggle-btn-wrapper">
            <button className="toggle-btn close" onClick={toggleComparison}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M19.6998 12.5L5.2998 12.5"
                  stroke="#232323"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Close Detailed Feature Comparison
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Feature Comparison */}
      <section className="mobile-feature-comparison-wrapper">
        <div className="mobile-toggle-btn-wrapper">
          <button
            className={`mobile-toggle-btn ${
              showMobileComparison ? "hidden" : ""
            }`}
            onClick={toggleMobileComparison}
          >
            <span className="plus-icon">+</span> View Detailed Feature
            Comparison
          </button>
        </div>

        <div
          className={`mobile-feature-comparison-container ${
            showMobileComparison ? "show" : ""
          }`}
        >
          <h2 className="mobile-feature-title">
            Detailed Feature <span className="highlight">Comparison</span>
          </h2>

          <div className="mobile-toggle-btn-wrapper">
            <button
              className="mobile-close-btn"
              onClick={toggleMobileComparison}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M19.6998 12.5L5.2998 12.5"
                  stroke="#232323"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Close Full List of Features
            </button>
          </div>

          {/* Mobile comparison content would go here - simplified version */}
          <div className="pricing-table-mobile">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th colSpan={2} className="pricing-heading">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                    >
                      <path
                        d="M12 21.5C16.9706 21.5 21 17.4706 21 12.5C21 7.52944 16.9706 3.5 12 3.5M12 21.5C7.02944 21.5 3 17.4706 3 12.5C3 7.52944 7.02944 3.5 12 3.5M12 21.5C9.82538 21.5 8.0625 17.4706 8.0625 12.5C8.0625 7.52944 9.82538 3.5 12 3.5M12 21.5C14.1746 21.5 15.9375 17.4706 15.9375 12.5C15.9375 7.52944 14.1746 3.5 12 3.5M4.6875 16.8744C6.33632 15.9302 9.07573 15.3125 12.1764 15.3125C15.4124 15.3125 18.255 15.9854 19.875 17M4.6875 8.12558C6.33632 9.06975 9.07573 9.6875 12.1764 9.6875C15.4124 9.6875 18.255 9.0146 19.875 8"
                        stroke="#D92D27"
                        strokeWidth="2"
                      />
                    </svg>
                    Pricing
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Annual Plan (INR)</td>
                  <td>₹6,000</td>
                </tr>
                <tr>
                  <td>Monthly Plan (INR)</td>
                  <td>₹599</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Additional mobile sections would be added here */}
        </div>
      </section>
    </>
  );
}
