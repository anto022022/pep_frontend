import workerImg from "@/assets/img/g1.png";
import ic1 from "@/assets/img/ic1.png";
import ic2 from "@/assets/img/ic2.png";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
const CatalogContactFlowSection = () => {
  const t = useTranslations("freeCatalog.catalog");
  const router = useRouter();
  const handleBtnClick = () => {
    router.push("/app/sourcing-rfq");
  };
  return (
    <div className="ct-main-container bg-gray-50 min-h-screen py-8 px-4">
      <div className="ct-content-wrapper max-w-7xl mx-auto">
        <div className="ct-hero-section bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="ct-hero-grid grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="ct-left-content p-8 lg:p-12">
              <div className="ct-help-text text-gray-600 text-sm mb-2">
                {t("contactFlow.needHelp")}
              </div>

              <h1 className="ct-main-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-8">
                {t("contactFlow.mainHeading")}
              </h1>

              {/* Features Grid */}
              <div className="ct-features-grid grid sm:grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Feature 1 */}
                <div className="ct-feature-item">
                  <div className="ct-feature-icon mb-3">
                    <img
                      src={ic1.src}
                      alt={t("contactFlow.features.postRequirement.title")}
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="ct-feature-title text-lg font-semibold text-gray-900 mb-2">
                    {t("contactFlow.features.postRequirement.title")}
                  </h3>
                  <p className="ct-feature-desc text-sm text-gray-600 leading-relaxed">
                    {t("contactFlow.features.postRequirement.description")}
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="ct-feature-item">
                  <div className="ct-feature-icon mb-3">
                    <img
                      src={ic2.src}
                      alt={t("contactFlow.features.matchSellers.title")}
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="ct-feature-title text-lg font-semibold text-gray-900 mb-2">
                    {t("contactFlow.features.matchSellers.title")}
                  </h3>
                  <p className="ct-feature-desc text-sm text-gray-600 leading-relaxed">
                    {t("contactFlow.features.matchSellers.description")}
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="ct-feature-item">
                  <div className="ct-feature-icon mb-3">
                    <img
                      src={ic2.src}
                      alt={t("contactFlow.features.getOffers.title")}
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="ct-feature-title text-lg font-semibold text-gray-900 mb-2">
                    {t("contactFlow.features.getOffers.title")}
                  </h3>
                  <p className="ct-feature-desc text-sm text-gray-600 leading-relaxed">
                    {t("contactFlow.features.getOffers.description")}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                className="btn-comp btn-c-primary btn-c-sm"
                onClick={handleBtnClick}
              >
                <span className="b-c-txt">
                  {t("contactFlow.postRequirementButton")}
                </span>
              </button>
            </div>

            {/* Right Image */}
            <div className="ct-right-image-container relative p-8 lg:p-0">
              {/* Quote Notification */}
              {/* <div className="ct-quote-notification absolute top-8 right-8 lg:top-12 lg:right-12 bg-white rounded-lg shadow-lg p-4 z-10">
                <div className="ct-notification-content flex items-start gap-3">
                  <div className="ct-notification-icon w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="ct-notification-text">
                    <div className="ct-notification-title text-sm font-semibold text-gray-900">
                      {t("contactFlow.notification.title")}
                    </div>
                    <div className="ct-notification-meta flex items-center gap-2 mt-1">
                      <span className="ct-verified-badge text-xs text-green-600 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t("contactFlow.notification.topMember")}
                      </span>
                      <span className="ct-location-badge text-xs text-gray-500 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t("contactFlow.notification.country")}
                      </span>
                      <span className="ct-time-badge text-xs text-gray-400">
                        {t("contactFlow.notification.time")}
                      </span>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Worker Image */}
              <div className="ct-worker-image">
                <img
                  src={workerImg.src}
                  alt={t("contactFlow.workerImageAlt")}
                  className="w-full h-full object-cover rounded-lg lg:rounded-r-2xl img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogContactFlowSection;
