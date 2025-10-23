import React from "react";
import Typography from "../Base/Typography";
import Link from "next/link";
import { LeftArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";

const PreviousPageButton: React.FC<{ href: string; title: string }> = ({
  href,
  title,
}) => {
  return (
    <div className="previous-btn-comp">
      <Link href={href} className="btn-comp btn-icon">
        <LeftArrowIcon />
      </Link>
      <Typography variant="span" className="p-b-c-txt">
        {title}
      </Typography>
    </div>
  );
};

export default PreviousPageButton;
