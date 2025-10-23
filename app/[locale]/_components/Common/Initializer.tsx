"use client";
import React, { useEffect } from "react";
import useSession from "@/app/[locale]/_hooks/useSession";

const Initializer = () => {
  const { loadSession } = useSession();
  useEffect(() => {
    loadSession();
  }, []);
  return <></>;
};

export default Initializer;
