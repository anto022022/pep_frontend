"use client";
import { Sidebar } from "primereact/sidebar";
import React, { ReactNode } from "react";

type SidebarPosition = "left" | "right" | "top" | "bottom";

type ReusableSidebarProps = {
  visible: boolean;
  onHide: () => void;
  children: ReactNode;
  position?: SidebarPosition;
  className?: string;
};

const ReusableSidebar: React.FC<ReusableSidebarProps> = ({
  visible,
  onHide,
  children,
  position = "left",
  className = "",
}) => {
  return (
    <Sidebar
      visible={visible}
      position={position ?? "bottom"}
      onHide={onHide}
      className={`bottom-sheet-comp ${className}`}
      dismissable
    >
      {children}
    </Sidebar>
  );
};

export default ReusableSidebar;
