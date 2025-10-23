"use client";
// import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import {
  // ProfileHelp,
  ProfileIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import useLogout from "@/app/[locale]/_hooks/useLogout";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import documentUploadIcon from "@/public/img/icons/document-upload.svg";
import inboxIcon from "@/public/img/icons/inbox.svg";
import logoutIcon from "@/public/img/icons/Log out.svg";
import prodISellIcon from "@/public/img/icons/prod-i-sell.svg";
import settingIcon from "@/public/img/icons/setting-2.svg";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import "./style.css";

const ProfileWithMenus = () => {
  const op = useRef<OverlayPanel>(null);
  const cookies = useCookies();
  const userSession = cookies.getCookie("userSession");
  const userData = useAppSelector((state: RootState) => state.userData);
  const t = useTranslations("common.navbar");
  const { logout } = useLogout();
  const login = useLoginRedirect();

  const [activeTab, setActiveTab] = useState<"buying" | "selling">("buying");

  const sellerTools = [
    {
      path: "/app/leads",
      img: inboxIcon,
      alt: "Icon",
      name: t("leads"),
    },
    {
      path: "/app/sales-product",
      img: prodISellIcon,
      alt: "Icon",
      name: t("productsISell"),
    },
  ];

  const businessTools = [
    // {
    //   path: "/app/sourcing-rfq",
    //   img: documentTextIcon,
    //   alt: "document-text",
    //   name: t("quotes"),
    // },
    // {
    //   path: "#",
    //   img: inboxIcon,
    //   alt: "Inbox",
    //   name: "Messages",
    // },
    {
      path: "/app/sourcing-rfq",
      img: documentUploadIcon,
      alt: "document-upload",
      name: t("postRFQ"),
    },
    // {
    //   path: "#",
    //   img: profile2UserIcon,
    //   alt: "profile-2user",
    //   name: "My Suppliers",
    // },
  ];

  const accountActions = [
    {
      path: "/app/settings/account-settings",
      img: settingIcon,
      alt: "setting-2",
      name: t("settings"),
    },
    // {
    //   path: "/app",
    //   img: helpIcon,
    //   alt: "Help circle",
    //   name: t("help"),
    // },
    {
      onClick: logout,
      img: logoutIcon,
      alt: "Log out",
      name: t("signOut"),
    },
  ];

  return (
    <div className="rfq-summary-block">
      <div className="rfq-cart-trigger" onClick={(e) => op.current?.toggle(e)}>
        <ProfileIcon />
      </div>
      <OverlayPanel ref={op} className="rfq-summary-overlay dropdown-menu-wrap">
        <div className="rfq-summary-dropdown-block ">
          <div className="dropdown-menu-scroll">
            {/* SOF Profile Dropdown  */}

            {/* EOF Profile Dropdown  */}

            {!userSession ? (
              <div className="d-m-item p-user-login">
                <div className="p-u-l-title">Welcome to pepagora!</div>
                <button
                  onClick={() => login()}
                  type="button"
                  className="p-btn-comp p-btn-primary p-btn-rounded  p-btn-md"
                >
                  {t("login")}
                </button>
                <div className="p-u-new-customer">
                  <span>{t("newCustomer")}</span>
                  <Link href={"/authenticate"}>{t("signup")}</Link>
                </div>
              </div>
            ) : (
              /////
              // <div className="d-m-item p-user-login">
              //   <div className="p-u-l-title">{t("welcome")}</div>
              //   <Buttons
              //     className={"btn-c-primary btn-c-sm"}
              //     text={t("login")}
              //     onClick={() => login()}
              //   />
              //   <div className="p-u-new-customer">
              //     <span>{t("newCustomer")}</span>
              //     <Link href={"/authenticate"}>{t("signup")}</Link>
              //   </div>
              // </div>
              <>
                <div className="d-m-item p-user-logged">
                  <div className="p-u-l-title">
                    {t("hi")}, {userData?.userName}
                  </div>
                  <div className="p-u-new-customer">
                    <span>{userData?.businessName}</span>
                    <Link
                      href={`/app/settings/profile-settings`}
                      onClick={() => op.current?.hide()}
                    >
                      {t("viewProfile")}
                    </Link>
                  </div>
                </div>
                {userData?.userType === "both" && (
                  <div className="d-m-item">
                    {/* Tab Switch Buttons */}
                    <ul className="nav nav-pills" id="modeTab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${activeTab === "buying" ? "active" : ""
                            }`}
                          onClick={() => setActiveTab("buying")}
                        >
                          {t("buyingMode")}
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${activeTab === "selling" ? "active" : ""
                            }`}
                          onClick={() => setActiveTab("selling")}
                        >
                          {t("sellingMode")}
                        </button>
                      </li>
                    </ul>

                    {/* Tab Content */}
                    <div className="tab-content">
                      {activeTab === "buying" && (
                        <div className="tab-pane active">
                          <div className="d-m-i-title">
                            {t("businessTools")}
                          </div>
                          {businessTools.map((tool, index) => (
                            <Link
                              href={tool.path}
                              key={index}
                              onClick={() => op.current?.hide()}
                            >
                              <Image
                                src={tool.img}
                                alt={tool.alt}
                                width={20}
                                height={20}
                                className="img-fluid"
                              />{" "}
                              {tool.name}
                            </Link>
                          ))}
                        </div>
                      )}

                      {activeTab === "selling" && (
                        <div className="tab-pane active">
                          <div className="d-m-i-title">{t("sellingTools")}</div>
                          {sellerTools.map((tool, index) => (
                            <Link
                              href={tool.path}
                              key={index}
                              onClick={() => op.current?.hide()}
                            >
                              <Image
                                src={tool.img}
                                alt={tool.alt}
                                width={20}
                                height={20}
                                className="img-fluid"
                              />{" "}
                              {tool.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {userData?.userType === "buyer" && (
                  <div className="d-m-item">
                    <div className="d-m-i-title">{t("businessTools")}</div>
                    {businessTools.map((tool, index) => (
                      <Link
                        href={tool.path}
                        key={index}
                        onClick={() => op.current?.hide()}
                      >
                        <Image
                          src={tool.img}
                          alt={tool.alt}
                          width={20}
                          height={20}
                          className="img-fluid"
                        />{" "}
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
                {userData?.userType === "seller" && (
                  <div className="d-m-item">
                    <div className="d-m-i-title">{t("sellingTools")}</div>
                    {sellerTools.map((tool, index) => (
                      <Link
                        href={tool.path}
                        key={index}
                        onClick={() => op.current?.hide()}
                      >
                        <Image
                          src={tool.img}
                          alt={tool.alt}
                          width={20}
                          height={20}
                          className="img-fluid"
                        />{" "}
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
                <div className="d-m-item d-m-i-last d-m-b-radius">
                  {accountActions.map((action, index) =>
                    action.onClick ? (
                      <span
                        key={index}
                        onClick={action.onClick}
                        className="d-m-link-button"
                      >
                        <Image
                          src={action.img}
                          alt={action.alt}
                          width={20}
                          height={20}
                          className="img-fluid"
                        />{" "}
                        {action.name}
                      </span>
                    ) : (
                      <Link
                        href={action.path}
                        key={index}
                        onClick={() => op.current?.hide()}
                      >
                        <Image
                          src={action.img}
                          alt={action.alt}
                          width={20}
                          height={20}
                          className="img-fluid"
                        />{" "}
                        {action.name}
                      </Link>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default ProfileWithMenus;
