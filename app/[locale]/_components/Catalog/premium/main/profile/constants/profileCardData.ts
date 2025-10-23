/**
 * Profile Card Data Constants
 *
 * Centralized data for profile cards used across desktop and mobile components.
 * This ensures consistency and makes it easy to update profile information.
 */

import securityIcon from "../../../../../../../../public/img/icons/security-user.svg";
import verifyIcon from "../../../../../../../../public/img/icons/verify.svg";
import globalIcon from "../../../../../../../../public/img/icons/global.svg";
import badgeCheckIcon from "../../../../../../../../public/img/icons/badge-check.svg";

export interface ProfileCardData {
  icon: any;
  label: string;
  value: string;
  alt: string;
}

export const PROFILE_CARDS_DATA: ProfileCardData[] = [
  {
    icon: securityIcon,
    label: "Legal Owner Name",
    value: "Rahul",
    alt: "security",
  },
  {
    icon: verifyIcon,
    label: "Legal Status",
    value: "Registered",
    alt: "verify",
  },
  {
    icon: globalIcon,
    label: "Business Type",
    value: "Retailer",
    alt: "global",
  },
  {
    icon: badgeCheckIcon,
    label: "Industry",
    value: "Apparel & Fashion",
    alt: "badge-check",
  },
];
