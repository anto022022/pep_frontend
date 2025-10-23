import { useTranslations } from "next-intl";
import "../../../../../assets/css/footer.css";

const CatalogFooter = () => {
  const t = useTranslations("freeCatalog.catalog");

  return (
    <footer className="footer-section" style={{ margin: "0em 7em" }}>
      <div className="container-fluid">
        <div className="f-s-details">
          <div className="d-flex-767">
            {/* <img src="assets/img/Isolation_Mode-logo.png" alt="Isolation_Mode-logo" className="img-fluid"/> */}
          </div>
          <div className="f-s-d-left">
            <div className="action-cards a-c-primary">
              <div className="a-c-text">
                <div className="a-c-t-label">{t("footer.listCompany")} </div>
                <div className="a-c-t-title">{t("footer.forFree")}</div>
              </div>
              <button
                type="button"
                className="p-btn-comp p-btn-primary p-btn-rounded  p-btn-md"
              >
                {t("footer.joinAsSupplier")}
              </button>
              <svg
                width="99"
                height="110"
                viewBox="0 0 99 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.12">
                  <path
                    d="M55.0418 109.772C53.1617 109.461 51.2816 109.322 49.4357 108.942C42.257 107.455 35.4886 104.827 29.233 100.954C27.7289 100.021 26.259 99.0177 24.7891 97.9112C25.0967 97.7383 25.2335 97.9112 25.4044 97.9803C30.0876 100.747 35.2152 102.026 40.5137 102.752C43.2484 103.133 46.0173 103.271 48.7862 103.236C53.0934 103.236 57.4006 102.891 61.7077 102.303C71.7578 100.885 81.5344 98.4299 91.1059 95.1103C97.0881 93.0356 103.002 90.8225 108.506 87.6758C108.95 87.4338 109.394 87.1226 110.112 86.7422C109.428 88.0216 108.574 88.8169 107.788 89.6468C104.13 93.658 100.062 97.2196 95.4814 100.124C92.4049 102.061 89.0549 103.409 85.6707 104.654C78.8681 107.144 71.8604 108.804 64.6476 109.53C63.9981 109.599 63.3485 109.461 62.699 109.737H55.0418V109.772Z"
                    fill="#D92D27"
                  />
                  <path
                    d="M26.1918 -4.20117C24.5509 -3.06007 23.0468 -1.98812 21.6453 -0.777855C17.1672 3.06041 13.3386 7.45194 11.185 13.0883C10.0569 16.0275 9.68091 19.0705 11.185 22.0443C12.2105 24.0498 13.8855 25.3984 15.7998 26.4358C19.0815 28.1993 22.6366 28.9255 26.2601 29.3404C29.4734 29.7208 32.7209 29.8245 35.9342 29.7208C43.0786 29.4787 50.0864 28.4759 57.0599 26.9545C71.5197 23.8078 85.3984 18.863 99.0378 13.1575C102.49 11.7051 105.909 10.1837 109.327 8.73136C109.908 8.4893 110.831 8.10894 110.831 8.10894C110.831 8.10894 111.857 9.3192 112.438 10.1837C114.66 13.4687 116.301 16.477 117.976 20.1078C119.48 23.3928 120.71 26.4012 121.702 29.8591C121.77 30.1012 121.873 30.5507 121.873 30.5507C121.873 30.5507 121.531 30.689 121.257 30.7927C110.284 35.3572 99.2429 39.8178 87.928 43.4141C75.7927 47.2523 63.5206 50.3298 50.9068 51.9896C45.5741 52.7158 40.2414 53.1307 34.8403 53.2345C29.6785 53.3382 24.5167 53.1653 19.4575 52.2317C14.8427 51.4018 10.4672 49.9841 6.7411 46.9757C3.25434 44.1402 1.47677 40.4057 1.23748 35.8758C0.998196 30.8619 2.53646 26.2629 4.48495 21.7676C8.0059 13.5724 13.0651 6.48372 19.5601 0.432407C21.2693 -1.15822 22.1581 -1.71149 24.4484 -3.30212C24.7219 -3.47501 25.6448 -3.9937 26.1576 -4.20117H26.1918Z"
                    fill="#D92D27"
                  />
                  <path
                    d="M0.143566 52.4745C0.724693 54.0652 1.23745 55.6558 2.09205 57.1427C4.17727 60.7389 7.18546 63.2632 10.7748 65.1996C15.4922 67.7584 20.6197 69.0033 25.8841 69.7986C31.0458 70.5593 36.2076 70.7668 41.4036 70.5593C48.9582 70.2481 56.4445 69.3145 63.8624 67.8968C73.5365 66.0295 83.0055 63.5052 92.3719 60.4277C102.901 57.0044 113.224 52.9241 123.343 48.3942C123.616 48.2559 123.924 48.0138 124.197 48.2213C124.505 48.4288 124.265 48.8092 124.197 49.1204C123.958 51.9904 123.65 54.8605 123.035 57.696C122.112 61.88 120.847 65.9603 119.172 69.9023C118.899 70.5248 118.386 70.8706 117.839 71.1472C112.404 74.2247 106.627 76.5761 100.781 78.7545C92.6795 81.7629 84.407 84.3218 75.9977 86.3619C68.4773 88.1946 60.8543 89.5778 53.1629 90.3731C49.471 90.7535 45.7791 90.9955 42.0873 90.9263C35.9683 90.8226 29.8836 90.3039 23.9698 88.4021C19.6284 86.9843 15.6631 84.9442 12.2447 81.8321C10.1595 79.9302 8.62119 77.6134 7.35638 75.1238C4.00635 68.6229 1.40836 61.8454 0.348662 54.5493C0.314478 54.3072 0.280298 54.0652 0.246114 53.7885C0.177746 53.3736 0.143559 52.9241 0.109375 52.5091L0.143566 52.4745Z"
                    fill="#D92D27"
                  />
                  <path
                    d="M32.9593 -6.10246C32.4807 -5.41088 32.0705 -4.96136 31.797 -4.40809C31.045 -3.02493 31.4894 -1.88383 32.9593 -1.33056C34.0873 -0.881038 35.2838 -0.846459 36.446 -0.881038C42.3599 -1.15767 48.0344 -2.67914 53.6747 -4.40809C60.6141 -6.51741 67.4167 -9.04167 73.8775 -12.3958C74.4928 -12.707 75.1081 -13.122 75.6892 -13.4678C76.4413 -13.9173 76.954 -14.2285 76.954 -14.2285C76.954 -14.2285 78.0137 -13.9865 78.5949 -13.8136C85.2265 -11.8426 91.448 -8.97251 97.1567 -4.99593C97.6353 -4.68472 98.148 -4.30436 98.148 -4.30436C98.148 -4.30436 97.567 -4.02772 97.02 -3.78567C88.3373 0.329226 79.5178 4.02917 70.4591 7.17586C63.007 9.76928 55.4523 11.9478 47.6926 13.2963C43.2828 14.0571 38.8389 14.5758 34.3608 14.5066C31.2501 14.472 28.1393 14.1954 25.1995 13.1234C23.8322 12.6393 22.5674 11.9478 21.576 10.8758C20.1061 9.2506 19.7984 7.34875 20.4479 5.23944C21.1658 2.85349 22.6357 0.951647 24.3791 -0.742722C26.7036 -3.02493 29.4041 -4.75388 32.4123 -5.96414C32.5149 -5.99872 32.6516 -6.0333 32.9935 -6.10246H32.9593Z"
                    fill="#D92D27"
                  />
                </g>
              </svg>
            </div>
            <div className="action-cards a-c-secoundary">
              <div className="a-c-text">
                <div className="a-c-t-label">{t("footer.lookingTo")} </div>
                <div className="a-c-t-title">{t("footer.sourceProducts")}</div>
              </div>
              <button
                type="button"
                className="p-btn-comp p-btn-secoundary p-btn-rounded  p-btn-md"
              >
                {t("footer.postBuyingRequest")}
              </button>
            </div>
          </div>
          <div className="f-s-d-rigth d-none-767">
            <div className="f-s-d-r-item-group">
              <div className="f-s-d-r-item">
                <div className="f-s-d-r-i-title">{t("footer.getToKnowUs")}</div>
                <div className="list-link">
                  <a href="#">{t("footer.aboutPepagora")}</a>
                  <a href="#">{t("footer.leadershipAdvisors")}</a>
                  <a href="#">{t("footer.impactAtPepagora")}</a>
                  <a href="#">{t("footer.innovationAtPepagora")}</a>
                  <a href="#">{t("footer.mediaPress")}</a>
                  <a href="#">{t("footer.careers")}</a>
                  <a href="#">{t("footer.contactUs")}</a>
                </div>
              </div>
              <div className="f-s-d-r-item">
                <div className="f-s-d-r-i-title">{t("footer.blog")}</div>
                <div className="list-link">
                  <a href="#">{t("footer.sales")}</a>
                  <a href="#">{t("footer.sourcing")}</a>
                  <a href="#">{t("footer.marketing")}</a>
                  <a href="#">{t("footer.productUpdates")}</a>
                </div>
              </div>
            </div>
            <div className="f-s-d-r-item-group">
              <div className="f-s-d-r-item">
                <div className="f-s-d-r-i-title">{t("footer.industries")}</div>
                <div className="list-link">
                  <a href="#">{t("footer.apparelFashion")}</a>
                  <a href="#">{t("footer.industrialEquipmentMachinery")}</a>
                  <a href="#">{t("footer.homeLifestyle")}</a>
                  <a href="#">{t("footer.healthPersonalCare")}</a>
                  <a href="#">{t("footer.foodAgriculture")}</a>
                  <a href="#">{t("footer.constructionRealEstate")}</a>
                  <a href="#">{t("footer.electronicsElectrical")}</a>
                  <a href="#">{t("footer.automotiveTransport")}</a>
                  <a href="#">{t("footer.rawMaterialsChemicals")}</a>
                  <a href="#">{t("footer.sportsEntertainment")}</a>
                  <a href="#">{t("footer.toolsHardware")}</a>
                  <a href="#">{t("footer.packagingPrinting")}</a>
                  <a href="#">{t("footer.officeSuppliesEquipment")}</a>
                  <a href="#">{t("footer.serviceSupport")}</a>
                </div>
              </div>
            </div>
            <div className="f-s-d-r-item-group">
              <div className="f-s-d-r-item">
                <div className="f-s-d-r-i-title">
                  {t("footer.businessTools")}
                </div>
                <div className="list-link">
                  <a href="#">{t("footer.postSellOffer")}</a>
                  <a href="#">{t("footer.createBusinessWebsite")}</a>
                  <a href="#">{t("footer.manageLeads")}</a>
                  <a href="#">{t("footer.manageCustomers")}</a>
                  <a href="#">{t("footer.postBuyingRequestRfq")}</a>
                  <a href="#">{t("footer.getInstantSupplierMatch")}</a>
                  <a href="#">{t("footer.becomeVerifiedMember")}</a>
                </div>
              </div>
              <div className="f-s-d-r-item">
                <div className="f-s-d-r-i-title">{t("footer.partners")}</div>
                <div className="list-link">
                  <a href="#">{t("footer.affiliateProgram")}</a>
                  <a href="#">{t("footer.channelPartner")} </a>
                </div>
              </div>
            </div>
            <div className="f-s-d-r-item-group">
              <div className="f-s-d-r-item">
                <div className="f-s-d-r-i-title">
                  {t("footer.pricing")}{" "}
                  <div className="p-badge p-badge-primary">
                    {t("footer.startingFromPrice")}
                  </div>
                </div>
              </div>
              <div className="f-s-d-r-item">
                <div className="f-s-d-r-i-title">{t("footer.helpLegal")}</div>
                <div className="list-link">
                  <a href="#">{t("footer.helpCenter")} </a>
                  <a href="#">{t("footer.faqs")}</a>
                  <a href="#">{t("footer.refundCancellation")}</a>
                  <a href="#">{t("footer.dataProtectionGuidelines")}</a>
                  <a href="#">{t("footer.termsPrivacyPolicy")}</a>
                </div>
              </div>
            </div>
          </div>
          <div
            className="accordion d-flex-767 accordion-plus"
            id="footerAccordion"
          >
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingCompany">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseCompany"
                  aria-expanded="false"
                  aria-controls="collapseCompany"
                >
                  <span>{t("footer.company")}</span>
                  <span className="material-symbols-rounded">add</span>
                </button>
              </h2>
              <div
                id="collapseCompany"
                className="accordion-collapse collapse"
                aria-labelledby="headingCompany"
                data-bs-parent="#footerAccordion"
              >
                <div className="accordion-body">
                  <div className="f-s-d-r-item-group">
                    <div className="f-s-d-r-item">
                      <div className="f-s-d-r-i-title">
                        <span className="text-underline">
                          {t("footer.getToKnowUs")}
                        </span>
                      </div>
                      <div className="list-link">
                        <a href="#">{t("footer.aboutPepagora")}</a>
                        <a href="#">{t("footer.leadershipAdvisors")}</a>
                        <a href="#">{t("footer.impactAtPepagora")}</a>
                        <a href="#">{t("footer.innovationAtPepagora")}</a>
                        <a href="#">{t("footer.mediaPress")}</a>
                        <a href="#">{t("footer.careers")}</a>
                        <a href="#">{t("footer.contactUs")}</a>
                      </div>
                    </div>
                    <div className="f-s-d-r-item">
                      <div className="f-s-d-r-i-title">
                        <span className="text-underline">
                          {t("footer.blog")}
                        </span>
                      </div>
                      <div className="list-link">
                        <a href="#">{t("footer.sales")}</a>
                        <a href="#">{t("footer.sourcing")}</a>
                        <a href="#">{t("footer.marketing")}</a>
                        <a href="#">{t("footer.productUpdates")}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingIndustries">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseIndustries"
                  aria-expanded="false"
                  aria-controls="collapseIndustries"
                >
                  <span> {t("footer.browseByIndustries")}</span>
                  <span className="material-symbols-rounded">add</span>
                </button>
              </h2>
              <div
                id="collapseIndustries"
                className="accordion-collapse collapse"
                aria-labelledby="headingIndustries"
                data-bs-parent="#footerAccordion"
              >
                <div className="accordion-body">
                  <div className="f-s-d-r-item-group">
                    <div className="f-s-d-r-item">
                      <div className="f-s-d-r-i-title">
                        <span className="text-underline">
                          {t("footer.industries")}
                        </span>
                      </div>
                      <div className="list-link">
                        <a href="#">{t("footer.apparelFashion")}</a>
                        <a href="#">
                          {t("footer.industrialEquipmentMachinery")}
                        </a>
                        <a href="#">{t("footer.homeLifestyle")}</a>
                        <a href="#">{t("footer.healthPersonalCare")}</a>
                        <a href="#">{t("footer.foodAgriculture")}</a>
                        <a href="#">{t("footer.constructionRealEstate")}</a>
                        <a href="#">{t("footer.electronicsElectrical")}</a>
                        <a href="#">{t("footer.automotiveTransport")}</a>
                        <a href="#">{t("footer.rawMaterialsChemicals")}</a>
                        <a href="#">{t("footer.sportsEntertainment")}</a>
                        <a href="#">{t("footer.toolsHardware")}</a>
                        <a href="#">{t("footer.packagingPrinting")}</a>
                        <a href="#">{t("footer.officeSuppliesEquipment")}</a>
                        <a href="#">{t("footer.serviceSupport")}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSupport">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSupport"
                  aria-expanded="false"
                  aria-controls="collapseSupport"
                >
                  <span>{t("footer.supportLegal")}</span>
                  <span className="material-symbols-rounded">add</span>
                </button>
              </h2>
              <div
                id="collapseSupport"
                className="accordion-collapse collapse"
                aria-labelledby="headingSupport"
                data-bs-parent="#footerAccordion"
              >
                <div className="accordion-body">
                  <div className="f-s-d-r-item-group">
                    <div className="f-s-d-r-item">
                      <div className="f-s-d-r-i-title">
                        <span className="text-underline">
                          {t("footer.pricing")}
                        </span>{" "}
                        <div className="p-badge p-badge-primary">
                          {t("footer.startingFromPrice")}
                        </div>
                      </div>
                    </div>
                    <div className="f-s-d-r-item">
                      <div className="f-s-d-r-i-title">
                        <span className="text-underline">
                          {t("footer.helpLegal")}
                        </span>
                      </div>
                      <div className="list-link">
                        <a href="#">{t("footer.helpCenter")} </a>
                        <a href="#">{t("footer.faqs")}</a>
                        <a href="#">{t("footer.refundCancellation")}</a>
                        <a href="#">{t("footer.dataProtectionGuidelines")}</a>
                        <a href="#">{t("footer.termsPrivacyPolicy")}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSolutions">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSolutions"
                  aria-expanded="false"
                  aria-controls="collapseSolutions"
                >
                  <span>{t("footer.businessSolutions")}</span>
                  <span className="material-symbols-rounded">add</span>
                </button>
              </h2>
              <div
                id="collapseSolutions"
                className="accordion-collapse collapse"
                aria-labelledby="headingSolutions"
                data-bs-parent="#footerAccordion"
              >
                <div className="accordion-body">
                  <div className="f-s-d-r-item-group">
                    <div className="f-s-d-r-item">
                      <div className="f-s-d-r-i-title">
                        <span className="text-underline">
                          {t("footer.businessTools")}
                        </span>
                      </div>
                      <div className="list-link">
                        <a href="#">{t("footer.postSellOffer")}</a>
                        <a href="#">{t("footer.createBusinessWebsite")}</a>
                        <a href="#">{t("footer.manageLeads")}</a>
                        <a href="#">{t("footer.manageCustomers")}</a>
                        <a href="#">{t("footer.postBuyingRequestRfq")}</a>
                        <a href="#">{t("footer.getInstantSupplierMatch")}</a>
                        <a href="#">{t("footer.becomeVerifiedMember")}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingResources">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseResources"
                  aria-expanded="false"
                  aria-controls="collapseResources"
                >
                  <span>{t("footer.resources")}</span>
                  <span className="material-symbols-rounded">add</span>
                </button>
              </h2>
              <div
                id="collapseResources"
                className="accordion-collapse collapse"
                aria-labelledby="headingResources"
                data-bs-parent="#footerAccordion"
              >
                <div className="accordion-body">
                  <div className="f-s-d-r-item-group">
                    <div className="f-s-d-r-item">
                      <div className="f-s-d-r-i-title">
                        <span className="text-underline">
                          {t("footer.partners")}
                        </span>
                      </div>
                      <div className="list-link">
                        <a href="#">{t("footer.affiliateProgram")}</a>
                        <a href="#">{t("footer.channelPartner")} </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="f-s-middle d-none-767">
          <div className="logo-block">
            <img
              src="assets/img/pepagora-logo.svg"
              alt="pepagora-logo"
              className="img-fluid"
            />
          </div>
        </div>
        <div className="f-s-bottom">
          <div className="f-s-b-top">
            <div className="f-s-b-t-left">
              <div className="f-s-b-t-l-top">
                <a href="#">
                  <img src="assets/img/Icons/Facebook.svg" alt="Facebook" />
                </a>
                <a href="#">
                  <img src="assets/img/Icons/Twitter.svg" alt="Twitter" />
                </a>
                <a href="#">
                  <img src="assets/img/Icons/YouTube.svg" alt="YouTube" />
                </a>
                <a href="#">
                  <img src="assets/img/Icons/Instagram.svg" alt="Instagram" />
                </a>
                <a href="#">
                  <img src="assets/img/Icons/LinkedIn.svg" alt="LinkedIn" />
                </a>
              </div>
              <div className="f-s-b-t-l-bottom">
                <div className="f-s-b-t-label-links-group">
                  <div className="f-s-b-t-l-l-lable">
                    {t("footer.globalSites")}:
                  </div>
                  <div className="f-s-b-t-l-l-actions">
                    <a href="#">{t("footer.english")}</a> |
                    <a href="#">{t("footer.espanol")}</a> |
                    <a href="#">{t("footer.deutsch")}</a> |
                    <a href="#">{t("footer.francais")}</a> |
                    <a href="#">{t("footer.portugues")}</a> |
                    <a href="#">{t("footer.bahasa")}</a> |
                    <a href="#">{t("footer.indonesia")}</a> |
                    <a href="#">{t("footer.arabic")}</a>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="f-s-b-t-right">
              <div className="f-s-b-t-r-label">
                {t("footer.getTipsTrendsTradeUpdates")}{" "}
              </div>
              <form action="">
                <input type="text" placeholder={t("footer.enterYourEmail")} />
                <button
                  type="button"
                  className="p-btn-comp p-btn-tertiary p-btn-rounded  p-btn-md"
                >
                  {t("footer.subscribe")}
                </button>
              </form>
            </div> */}
          </div>
          <div className="f-s-b-bottom">
            <div className="f-s-b-b-left">
              <div className="dropdown d-small d-top-left">
                <a
                  href="javascript::"
                  className="dropdown-toggle p-icon-text-link p-text-link"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img src="assets/img/Icons/globe-alt.svg" alt="Language" />
                  <span>
                    {t("footer.serving")} : {t("footer.india")}
                  </span>
                  <span className="material-symbols-rounded">
                    keyboard_arrow_down
                  </span>
                </a>
                <ul className="dropdown-menu" aria-label="Language options">
                  <li>
                    <a href="#">{t("footer.enEnglish")}</a>
                  </li>
                  <li>
                    <a href="#">{t("footer.frFrench")}</a>
                  </li>
                  <li>
                    <a href="#">{t("footer.deGerman")}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="f-s-b-b-right">{t("footer.copyright")}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CatalogFooter;
