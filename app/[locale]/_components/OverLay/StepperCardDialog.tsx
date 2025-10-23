"use client";

import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import React, { ReactNode } from "react";
import Typography from "../Base/Typography";
import { ChevronLeftIcon, CloseIcon } from "../Icons/SVGIcons";
interface StepperCardDialogProps {
  title: string;
  handleClose: () => void;
  children: ReactNode;
  visible: boolean;
}

const StepperCardDialog: React.FC<StepperCardDialogProps> = ({
  title,
  handleClose,
  children,
  visible,
}) => {
  return (
    <>
      <Sidebar
        visible={visible}
        position="right"
        onHide={handleClose}
        className="offcanvas-sidebar-comp stepper-card-sidebar"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <div className="o-s-c-h-left">
                  <Link href="/app">
                    <ChevronLeftIcon />
                  </Link>
                  <Typography variant="h4" className="o-s-c-h-title">
                    {title}
                  </Typography>
                </div>
                <CloseIcon onClick={handleClose} />
              </div>
              <div className="o-s-c-body">{children}</div>
            </div>
          </>
        )}
      />
    </>
  );
};

export default StepperCardDialog;