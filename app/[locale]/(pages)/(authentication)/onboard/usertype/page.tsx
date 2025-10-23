"use client";

import Loading from "@/app/[locale]/(pages)/(authentication)/onboard/loading";
import { UserType } from "@/app/[locale]/_interface/OnboardInterface";
import {
  useGetUserTypeQuery,
  useUpdateUserTypeMutation,
} from "@/app/[locale]/_store/apiReducer/onBoardingApi";
import {
  setShowSkip,
  setUserType,
} from "@/app/[locale]/_store/reducers/onboarding_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import RightArrow from "../../../../../../assets/img/icons/arrow-right.svg";
import Square from "../../../../../../assets/img/icons/format-square.svg";
import MobileService from "../../../../../../assets/img/icons/mobile-service.svg";
import Shop from "../../../../../../assets/img/icons/shop.svg";
import Typography from "../../../../_components/Base/Typography";
import ButtonIconRight from "../../../../_components/Buttons/ButtonIconRight";
import ServiceCard from "../../../../_components/OnBoarding/ServiceCard";

export default function Page() {
  const [selectedService, setSelectedService] = useState<UserType | null>(null);
  const t = useTranslations("userType");
  const dispatch = useAppDispatch();
  const services = [
    {
      id: 1,
      title: t("services.seller.title"),
      subTitle: t("services.seller.subtitle"),
      icon: Shop,
      value: "seller",
    },
    {
      id: 2,
      title: t("services.buyer.title"),
      subTitle: t("services.buyer.subtitle"),
      icon: MobileService,
      value: "buyer",
    },
    {
      id: 3,
      title: t("services.both.title"),
      subTitle: t("services.both.subtitle"),
      icon: Square,
      value: "both",
    },
  ];

  const { data, isSuccess, isLoading, refetch } = useGetUserTypeQuery();

  const [updateUserType, { isLoading: isSubmitting }] =
    useUpdateUserTypeMutation();

  useEffect(() => {
    refetch();
    dispatch(setShowSkip(false));
  }, []);

  useEffect(() => {
    if (data && isSuccess) {
      if (data?.data?.userType) {
        setSelectedService(data.data.userType);
      }
    }
  }, [data, isSuccess]);

  // useEffect(() => {
  //   console.log("userType", selectedService);
  // }, [selectedService]);

  const handleServiceSelection = (value: UserType) => {
    setSelectedService(value);
  };

  const handleContinueClick = async () => {
    if (!selectedService) return;
    try {
      await updateUserType({
        userType: selectedService,
      }).unwrap();
      dispatch(setUserType(selectedService));
    } catch (error) {
      console.error("Error updating userType:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="form-gaps forms-container f-c-md choose-service-main">
      <div className="form-title-wrap">
        <Typography variant="h1" className="title-txt">
          {t("title")}
        </Typography>
        <Typography variant="h2" className="sub-txt">
          {t("subtitle")}
        </Typography>
      </div>
      <div className="service-card-group">
        {services.map((item) => (
          <ServiceCard
            key={item.id}
            htmlFor={item.title}
            icon={item.icon}
            title={item.title}
            subtitle={item.subTitle}
            defaultChecked={item.value === selectedService}
            onChange={() => handleServiceSelection(item.value as UserType)}
          />
        ))}
      </div>
      <ButtonIconRight
        name={isSubmitting ? t("processing") : t("continue")}
        icon={RightArrow}
        className={"service-continue-btn"}
        onClick={handleContinueClick}
        disabled={isSubmitting || !selectedService}
      />
    </div>
  );
}
