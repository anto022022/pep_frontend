"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarCloseIcon from "../../../../public/img/icons/sidebarcloseicon.svg";
import { LocaleType, sidebarNav } from "../../_models/StoreFront";
import { setCurrentForm } from "../../_store/reducers/stepper_status_store";
import { setIsSidebarClose } from "../../_store/reducers/ui_store";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import { SettingsIcon } from "../Icons/SVGIcons";

export const SideBar = () => {
  const pathname = usePathname();
  const t = useTranslations("common");

  const params = useParams();
  const { locale } = params;
  const currentLocale: LocaleType = Array.isArray(locale)
    ? (locale[0] as LocaleType)
    : (locale as LocaleType) || "en";

  const dispatch = useAppDispatch();

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [sidebarNavState, setSidebarNavState] = useState(sidebarNav);

  const isSidebarClose = useAppSelector(
    (state: RootState) => state.uiData.isSidebarClose
  );
  const userType = useAppSelector(
    (state: RootState) => state.userData.userType
  );

  useEffect(() => {
    const filteredNav = sidebarNav
      .filter((section) => {
        // Remove the entire Setup section for buyers
        // if (userType === "buyer" && section.section === "sidebar.setup") {
        //   return false;
        // }
        return true;
      })
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          // Hide Sales for buyers
          if (userType === "buyer" && item.title === "sidebar.sales") {
            return false;
          }
          // Hide Catalog Website for buyers
          if (userType === "buyer" && item.title === "sidebar.catalogWebsite") {
            return false;
          }
          // Hide Sourcing for sellers
          if (userType === "seller" && item.title === "sidebar.sourcing") {
            return false;
          }
          return true;
        }),
      }));

    setSidebarNavState(filteredNav);
  }, [userType]);

  useEffect(() => {
    sidebarNavState.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          item.children.forEach((child) => {
            if (
              `/${currentLocale}${child.path}` === pathname ||
              pathname.startsWith(`/${currentLocale}${child.path}` + "/")
            ) {
              setOpenSections((prev) => ({
                ...prev,
                [item.title]: true,
              }));
            }
          });
        }
      });
    });
  }, [pathname]);

  const toggleSection = (title: string) => {
    if (isSidebarClose && !openSections[title]) {
      dispatch(setIsSidebarClose(false));
      setOpenSections((prev) => ({
        ...prev,
        [title]: true,
      }));
      return;
    }
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  //Sidebar Close/Open based on Screen Size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1600) {
        dispatch(setIsSidebarClose(true));
      } else {
        dispatch(setIsSidebarClose(false));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);
  //Sidebar Close/Open based on Screen Size

  const handleSideBarClose = () => {
    if (isSidebarClose) {
      sidebarNavState.forEach((section) => {
        section.items.forEach((item) => {
          if (item.children) {
            item.children.forEach((child) => {
              if (
                `/${currentLocale}${child.path}` === pathname ||
                pathname.startsWith(`/${currentLocale}${child.path}` + "/")
              ) {
                setOpenSections((prev) => ({
                  ...prev,
                  [item.title]: true,
                }));
              }
            });
          }
        });
      });
      dispatch(setIsSidebarClose(false));
      return;
    }
    setOpenSections({});
    dispatch(setIsSidebarClose(true));
  };
  const handleRoute = () => {
    dispatch(setCurrentForm(""));
  };

  return (
    <div
      className={`dashboard-sidebar-comp ${
        isSidebarClose ? "close-sidebar" : ""
      }`}
    >
      <div className="d-s-c-top">
        {sidebarNavState.map((section, index) => (
          <div className="s-c-nav-group" key={index}>
            <span className="nav-title">{t(section.section)}</span>
            {section.items.map((item, subIndex) => {
              const isActive =
                pathname === `/${currentLocale}${item.path}` ||
                (item.path !== "/app" &&
                  pathname.startsWith(`/${currentLocale}${item.path}/`)) ||
                (item.children &&
                  pathname.startsWith(`/${currentLocale}${item.path}-`));
              return item.children ? (
                <div
                  className={`s-c-nav-block ${isActive ? "active" : ""}`}
                  key={`${subIndex}`}
                >
                  <span
                    className="s-c-nav-items wthout-link"
                    onClick={() => toggleSection(item.title)}
                  >
                    {item.icon}
                    <span className="s-c-n-i-txt">{t(item.title)}</span>
                  </span>
                  {openSections[item.title] && (
                    <div className="s-c-nav-children">
                      {item.children.map((child, childIndex) => {
                        const isChildActive =
                          pathname === `/${currentLocale}${child.path}` ||
                          pathname.startsWith(
                            `/${currentLocale}${child.path}` + "/"
                          );

                        const isBeforeActive =
                          item.children.findIndex(
                            (c) => pathname === `/${currentLocale}${c.path}`
                          ) > childIndex;
                        return (
                          <Link
                            className={`s-c-nav-items ${
                              isChildActive ? "active" : ""
                            } ${isBeforeActive ? "line" : ""}`}
                            href={`/${currentLocale}${child.path}`}
                            key={childIndex}
                            onClick={handleRoute}
                          >
                            <span className="s-c-n-i-txt">
                              {t(child.title)}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`s-c-nav-block ${isActive ? "active" : ""}`}
                  key={`${subIndex}`}
                >
                  <Link
                    href={`/${currentLocale}${item.path}`}
                    key={index}
                    className="s-c-nav-items"
                  >
                    {item.icon}
                    <span className="s-c-n-i-txt">{t(item.title)}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="d-s-c-bottom">
        <div className="s-c-nav-group b-t-1">
          {/* <div className='s-c-nav-block'>
            <Link href={'/'} className='s-c-nav-items'>
              <SupportIcon />
              <span className="s-c-n-i-txt">Support</span>
            </Link>
          </div> */}
          <div
            className={`s-c-nav-block ${
              pathname === `/${currentLocale}/app/settings` ? "active" : ""
            }`}
          >
            <Link
              href={`/${currentLocale}/app/settings`}
              className="s-c-nav-items"
            >
              <SettingsIcon />
              <span className="s-c-n-i-txt">{t("sidebar.settings")}</span>
            </Link>
          </div>
        </div>
        <div className="s-c-close-block">
          <Image
            src={SidebarCloseIcon}
            width={23}
            height={23}
            alt="Close"
            onClick={handleSideBarClose}
            className="sidebar-close-icon"
          ></Image>
        </div>
      </div>
    </div>
  );
};
