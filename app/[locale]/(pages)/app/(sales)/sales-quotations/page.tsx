"use client"
import { useRouter } from "next/navigation";
import React from 'react'

const Page = () => {
  const router = useRouter();

  return (
    <div>
      {/* Sales Page */}
      <div onClick={() => router.push("sales-product/form")}>Quotations</div> 
    </div>
  )
}

export default Page