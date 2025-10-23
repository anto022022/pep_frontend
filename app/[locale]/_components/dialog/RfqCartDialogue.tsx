"use client";

import React from "react";
import Buttons from "../Buttons/Buttons";
import { Sidebar } from "primereact/sidebar";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import Typography from "../Base/Typography";
import { CloseIcon } from "../Icons/SVGIcons";
import { setIsRFQCartSidebarOpen } from "@/app/[locale]/_store/reducers/ui_store";
// import
// import OrderSummaryItem from '../EnquiryCart/OrderSummaryItem';
// import ProductSnippet from '../EnquiryCart/ProductSnippet';
import Link from "next/link";
// import type { RootState } from '@/lib/store';

const RFQCartDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isRFQCartSidebarOpen } = useAppSelector((state) => state.uiData);

  return (
    // <Sidebar
    //   visible={isRFQCartSidebarOpen}
    //   position="right"
    //   onHide={() => dispatch(setIsRFQCartSidebarOpen(false))}
    //   className="offcanvas-sidebar-comp rfq-cart-sidebar"
    //   content={() => (
    //     <>
    //       <div className="o-s-c-top">
    //         <div className="o-s-c-header">
    //           <Typography variant="h4" className="o-s-c-h-title">
    //             RFQ List (2 Total)
    //           </Typography>
    //           <CloseIcon onClick={() => dispatch(setIsRFQCartSidebarOpen(false))} />
    //         </div>

    //         <div className="o-s-c-body">
    //           <div className="order-summary-item-block">
    //             {Array.from({ length: 2 }).map((_, index) => (
    //               <OrderSummaryItem
    //                 key={index}
    //                 color="Black"
    //                 size="L"
    //                 price="$5.67 - $ 6.72"
    //                 pieces="2"
    //               >
    //                 <ProductSnippet
    //                   image="https://5.imimg.com/data5/SELLER/Default/2021/12/QG/LR/KO/144640637/nike-mens-shoes.jpg"
    //                   name="Men's T-shirt Short Sleeved Summer Trend Loose Fashion Summer Casual Half Sleeved Youth Round Neck T-shirt 180g"
    //                   minOrder="20"
    //                   deliveryDate="15 April"
    //                   isCompanyName={true}
    //                   isProductInfo={false}
    //                   companyName="Hebei Zhongsou Trading Co.Ltd."
    //                 />
    //               </OrderSummaryItem>
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       <div className="o-s-c-footer">
    //         <Link
    //           href="/market/enquiry-cart"
    //           className="wid-100"
    //           onClick={() => dispatch(setIsRFQCartSidebarOpen(false))}
    //         >
    //           <Buttons className="btn-c-primary wid-100" text="Go to RFQ List" />
    //         </Link>
    //       </div>
    //     </>
    //   )}
    // />
    <></>
  );
};

export default RFQCartDialog;
