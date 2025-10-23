import {
  BusinessProfileIcon,
  CatalogIcon,
  MypeppagoraIcon,
  SalesIcon,
  SettingsIcon,
  SourcingIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import { ReactNode } from "react";

export type MenuItem = {
  title: string;
  path: string;
  icon?: ReactNode;
  description?: string;
  children?: MenuItem[];
};

export const mobileNavModel = [
  {
    title: "common.mobileNav.home.title",
    path: "/app",
    icon: <MypeppagoraIcon />,
  },
  {
    title: "common.mobileNav.sales.title",
    path: "/app/sales",
    icon: <SalesIcon />,
    children: [
      {
        title: "common.mobileNav.sales.productsISell.title",
        description: "common.mobileNav.sales.productsISell.description",
        path: "/app/sales-product",
      },
      {
        title: "common.mobileNav.sales.sellOffer.title",
        description: "common.mobileNav.sales.sellOffer.description",
        path: "/app/sales-sell-offer",
      },
      {
        title: "common.mobileNav.sales.leads.title",
        description: "common.mobileNav.sales.leads.description",
        path: "/app/leads",
      },
      {
        title: "common.mobileNav.sales.connects.title",
        description: "common.mobileNav.sales.connects.description",
        path: "/app/sales-connect",
      },
    ],
  },
  {
    title: "common.mobileNav.sourcing.title",
    path: "/app/sourcing",
    icon: <SourcingIcon />,
    children: [
      {
        title: "common.mobileNav.sourcing.rfqSupplierMatch.title",
        description: "common.mobileNav.sourcing.rfqSupplierMatch.description",
        path: "/app/sourcing-rfq",
      },
    ],
  },
  {
    title: "common.mobileNav.business.title",
    path: "/app/business-profile",
    icon: <BusinessProfileIcon />,
  },
  {
    title: "common.mobileNav.settings.title",
    path: "/app/settings",
    icon: <SettingsIcon />,
  },
  {
    title: "common.mobileNav.catalog.title",
    path: "/app/catalog",
    icon: <CatalogIcon />,
  },
];
