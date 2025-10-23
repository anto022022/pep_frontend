
"use client";
import { redirect, useParams } from "next/navigation";
export default function NotFound() {
  const { locale } = useParams();
  // redirect(`/${locale}/404`);
}

