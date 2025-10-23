'use client';
import React, { ReactNode } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import MobPageNavbar from '@/components/Common/MobPageNavbar';
import DashboardNavbar from '@/components/DashboardComponents/DashboardNavbar';

interface ResponsiveNavbarProps {
  mobileTitle: string;
  mobilePath: string;
  children?: ReactNode;
  breakPoint?: number;
  headIcon?: ReactNode;
  onClick?: () => void;
  isRFQActive?: boolean;
  isLogoShow?: boolean;
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  mobileTitle,
  mobilePath,
  children,
  breakPoint,
  headIcon,
  onClick,
  isRFQActive,
  isLogoShow,
}) => {
  const isMobile = useIsMobile(breakPoint);

  return isMobile ? (
    <MobPageNavbar
      path={mobilePath}
      title={mobileTitle}
      headIcon={headIcon}
      onClick={onClick}
      isRFQActive={isRFQActive}
      isLogoShow={isLogoShow}
    >
      {children}
    </MobPageNavbar>
  ) : (
    <DashboardNavbar />
  );
};

export default ResponsiveNavbar;
