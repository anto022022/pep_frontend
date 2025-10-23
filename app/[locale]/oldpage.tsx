"use client";
import Typography from "./_components/Base/Typography";
import AuthFooter from "./_components/Authentication/AuthFooter";
import AuthNavBar from "./_components/Authentication/AuthNavbar";
import Link from "next/link";
import React, { use, useEffect } from "react";
import { useGetCategoryListQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import { useSearchParams } from "next/navigation";
import { useVerifyCredential } from "@/app/[locale]/_hooks/useVerifyCredential";
import Loading from "@/app/[locale]/_components/Common/Loading";

export default function Home({ params }: { params: Promise<any> }) {
  const unwrappedParams = use(params);
  const locale = unwrappedParams?.locale || "en";
  const { data: categoriesList, isLoading: categoryLoading } =
    useGetCategoryListQuery({ search: "" });

  const searchParams = useSearchParams();
  const userId= searchParams.get("userId") || "";
  const otp = searchParams.get("otp") || "";

  const { isVerifyLoading, verify } = useVerifyCredential();
  useEffect(() => {
    if (userId && otp) {
      verify({ locale, userId, otp });
    }
  }, [userId, otp]);

  if (userId && otp && isVerifyLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="auth-layout">
          <AuthNavBar />
        <div className="card-catergory-nav-group">
          {!categoryLoading && (
            <div className="category-list mt-6 text-center">
              <div className="text-sm text-gray-700 flex flex-wrap justify-center items-center gap-1">
                {!categoryLoading && (
                  <div className="category-list">
                    <div className="category-links">
                      {categoriesList?.data.map((category, index) => (
                        <React.Fragment key={category._id}>
                          <Link
                            href={`/${locale}/c/${category.liveUrl}`}
                            className="category-link"
                          >
                            {category.name}
                          </Link>
                          {index !== categoriesList.data.length - 1 && (
                            <span className="separator">|</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        <div className="body-wrapper">
          <div className="form-box-shadow form-gaps forms-container">
            <div className="form-title-wrap">
              <Typography variant="h1" className="title-txt">
                Welcome to Pepagora
              </Typography>
              <Typography variant="h2" className="sub-txt">
                Please Sign In or Sign Up below.
              </Typography>
            </div>
            <div className="providers-group">
              <Link
                href={`/${locale}/authenticate`}
                className={`btn-comp btn-c-primary btn-c-lg fnt-w-400`}
              >
                Sign In & Sign Up
              </Link>
            </div>
          </div>
        </div>
        </div>

        <AuthFooter />
      </div>
    </>
  );
}
