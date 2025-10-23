"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import DashboardBlock from "@/app/[locale]/_components/Common/DashboardBlock";
import {
  MobHamBurgerIcon,
  MoreIcon,
  SearchIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import MobileNavOptions from "@/app/[locale]/_components/Navbar/MobileNavOptions";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { MenuItem, mobileNavModel } from "@/app/[locale]/_models/navBarModels";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const isMobile = useIsMobile(1200);
  const router = useRouter();
  const t = useTranslations();
  const [navItem, setNavItem] = useState<MenuItem | null>(null);

  const [mobileNavState, setMobileNavState] = useState(mobileNavModel);

  const userType = useAppSelector(
    (state: RootState) => state.userData.userType
  );

  useEffect(() => {
    // Filter mobileNavModel based on userType
    const filteredNav = mobileNavModel.filter((item) => {
      // Hide Sales for buyers
      if (
        userType === "buyer" &&
        item.title === "common.mobileNav.sales.title"
      ) {
        return false;
      }
      if (
        userType === "buyer" &&
        item.title === "common.mobileNav.business.title"
      ) {
        return false;
      }
      if (
        userType === "buyer" &&
        item.title === "common.mobileNav.catalog.title"
      ) {
        return false;
      }
      // Hide Sourcing for sellers
      if (
        userType === "seller" &&
        item.title === "common.mobileNav.sourcing.title"
      ) {
        return false;
      }
      return true;
    });

    setMobileNavState(filteredNav);
  }, [userType]);

  const handleNavLink = (item: MenuItem) => {
    if (item.children) {
      setNavItem(item);
    } else {
      setNavItem(null);
      router.push(item.path);
    }
  };

  return (
    <>
      {!isMobile ? (
        <div className="body-preview">
          <DashboardBlock />
        </div>
      ) : (
        <div className="body-preview-mob">
          <MobileNavBar isLogoShow path="">
            <SearchIcon className="search-icon" />
            <MobHamBurgerIcon />
          </MobileNavBar>
          <div className="b-p-m-body">
            {navItem !== null ? (
              <MobileNavOptions
                title={navItem?.title}
                icon={navItem?.icon}
                items={navItem?.children || []}
                setNavItem={setNavItem}
              />
            ) : (
              <div className="compliance-mob-wrapper c-m-w-dashboard">
                <DashboardBlock />
              </div>
            )}
          </div>
          <div className="b-p-m-footer">
            <div className="mobile-navigation-bottom-comp">
              {mobileNavState?.map((filteredItem, itemIndex) => (
                <div
                  className={`m-n-b-c-item ${filteredItem.title == navItem?.title ? "active" : ""
                    }`}
                  key={`section-${itemIndex}`}
                  onClick={() => handleNavLink(filteredItem)}
                >
                  {filteredItem.icon}
                  <Typography variant="span" className="m-n-b-c-i-txt">
                    {t(filteredItem.title)}
                  </Typography>
                </div>
              ))}
              <div className="m-n-b-c-item">
                <MoreIcon className={"more-icon"} />
                <Typography variant="span" className="m-n-b-c-i-txt">
                  More
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
