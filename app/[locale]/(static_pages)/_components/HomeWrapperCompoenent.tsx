"use client";
import SearchDropdown from "@/app/[locale]/_components/Common/SearchDropdown/SearchDropdown";
import HomePageCards from "@/app/[locale]/_components/HomePageCards";

import "@/app/[locale]/(static_pages)/(assets)/assets/css/bootstrap.min.css";
import "@/app/[locale]/(static_pages)/(assets)/assets/css/dev-style.css";
import "@/app/[locale]/(static_pages)/(assets)/assets/css/style.css";
import "@/app/[locale]/(static_pages)/(assets)/assets/scss/home/home.css";
import LanguageLinks from "@/app/[locale]/(static_pages)/_components/LanguageLinks";
import { useScrollSpy } from "@/app/[locale]/_hooks/useScrollSpy";
import { OfferDiscountListInterface } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useGetOfferDiscountListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import {
  setIsNavActive,
  setIsShowSearchDropDown,
} from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import aiPower from "@/public/img/static-site/ai-empower-icon.svg";
import dealAcross from "@/public/img/static-site/deals-across.svg";
import discount from "@/public/img/static-site/discount.svg";
import discoverTrust from "@/public/img/static-site/discover-trusted-product.svg";
import meetingFixed from "@/public/img/static-site/dozens-img.png";
import esslogo from "@/public/img/static-site/essae-logo.svg";
import exploreTools from "@/public/img/static-site/explore-b2b-tools.svg";
import findNewCustomer from "@/public/img/static-site/find-new-customers.svg";
import handPicked from "@/public/img/static-site/hand-picked.svg";
import listProd from "@/public/img/static-site/list-your-prod.svg";
import PepLogo from "@/public/img/static-site/pepagora-logo.svg";
import postReqM from "@/public/img/static-site/post-req-get-deal-img-banner-m.png";
import postReq from "@/public/img/static-site/post-req-get-deal-img-banner.png";
import scrollDown from "@/public/img/static-site/scroll-down.svg";
import successStory from "@/public/img/static-site/success-story.svg";
import verifyOffer from "@/public/img/static-site/verified-offer.svg";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image.js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// import "./(assets)/assets/css/bootstrap.min.css";
// import "./(assets)/assets/css/dev-style.css";
// import "./(assets)/assets/css/style.css";
// import "./(assets)/assets/scss/home/home.css";
// import "../../../assets/css/final-styles.css";
// import "../../../../assets/css/final-styles.css"
import "@/assets/css/final-styles.css";
// import AiEmpowerSlider from "./components/AiEmpowerSlider.jsx";
import AiEmpowerSlider from "@/app/[locale]/(static_pages)/_components//AiEmpowerSlider.jsx";
import { TabbedSection } from "@/app/[locale]/(static_pages)/_components/TabbedSection";
import {
  connectTabs,
  sellTabs,
  sourceTabs,
} from "@/app/[locale]/(static_pages)/tabsData";
// import shieldTick from "@/public/img/static-site/Icons/shield-tick.svg";
import ReadyGrowCard from "@/app/[locale]/(static_pages)/_components/ReadyGrowCard";
import SellOfferCard from "@/app/[locale]/(static_pages)/_components/SellOfferCard";
import TrendingOfferCard from "@/app/[locale]/(static_pages)/_components/TrendingOfferCard";
import buildScale from '@/assets/img/home-page/build-to-scale.png';
import knowWho from '@/assets/img/home-page/know-who-you-dealing.png';
import smartMatching from '@/assets/img/home-page/smart-matching.png';

const HomeWrapperComponent = () => {
  // const HomeWrapperComponent = ({ params }: { params: Promise<any> }) => {
  const locale = useLocale();
  const targetRef = useRef(null);
  const dispatch = useAppDispatch();
  const t = useTranslations("home");
  // Ref for the hero section
  const heroSectionRef = useRef<HTMLDivElement>(null);

  // Trending offers state and API
  const [trendingOffers, setTrendingOffers] = useState<
    OfferDiscountListInterface[]
  >([]);
  const currencyCode = useAppSelector((state) => state.location.currency);

  const [activeSection, setActiveSection] = useState<string>("connect-section");
  // const refQuery = "homepage"; // Add refQuery for tracking

  useScrollSpy(
    ["connect-section", "sell-section", "source-section"],
    setActiveSection
  );

  const {
    data: trendingOffersData,
    isLoading: isTrendingOffersLoading,
    isSuccess: isTrendingOffersSuccess,
  } = useGetOfferDiscountListQuery(
    {
      category_id: undefined,
      specificSort: "trending",
      page: 1,
      limit: 4,
      filterBy: [],
      currencyCode: currencyCode ?? "INR",
    },
    { skip: !currencyCode }
  );

  useEffect(() => {
    // Dynamically import bootstrap JS, only on client
    import("../(assets)/assets/js/bootstrap.bundle.min.js");
  }, []);

  // Update trending offers when API data changes
  useEffect(() => {
    if (trendingOffersData && isTrendingOffersSuccess) {
      const offers = trendingOffersData?.data?.listData || [];
      setTrendingOffers(offers);
    }
  }, [trendingOffersData, isTrendingOffersSuccess]);

  // Handle navigation button clicks and scroll behavior
  useEffect(() => {
    const buttons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".section-block");

    // Scroll to section smoothly on click
    const handleButtonClick = (event: Event) => {
      const btn = event.currentTarget as HTMLElement;
      const targetId = btn.dataset.target;
      if (targetId) {
        // Remove active class from all buttons
        buttons.forEach((button) => {
          button.classList.remove("active");
        });

        // Add active class to clicked button
        btn.classList.add("active");

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          // Calculate the offset considering the header height
          const headerHeight = 88; // Adjust this value based on your header height
          const targetPosition = targetSection.offsetTop - headerHeight;

          // Add a small delay to ensure smooth scrolling
          requestAnimationFrame(() => {
            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });
          });

          // Update URL hash without jumping
          history.replaceState(null, "", `#${targetId}`);
        }
      }
    };

    // Update active button on scroll
    const handleScroll = () => {
      let current = "";
      const scrollPosition = window.scrollY + 100; // Add offset for better detection

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionBottom =
          sectionTop + (section as HTMLElement).offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          current = (section as HTMLElement).getAttribute("id") || "";
        }
      });

      // Only update if we have a current section
      if (current) {
        buttons.forEach((btn) => {
          btn.classList.remove("active");
          if ((btn as HTMLElement).dataset.target === current) {
            btn.classList.add("active");
          }
        });
      }
    };

    // Header scroll effect
    const handleHeaderScroll = () => {
      const target = document.getElementById("header-section");
      if (target && window.scrollY > 200) {
        target.classList.add("active");
      } else if (target) {
        target.classList.remove("active");
      }
    };

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a.scroll-to-id[href^="#"]');
    const handleAnchorClick = (e: Event) => {
      e.preventDefault();
      const targetId = (e.currentTarget as HTMLAnchorElement)
        .getAttribute("href")
        ?.slice(1);
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const offset = 88; // Adjust this value as needed (e.g. header height)
          const elementPosition = targetElement.offsetTop;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    };

    // Add event listeners
    buttons.forEach((btn) => {
      btn.addEventListener("click", handleButtonClick);
      // Add keyboard support
      btn.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleButtonClick(event);
        }
      });
    });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleHeaderScroll);
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick);
    });

    // Handle initial hash in URL
    const handleInitialHash = () => {
      const hash = window.location.hash.slice(1);
      if (
        hash &&
        (hash === "connect-section" ||
          hash === "sell-section" ||
          hash === "source-section")
      ) {
        // Set active button based on hash
        buttons.forEach((btn) => {
          btn.classList.remove("active");
          if ((btn as HTMLElement).dataset.target === hash) {
            btn.classList.add("active");
          }
        });

        // Scroll to section after a short delay to ensure DOM is ready
        setTimeout(() => {
          const targetSection = document.getElementById(hash);
          if (targetSection) {
            const headerHeight = 88;
            const targetPosition = targetSection.offsetTop - headerHeight;
            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    };

    // Handle window resize to recalculate positions
    const handleResize = () => {
      // Recalculate scroll positions after resize
      setTimeout(() => {
        handleScroll();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Call initial hash handler
    handleInitialHash();

    // Cleanup event listeners
    return () => {
      buttons.forEach((btn) => {
        btn.removeEventListener("click", handleButtonClick);
        btn.removeEventListener("keydown", handleButtonClick);
      });
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleHeaderScroll);
      window.removeEventListener("resize", handleResize);
      anchorLinks.forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick);
      });
    };
  }, []);

  // Intersection Observer to detect hero section visibility
  useEffect(() => {
    if (!heroSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If hero section is visible, show search dropdown
        // If hero section is not visible, hide search dropdown

        dispatch(setIsShowSearchDropDown(!entry.isIntersecting));
      },
      {
        threshold: 0.1, // Trigger when 10% of the hero section is visible
        rootMargin: "-50px 0px 0px 0px", // Adjust trigger point slightly above viewport
      }
    );

    observer.observe(heroSectionRef.current);

    // Cleanup observer on unmount
    return () => {
      if (heroSectionRef.current) {
        observer.unobserve(heroSectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroSectionRef.current) return;
      const rect = heroSectionRef.current.getBoundingClientRect();
      // rect.top is relative to the viewport
      dispatch(setIsNavActive(rect.top <= -100));
    };

    document.body.addEventListener("scroll", handleScroll, { passive: true });
    return () => document.body.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleScrollTabs = () => {
      const target: any = targetRef.current;
      if (!target) return;
      const distanceFromTop = target.getBoundingClientRect().top;
      if (distanceFromTop <= 110) {
        target.classList.add("active");
      } else {
        target.classList.remove("active");
      }
    };

    window.addEventListener("scroll", handleScrollTabs);
    // Initial check in case user loaded partway down
    handleScrollTabs();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScrollTabs);
  }, []);
  // active tab states
  const [activeTabConnect, setActiveTabConnect] = useState<string>("connect1");
  const [activeTabSell, setActiveTabSell] = useState<string>("sell1");
  const [activeTabSource, setActiveTabSource] = useState<string>("source1");
  return (
    <>
      <div className="hero-section" ref={heroSectionRef}>
        {/* <div className="h-s-help-text">
          <span>Not Sure What you need?</span>
          <Link href="/app/sourcing-rfq" className="link-text">Post Buying Requirement</Link>
        </div> */}
        <div className="h-s-container">
          <div className="h-s-c-logo-title">
            <Image
              width={413}
              height={80}
              src={PepLogo}
              alt="scroll"
              className="img-fluid"
            />
            <div className="p-divider-line p-d-l-vertical"></div>
            <div className="h-s-c-title-group">
              <div className="title-h3">{t("hero.title")}</div>
              {/* <div className="subtitle-h2">
                  {t("hero.subtitle")}
                </div> */}
            </div>
          </div>
          <SearchDropdown className="p-main-search" />

          <div className="p-m-footer">
            <div className="p-m-f-left p-m-label-links-group">
              {/* {trendingOffers && trendingOffers.length > 0 && (
                <div className="p-m-l-l-lable">
                  {t("hero.topSearches.title")}
                </div>
              )}
              <div className="p-m-l-l-actions">
                {trendingOffers &&
                  trendingOffers.map((item: OfferDiscountListInterface) => (
                    <Link
                      href={`/p/${item?.liveUrl}`}
                      className="p-text-link p-t-l-img-default"
                      key={item._id}
                    >
                      {item?.productName}
                    </Link>
                  ))}
              </div> */}
            </div>
            <div className="p-m-f-rigth p-m-label-links-group">
              <div className="p-m-l-l-lable">{t("hero.offeredIn.title")}</div>
              {/* <div className="p-m-l-l-actions">
                  <a href="#">English</a> |<a href="#">العربية</a> |<a href="#">हिंदी</a> |<a href="#">தமிழ்</a> 
                </div>                 */}
              <LanguageLinks className={"p-m-l-l-actions"} />
            </div>
          </div>
        </div>
        <Link
          href={`/${locale}/#connect-section`}
          className="p-text-link p-t-l-img-default scroll-down scroll-to-id"
        >
          <Image
            width={60}
            height={110}
            src={scrollDown}
            alt="scroll"
            className=""
          />
        </Link>
      </div>

      <div className="connect-sell-source-section">
        <div className="link-group-tabs-wrap">
          <div className="link-group-tabs">
            <Link
              data-target="connect-section"
              href={`/${locale}/#connect-section`}
              // className={activeSection === "connect-section" ? "active" : ""}
              className={`nav-btn p-text-link p-t-l-img-default ${activeSection === "connect-section" ? "active" : ""
                }`}
              aria-label="Scroll to Connect section"
              title="Scroll to Connect section"
            >
              {t("navigation.connect")}
            </Link>
            <Link
              data-target="sell-section"
              href={`/${locale}/#sell-section`}
              className={`nav-btn p-text-link p-t-l-img-default ${activeSection === "sell-section" ? "active" : ""
                }`}
              aria-label="Scroll to Connect section"
              title="Scroll to Connect section"
            >
              {t("navigation.sell")}
            </Link>
            <Link
              data-target="source-section"
              href={`/${locale}/#source-section`}
              className={`nav-btn p-text-link p-t-l-img-default ${activeSection === "source-section" ? "active" : ""
                }`}
              aria-label="Scroll to Connect section"
              title="Scroll to Connect section"
            >
              {t("navigation.source")}
            </Link>
          </div>
        </div>
        <TabbedSection
          sectionId="connect-section"
          sectionTitleHighlight="navigation.connect"
          sectionTitle="connect.title"
          sectionTitleBreak="connect.titleBreak"
          sectionSubtitle="connect.description"
          tabs={connectTabs}
          buttonText="connect.startButton"
          buttonHref="/app/sales-connect"
          imagePosition="right"
          className="connect-section"
          activeTab={activeTabConnect}
          setActiveTab={setActiveTabConnect}
        />

        <TabbedSection
          sectionId="sell-section"
          sectionTitleHighlight="navigation.sell"
          sectionTitle="sell.title"
          sectionTitleBreak="sell.titleBreak"
          sectionSubtitle="sell.description"
          tabs={sellTabs}
          buttonText="sell.startButton"
          buttonHref="/app/sales-product"
          imagePosition="left"
          className="sell-section"
          activeTab={activeTabSell}
          setActiveTab={setActiveTabSell}
        />

        <TabbedSection
          sectionId="source-section"
          sectionTitleHighlight="navigation.source"
          sectionTitle="source.title"
          sectionTitleBreak="source.titleBreak"
          sectionSubtitle="source.description"
          tabs={sourceTabs}
          buttonText="source.startButton"
          buttonHref="/app/sourcing-rfq"
          imagePosition="right"
          className="source-section"
          activeTab={activeTabSource}
          setActiveTab={setActiveTabSource}
        />
      </div>

      <HomePageCards />

      <section className="post-your-request-section section-block">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-lg-12">
              <div className="info-with-triger-block">
                <div className="i-w-t-info w-100">
                  <div className="title-h2">
                    {t("postRequest.title")}{" "}
                    <span>{t("postRequest.titleLast")}</span>
                  </div>
                  <div className="subtitle-h3">{t("postRequest.subtitle")}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-md-4 mt-0 gy-4">
            <div className="col-lg-12">
              <div className="post-request-banner">
                <Image
                  width={1296}
                  height={600}
                  src={postReq}
                  alt="Banner"
                  className="img-fluid tablet-hide"
                />
                <Image
                  width={696}
                  height={868}
                  src={postReqM}
                  alt="Banner"
                  className="img-fluid tablet-show"
                />
              </div>
            </div>
          </div>
          <div className="post-request-banner-group mt-4">
            <div className="post-request-sub-banner">
              <div className="post-req-sub-banner-card">
                <div className="p-r-s-b-c-i-title">
                  <h5>
                    {t("postRequest.cardsHeaderDetail.knowWhoPartOne")} <span style={{ display: "block" }}>{t("postRequest.cardsHeaderDetail.knowWhoPartTwo")}</span>
                  </h5>
                </div>
                <div className="p-r-s-b-c-i-img">
                  <Image
                    width={464}
                    height={245}
                    src={knowWho}
                    alt="icon"
                  />
                </div>
                <div className="p-r-s-b-c-i-txt">
                  {t("postRequest.cardsFooterDetail.eachSupplier")}
                  <b>{t("postRequest.cardsFooterDetail.truVerified")}</b>
                  {t("postRequest.cardsFooterDetail.exportExperience")}
                </div>
              </div>
              {/* <Image
                width={415}
                height={367}
                src={postReqDealOne}
                alt="Sub Banner"
              /> */}
            </div>
            <div className="post-request-sub-banner">
              <div className="post-req-sub-banner-card">
                <div className="p-r-s-b-c-i-title">
                  <h5>
                    {t("postRequest.cardsHeaderDetail.smartMatching")}
                    <span style={{ display: "block" }}>{t("postRequest.cardsHeaderDetail.massEmail")}</span>
                  </h5>
                </div>
                <div className="p-r-s-b-c-i-img">
                  <Image
                    width={464}
                    height={245}
                    src={smartMatching}
                    alt="icon"
                  />
                </div>
                <div className="p-r-s-b-c-i-txt">
                  {t("postRequest.cardsFooterDetail.systemFilters")}
                </div>
              </div>
              {/* <Image
                width={415}
                height={367}
                src={postReqDealTwo}
                alt="Sub Banner"
              /> */}
            </div>
            <div className="post-request-sub-banner">
              <div className="post-req-sub-banner-card">
                <div className="p-r-s-b-c-i-title">
                  <h5>
                    {t("postRequest.cardsHeaderDetail.builtTo")}<span style={{ display: "block" }}>{t("postRequest.cardsHeaderDetail.massEmail")}</span>
                  </h5>
                </div>
                <div className="p-r-s-b-c-i-img">
                  <Image
                    width={464}
                    height={245}
                    src={buildScale}
                    alt="icon"
                  />
                </div>
                <div className="p-r-s-b-c-i-txt">
                  {t("postRequest.cardsFooterDetail.scaleWithYou")}
                </div>
              </div>
              {/* <Image
                width={415}
                height={367}
                src={postReqDealThree}
                alt="Sub Banner"
              /> */}
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-md-3 gap-2 mt-4 flex-wrap">
            <Link
              href={"/rfqs"}
              // type="button"
              className="p-btn-comp p-btn-outline-dark p-btn-rounded p-btn-md post-sell-btn"
            >
              {t("postRequest.buttons.viewRequests")}
            </Link>
            <Link
              href={"/app/sourcing-rfq"}
              // type="button"
              className="p-btn-comp p-btn-primary p-btn-rounded p-btn-md post-sell-btn"
            >
              {t("postRequest.buttons.postRequest")}
            </Link>
          </div>
        </div>
      </section>

      <section className="sell-offer-section">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-lg-12">
              <div className="info-with-triger-block">
                <div className="i-w-t-info w-100">
                  <div className="title-h2">
                    {t("sellOffers.title")}{" "}
                    <span> {t("sellOffers.titleMiddle")} </span>{" "}
                    {t("sellOffers.titleLast")}
                  </div>
                  <div className="subtitle-h3">{t("sellOffers.subtitle")}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-md-5 mt-2 gy-4">
            <div className="col-xl-8">
              <div className="row gy-md-4 gy-3">
                <SellOfferCard
                  title="sellOffers.features.ft1.title"
                  subtitle="sellOffers.features.ft1.description"
                  image={handPicked}
                />
                <SellOfferCard
                  title="sellOffers.features.ft2.title"
                  subtitle="sellOffers.features.ft2.description"
                  image={verifyOffer}
                />

                <SellOfferCard
                  title="sellOffers.features.ft3.title"
                  subtitle="sellOffers.features.ft3.description"
                  image={dealAcross}
                />
                <SellOfferCard
                  title="sellOffers.features.ft4.title"
                  subtitle="sellOffers.features.ft4.description"
                  image={discount}
                />
              </div>
            </div>
            <div className="col-xl-4">
              <div className="trending-offer-card">
                <div className="t-o-c-top">
                  <span className="t-o-c-t-title">
                    {t("sellOffers.trendingOffer.title")}
                  </span>
                  <div className="product-card-group">
                    {isTrendingOffersLoading ? (
                      <div className="loading-state">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : trendingOffers.length > 0 ? (
                      trendingOffers.map((item: OfferDiscountListInterface) => (
                        <TrendingOfferCard item={item} key={item._id} />
                      ))
                    ) : (
                      <div className="no-trending-offers">
                        <p className="text-muted">
                          {t("sellOffers.trendingOffer.noTrendingOffers")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="t-o-c-footer">
                  <Link href={"/offers"} className="btn-txt">
                    {t("sellOffers.trendingOffer.viewAll")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center justify-content-md-between mt-md-5 mt-3">
            <span className="grey-txt d-none d-md-block">
              {t("sellOffers.footer.note")}
            </span>
            <Link
              href={"/app/sales-sell-offer"}
              className="p-btn-comp p-btn-primary p-btn-rounded p-btn-md post-sell-btn"
            >
              {t("sellOffers.footer.button")}
            </Link>
          </div>
        </div>
      </section>

      <section className="ai-empowers-section">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-lg-12">
              <div className="info-with-triger-block">
                <div className="i-w-t-info w-100">
                  <div className="text-center">
                    <Image width={80} height={80} src={aiPower} alt="icon" />
                  </div>
                  <div className="title-h2">
                    <span>AI </span>
                    {t("aiEmpowers.title")}
                  </div>
                  <div className="subtitle-h3">{t("aiEmpowers.subtitle")}</div>
                </div>
              </div>
            </div>
          </div>
          {/* className="p-horizontial-scroll" */}
          <div >
            <AiEmpowerSlider />
          </div>
        </div>
      </section>

      <section className="success-stories-section">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-lg-12">
              <div className="info-with-triger-block">
                <div className="i-w-t-info w-100">
                  <div className="title-h2">
                    <span>{t("successStories.title")} </span>{" "}
                    {t("successStories.titleSub")}
                  </div>
                  <div className="subtitle-h3">
                    {t("successStories.subtitle")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4 gy-md-4 gy-3">
            <div className="col-xxl-3 col-lg-4">
              <div className="red-box">
                <div className="box-content">
                  <span className="b-c-title">
                    {t("successStories.stats.leads")}
                  </span>
                  <span className="b-c-subtxt">
                    {t("successStories.stats.leadsSubtext")}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xxl-9 col-lg-8">
              <div className="what-cus-says-box">
                <div className="w-c-s-b-head">
                  <span className="w-c-s-b-h-txt">
                    {t("successStories.testimonial.title")}
                  </span>
                </div>
                <div className="w-c-s-b-body">
                  <span className="w-c-s-b-b-txt">
                    {t("successStories.testimonial.text")}
                  </span>
                </div>
                <div className="w-c-s-b-footer">
                  <div className="w-c-s-b-f-img">
                    <Image width={80} height={44} src={esslogo} alt="Logo" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-9 col-lg-8">
              <div className="success-story-img">
                <Image
                  width={966}
                  height={394}
                  src={successStory}
                  alt="Group Photo"
                />
              </div>
            </div>
            <div className="col-xxl-3 col-lg-4">
              <div className="red-box black-box">
                <div className="box-content">
                  <span className="b-c-title">
                    {t("successStories.stats.meetings")}
                  </span>
                  <span className="b-c-subtxt">
                    {t("successStories.stats.meetingsSubtext")}
                  </span>
                </div>
                <div className="meeting-fixed-img">
                  <Image
                    width={246}
                    height={168}
                    src={meetingFixed}
                    alt="Meeting Fixed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ready-grow-section">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <div className="info-with-triger-block">
                <div className="i-w-t-info">
                  <div className="title-h2">
                    {t("readyGrow.title")}{" "}
                    <span>{t("readyGrow.titleSub")}</span>{" "}
                    {t("readyGrow.titleSymbol")}
                  </div>
                  <div className="subtitle-h3">
                    {t("readyGrow.description")}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 offset-lg-2 d-none d-lg-block">
              <Link
                href="/app"
                className="p-btn-comp p-btn-primary p-btn-rounded  p-btn-lg"
              >
                <span className="b-c-txt">{t("readyGrow.getStarted")}</span>
              </Link>
            </div>
          </div>
          <div className="row mt-xl-5 mt-4 gy-md-4 g-2 gx-md-4">
            <ReadyGrowCard
              title="readyGrow.cards.ct1.title"
              subtitle="readyGrow.cards.ct1.subtitle"
              image={listProd}
            />
            <ReadyGrowCard
              title="readyGrow.cards.ct2.title"
              subtitle="readyGrow.cards.ct2.subtitle"
              image={discoverTrust}
            />
            <ReadyGrowCard
              title="readyGrow.cards.ct3.title"
              subtitle="readyGrow.cards.ct3.subtitle"
              image={findNewCustomer}
            />
            <ReadyGrowCard
              title="readyGrow.cards.ct4.title"
              subtitle="readyGrow.cards.ct4.subtitle"
              image={exploreTools}
            />
          </div>
          <div className="r-q-promise-text">
            {t("common.secure")}
          </div>
          <div className="start-btn d-flex d-lg-none justify-content-center mt-4">
            <Link
              href="/app"
              className="p-btn-comp p-btn-primary p-btn-rounded  p-btn-lg"
            >
              {t("readyGrow.getStarted")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeWrapperComponent;
