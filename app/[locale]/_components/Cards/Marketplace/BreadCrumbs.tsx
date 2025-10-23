import React from "react";

import { MypeppagoraIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import { BreadcrumbItemWithRef } from "@/app/[locale]/_utility/breadcrumbTrail";
import Link from "next/link";
// import { useRouter } from "next/router";

export interface BreadcrumbItem {
  type: "c" | "sc" | "pc" | "detail" | "sc-2";
  name: string;
  path: string;
}

interface BreadCrumbsProps {
  data: BreadcrumbItemWithRef[];
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ data }) => {
  const dataLastindex = data.length - 1;
  // const router = useRouter();

  return (
    <div className="bread-crumbs-comp">
      <div className="b-c-c-item">
        <Link href={"/"}>
          <MypeppagoraIcon />
        </Link>
        <span className="b-c-c-i-txt b-c-c-i-slash">/</span>
      </div>
      {data.map((item, index) =>
        index !== dataLastindex ? (
          <Link
            className="b-c-c-item"
            href={{
              pathname:
                item.type !== "sc-2"
                  ? `../${item.type}/${item.path}`
                  : `/${item.path}`,
              query: { ref: item?.encryptedRef ?? "" },
            }}
            key={index}
          >
            <span className="b-c-c-i-txt">{item.name}</span>
            <span className="b-c-c-i-txt b-c-c-i-slash">/</span>
          </Link>
        ) : (
          <span className="b-c-c-item" key={index}>
            <span className="b-c-c-i-txt">{item.name}</span>
            <span className="b-c-c-i-txt b-c-c-i-slash">/</span>
          </span>
        )
      )}
    </div>
  );
};

export default BreadCrumbs;
