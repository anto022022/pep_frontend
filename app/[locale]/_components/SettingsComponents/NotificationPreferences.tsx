import Typography from "@/app/[locale]/_components/Base/Typography";
import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import SettingsButtons from "@/app/[locale]/_components/MicroComponents/SettingsButtons";
import { TableDisplayToggle } from "@/app/[locale]/_components/Pipe/TableDisplayToggle";
import {
  useGetProfileDetailsQuery,
  useUpdateNotificationDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/settingsApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { AccountSettingsStageKey } from "@/app/[locale]/_models/StoreFront";
import useSettingNextStep from "@/app/[locale]/_hooks/useSettingNextStep";

const NotificationPreferences = () => {
  const isMobile = useIsMobile(1200);
  const [updateNotificationDetails, { isLoading }] =
    useUpdateNotificationDetailsMutation();
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetProfileDetailsQuery();
  const profSetLang = useTranslations("profileSettings");
  const { nextStep } = useSettingNextStep();
  const initialData = [
    {
      mainTitle: `${profSetLang("notificationPreferences.General.title")}`,
      values: [
        {
          title: `${profSetLang(
            "notificationPreferences.General.menu_1.title"
          )}`,
          subTitle: `${profSetLang(
            "notificationPreferences.General.menu_1.subTitle"
          )}`,
          payloadKey: "message",
          isToggle: false,
          isCheckEmail: false,
          isCheckMobile: false,
        },
        {
          title: `${profSetLang(
            "notificationPreferences.General.menu_2.title"
          )}`,
          subTitle: `${profSetLang(
            "notificationPreferences.General.menu_2.subTitle"
          )}`,
          payloadKey: "followUp",
          isToggle: false,
          isCheckEmail: false,
          isCheckMobile: false,
        },
        {
          title: `${profSetLang(
            "notificationPreferences.General.menu_3.title"
          )}`,
          subTitle: `${profSetLang(
            "notificationPreferences.General.menu_3.subTitle"
          )}`,
          payloadKey: "dealAlerts",
          isToggle: false,
          isCheckEmail: false,
          isCheckMobile: false,
        },
      ],
    },
    {
      mainTitle: `${profSetLang("notificationPreferences.Platform.title")}`,
      values: [
        {
          title: `${profSetLang(
            "notificationPreferences.Platform.menu_1.title"
          )}`,
          subTitle: `${profSetLang(
            "notificationPreferences.Platform.menu_1.subTitle"
          )}`,
          payloadKey: "featureUpdate",
          isToggle: false,
          isCheckEmail: false,
          isCheckMobile: false,
        },
        {
          title: `${profSetLang(
            "notificationPreferences.Platform.menu_2.title"
          )}`,
          subTitle: `${profSetLang(
            "notificationPreferences.Platform.menu_2.subTitle"
          )}`,
          payloadKey: "productUpdates",
          isToggle: false,
          isCheckEmail: false,
          isCheckMobile: false,
        },
        {
          title: `${profSetLang(
            "notificationPreferences.Platform.menu_3.title"
          )}`,
          subTitle: `${profSetLang(
            "notificationPreferences.Platform.menu_3.subTitle"
          )}`,
          payloadKey: "promotions",
          isToggle: false,
          isCheckEmail: false,
          isCheckMobile: false,
        },
        {
          title: `${profSetLang(
            "notificationPreferences.Platform.menu_4.title"
          )}`,
          subTitle: `${profSetLang(
            "notificationPreferences.Platform.menu_4.subTitle"
          )}`,
          payloadKey: "insights",
          isToggle: false,
          isCheckEmail: false,
          isCheckMobile: false,
        },
      ],
    },
  ];

  const [notificationData, setNotificationData] = useState(initialData);

  useEffect(() => {
    if (isSuccess && data?.data) {
      const response = data?.data.notificationPreferences;

      const updatedData = initialData.map((section) => ({
        ...section,
        values: section.values.map((item) => {
          const key = item.payloadKey;
          const setting = response?.[key];

          if (setting !== undefined) {
            const isCheckEmail = setting.email;
            const isCheckMobile = setting.mobile;
            const isToggle = isCheckEmail || isCheckMobile;

            return {
              ...item,
              isCheckEmail,
              isCheckMobile,
              isToggle,
            };
          }

          return item;
        }),
      }));

      setNotificationData(updatedData);
    }
  }, [isSuccess, data]);

  const handleToggleChange = (
    sectionIndex: number,
    itemIndex: number,
    value: boolean
  ) => {
    const updated = [...notificationData];
    updated[sectionIndex].values[itemIndex].isToggle = value;
    if (value) {
      updated[sectionIndex].values[itemIndex].isCheckEmail = true;
      updated[sectionIndex].values[itemIndex].isCheckMobile = true;
    } else {
      updated[sectionIndex].values[itemIndex].isCheckEmail = false;
      updated[sectionIndex].values[itemIndex].isCheckMobile = false;
    }
    setNotificationData(updated);
  };

  const handleCheckboxChange = (
    sectionIndex: number,
    itemIndex: number,
    key: "isCheckEmail" | "isCheckMobile",
    value: boolean
  ) => {
    const updated = [...notificationData];
    const item = updated[sectionIndex].values[itemIndex];

    // Update the checked value
    item[key] = value;

    // Check if both checkboxes are true
    if (item.isCheckEmail || item.isCheckMobile) {
      item.isToggle = true;
    } else {
      item.isToggle = false;
    }

    setNotificationData(updated);
  };

  const onSubmit = async () => {
    const data = notificationData.reduce((acc, section) => {
      section.values.forEach((item) => {
        const key = item.payloadKey;
        acc[key] = {
          email: item.isCheckEmail,
          mobile: item.isCheckMobile,
        };
      });
      return acc;
    }, {} as Record<string, { email: boolean; mobile: boolean }>);

    const response = await updateNotificationDetails(data);
    if (response?.data?.statusCode === 200) {
      dispatch(
        showToast({
          title: "Success",
          message: response.data.message,
          theme: "success",
        })
      );
      nextStep(AccountSettingsStageKey.BusinessSettings);
    }
  };

  return (
    <>
      <div className="body-settings">
        <div className="notify">
          <div className="notify-header">
            <div className="dashboard-section-block">
              <Typography
                variant="h4"
                className="d-s-b-title setting-main-title"
              >
                {profSetLang("notificationPreferences.Notifications")}
              </Typography>
            </div>
            {!isMobile && (
              <>
                {" "}
                <div>
                  <Typography variant="span" className="setting-category-title">
                    {profSetLang("notificationPreferences.Email")}
                  </Typography>{" "}
                  <Typography
                    variant="span"
                    className="setting-category-title custom-mobile-title"
                  >
                    {profSetLang("notificationPreferences.Mobile")}
                  </Typography>
                </div>
              </>
            )}
          </div>
          <div className="custom-bottom-border"></div>
          <div className="notify">
            {notificationData.map((section, sectionIndex) => (
              <div key={`section-${sectionIndex}`}>
                <div className="notify-header notify-menu">
                  <div className="dashboard-section-block">
                    <Typography
                      variant="h4"
                      className="d-s-b-title setting-sub-title"
                    >
                      {section.mainTitle}
                    </Typography>
                  </div>
                </div>

                {section.values.map((item, itemIndex) => (
                  <React.Fragment key={`item-${sectionIndex}-${itemIndex}`}>
                    <div
                      className="notify-header"
                      key={`item-${sectionIndex}-${itemIndex}`}
                    >
                      <div className="notify-row">
                        <TableDisplayToggle
                          value={item.isToggle}
                          onToggle={(val) =>
                            handleToggleChange(sectionIndex, itemIndex, val)
                          }
                          id={`toggle-${sectionIndex}-${itemIndex}`}
                        />

                        <div>
                          <Typography variant="div" className="toggle-title">
                            {item.title}
                          </Typography>
                          <div>
                            {" "}
                            <Typography
                              variant="div"
                              className="toggle-sub-title"
                            >
                              {item.subTitle}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="check-box">
                        <CheckBoxInputs
                          label={
                            isMobile ? (
                              <>
                                <div className="setting-category-title">
                                  Email
                                </div>
                              </>
                            ) : (
                              ""
                            )
                          }
                          className="my-custom-checkbox d-s-b-title"
                          id={`email-${sectionIndex}-${itemIndex}`}
                          checked={item.isCheckEmail}
                          onchange={(e) =>
                            handleCheckboxChange(
                              sectionIndex,
                              itemIndex,
                              "isCheckEmail",
                              e.target.checked
                            )
                          }
                        />
                        <CheckBoxInputs
                          label={
                            isMobile ? (
                              <>
                                <div className="setting-category-title">
                                  Mobile
                                </div>
                              </>
                            ) : (
                              ""
                            )
                          }
                          className="my-custom-checkbox d-s-b-title custom-mobile-title"
                          id={`mobile-${sectionIndex}-${itemIndex}`}
                          checked={item.isCheckMobile}
                          onchange={(e) =>
                            handleCheckboxChange(
                              sectionIndex,
                              itemIndex,
                              "isCheckMobile",
                              e.target.checked
                            )
                          }
                        />
                      </div>
                    </div>
                    {!(
                      sectionIndex === initialData.length - 1 &&
                      itemIndex === section.values.length - 1
                    ) && <div className="custom-bottom-border" />}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SettingsButtons
        cancelRoute={`./`}
        onSubmit={onSubmit}
        isSubmitting={isLoading}
      />
    </>
  );
};

export default NotificationPreferences;
