"use client";

import ConnectsMessageCard from "@/app/[locale]/_components/Cards/ConnectMessageCard";

import { LeadItem } from "@/app/[locale]/_interface/ConnectInterface";

import React from "react";

interface listProps {
  leads: LeadItem[];
}

const LeadsList: React.FC<listProps> = ({ leads }) => {
  return (
    <>
      {leads?.map((lead: LeadItem) => (
        <ConnectsMessageCard data={lead} key={lead._id} />
      ))}
    </>
  );
};

export default LeadsList;
