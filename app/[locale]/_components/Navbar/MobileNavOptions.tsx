"use client";
import { MenuItem } from "@/app/[locale]/_models/navBarModels";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import Typography from "../Base/Typography";
import { ChevronRightIcon } from "../Icons/SVGIcons";

interface NavOptionsProps {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  setNavItem: React.Dispatch<React.SetStateAction<MenuItem | null>>;
}

const MobileNavOptions: React.FC<NavOptionsProps> = ({
  title,
  icon,
  items,
  setNavItem,
}) => {
  const t = useTranslations();
  const router = useRouter();
  // const renderContent = (): RenderedContent => {
  //   switch (navTitle) {
  //     case "Sales":
  //       return {
  //         title: "Sales",
  //         icon: <SalesIcon />,
  //         items: [
  //           {
  //             title: "Products I Sell",
  //             description: "Manage and update your active product listings.",
  //             path: "/app/sales-product",
  //           },
  //           {
  //             title: "Sell Offer",
  //             description: "Post limited-time deals and discounts.",
  //             path: "/app/sales-sell-offer",
  //           },
  //           {
  //             title: "Leads",
  //             description: "View and manage buyer inquiries.",
  //             path: "/app/leads",
  //           },
  //           {
  //             title: "Connects",
  //             description: "Access and organize your business contacts.",
  //             path: "/app/sales-connect",
  //           },
  //         ],
  //       };

  //     case "Sourcing":
  //       return {
  //         title: "Sourcing",
  //         icon: <SourcingIcon />,
  //         items: [
  //           {
  //             title: "RFQ & Supplier Match",
  //             description: "View and manage buyer inquiries.",
  //             path: "/app/sourcing-rfq",
  //           },
  //         ],
  //       };

  //     default:
  //       return {
  //         title: "Home",
  //         icon: <MypeppagoraIcon />,
  //         items: [],
  //       };
  //   }
  // };

  const handleRoute = (path: string) => {
    router.push(path);
    setNavItem(null);
  };
  return (
    <div className="mobile-navigation-items-block">
      <div className="m-n-i-b-banner">
        <div className="m-n-i-b-left">
          <Typography className="m-n-i-b-txt" variant="span">
            {t(title)}
          </Typography>
        </div>
        <div className="m-n-i-b-right">{icon}</div>
      </div>
      <div className="m-n-i-b-body">
        <div className="m-n-i-b-b-group">
          {items.map((item, index) => (
            <span
              onClick={() => handleRoute(item.path)}
              className="m-n-i-b-b-g-item"
              key={index}
            >
              <div className="m-n-i-b-b-g-i-left">
                <Typography className="m-n-i-b-b-g-title">
                  {t(item.title)}
                </Typography>
                <Typography className="m-n-i-b-b-g-subtxt">
                  {t(item.description)}
                </Typography>
              </div>
              <div className="m-n-i-b-b-g-i-right">
                <ChevronRightIcon />
              </div>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNavOptions;
