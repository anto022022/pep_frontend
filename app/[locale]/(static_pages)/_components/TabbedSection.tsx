import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export interface HomeTabItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface TabbedSectionProps {
  sectionId: string;
  sectionTitle: string;
  sectionTitleHighlight: string;
  sectionTitleBreak?: string;
  sectionSubtitle: string;
  tabs: HomeTabItem[];
  buttonText: string;
  buttonHref: string;
  imagePosition?: "left" | "right";
  className?: string;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export const TabbedSection: React.FC<TabbedSectionProps> = ({
  sectionId,
  sectionTitle,
  sectionTitleHighlight,
  sectionTitleBreak,
  sectionSubtitle,
  tabs,
  buttonText,
  buttonHref,
  imagePosition = "right",
  className = "",
  activeTab,
  setActiveTab,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const t = useTranslations("home");

  // Detect mobile view and handle tab state based on screen size
  useEffect(() => {
    const checkIsMobile = () => {
      const wasMobile = isMobile;
      const newIsMobile = window.innerWidth < 992; // Bootstrap lg breakpoint
      setIsMobile(newIsMobile);

      // If transitioning from mobile to desktop and no tab is active, open first tab
      if (wasMobile && !newIsMobile && !activeTab && tabs.length > 0) {
        setActiveTab(tabs[0].id);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [isMobile, activeTab, tabs]);

  const handleTabClick = (tabId: string) => {
    if (isMobile) {
      // In mobile: if clicking the active tab, close it (set to empty)
      // If clicking a different tab, open it
      setActiveTab(activeTab === tabId ? "" : tabId);
    } else {
      // In desktop: always set the clicked tab as active
      setActiveTab(tabId);
    }
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  return (
    <div className={`section-block ${className}`} id={sectionId}>
      <div className="container">
        <div
          className={`row ${imagePosition === "right" ? "" : "flex-row-reverse"
            }`}
        >
          {/* Content Side */}
          <div
            className={`col-lg-5 ${imagePosition === "right" ? "" : "offset-lg-1"
              }`}
          >
            <div className="info-with-triger-block">
              <div className="i-w-t-info">
                <div className="title-h2">
                  <span>{t(sectionTitleHighlight)}</span> {t(sectionTitle)}
                  <br />
                  {t(sectionTitleBreak)}
                </div>
                <div className="subtitle-h3">{t(sectionSubtitle)}</div>
              </div>

              {/* Tab Navigation */}
              <ul className="nav nav-tabs" role="tablist">
                {tabs.map((tab, index) => (
                  <li key={tab.id} className="nav-item" role="presentation">
                    <button
                      className={`nav-link i-w-t-item-block ${activeTab === tab.id ? "active" : ""
                        }`}
                      type="button"
                      role="tab"
                      aria-controls={`${tab.id}-tab-pane`}
                      aria-selected={activeTab === tab.id}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      <div className="i-w-i-b-left">
                        <Image
                          width={24}
                          height={24}
                          src={tab.icon}
                          alt={`${tab.title} icon`}
                          className="img-fluid"
                        />
                      </div>
                      <div className="i-w-i-b-right">
                        <div className="i-w-i-b-r-title">{t(tab.title)}</div>
                        {/* Show image on mobile/tablet only when tab is active */}
                        {activeTab === tab.id && (
                          <Image
                            width={636}
                            height={704}
                            src={tab.image}
                            alt={tab.imageAlt}
                            className="img-fluid tablet-show"
                          />
                        )}
                        <div className="i-w-i-b-r-subtitle">
                          {t(tab.description)}
                        </div>
                      </div>
                      <div className="i-w-i-b-end tablet-show">
                        <svg
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          className={`img-fluid ${activeTab === tab.id ? "rotate" : ""
                            }`}
                          style={{
                            transform:
                              activeTab === tab.id
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          {activeTab === tab.id ? (
                            <path
                              d="M6 15l6-6 6 6"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          ) : (
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={buttonHref}
                className="p-btn-comp p-btn-primary p-btn-rounded p-btn-md"
              >
                <span className="b-c-txt">{t(buttonText)}</span>
              </a>
            </div>
          </div>

          {/* Image Side - Desktop Only */}
          <div
            className={`col-lg-6 ${imagePosition === "left" ? "" : "offset-lg-1"
              } tablet-hide`}
          >
            <div className="tab-content">
              {activeTabData && (
                <div
                  className="tab-pane fade show active"
                  role="tabpanel"
                  aria-labelledby={`${activeTab}-tab`}
                >
                  <Image
                    width={636}
                    height={704}
                    src={activeTabData.image}
                    alt={activeTabData.imageAlt}
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// export default TabbedSection;
