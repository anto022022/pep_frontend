import Typography from "@/app/[locale]/_components/Base/Typography";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import SettingsButtons from "@/app/[locale]/_components/MicroComponents/SettingsButtons";
import { TableDisplayToggle } from "@/app/[locale]/_components/Pipe/TableDisplayToggle";
import {
  useGetBusinessDetailsQuery,
  useGetProfileDetailsQuery,
  useUpdateDataPrivacyDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/settingsApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import useSettingNextStep from "@/app/[locale]/_hooks/useSettingNextStep";
import { AccountSettingsStageKey } from "@/app/[locale]/_models/StoreFront";

const DataPrivacySettings = () => {
  const [checked, setChecked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [updateDataPrivacyDetails, { isLoading }] =
    useUpdateDataPrivacyDetailsMutation();
  const dispatch = useDispatch();
  const { data: userData } = useGetProfileDetailsQuery();
  const accSetLang = useTranslations("accountSettings");
  const { nextStep } = useSettingNextStep();

  const handleToggleChange = (
    sectionIndex: number,
    itemIndex: number,
    value: boolean
  ) => {
    const updated = [...privacyData];
    updated[sectionIndex].values[itemIndex].isToggle = value;
    setPrivacyData(updated);
  };
  const { data } = useGetBusinessDetailsQuery();

  const initialData = [
    {
      mainTitle: accSetLang("dataPrivacySettings.DataSharingPreferences"),
      values: [
        {
          title: accSetLang("dataPrivacySettings.Switch_1.title"),
          subTitle: accSetLang("dataPrivacySettings.Switch_1.subTitle"),
          isToggle: false,
        },
        {
          title: accSetLang("dataPrivacySettings.Switch_2.title"),
          subTitle: accSetLang("dataPrivacySettings.Switch_2.subTitle"),
          isToggle: false,
        },
      ],
    },
  ];
  const [privacyData, setPrivacyData] = useState(initialData);

  useEffect(() => {
    if (data?.data?.dataPrivacySettings) {
      const {
        shareWithTrustedPartners,
        dataForAnalytics,
        consentToProcessData,
      } = data.data.dataPrivacySettings;

      // Deep copy to avoid state mutation
      const updatedPrivacyData = [...initialData];

      // Set toggles based on API response
      updatedPrivacyData[0].values[0].isToggle = shareWithTrustedPartners;
      updatedPrivacyData[0].values[1].isToggle = dataForAnalytics;

      setPrivacyData(updatedPrivacyData);
      setChecked(consentToProcessData);
    }
  }, [data]);

  const onSubmit = async () => {
    if (!checked) {
      setError("Accept to enable advertising features from our partners.");
    } else {
      let param = {
        shareWithTrustedPartners:
          privacyData?.[0]?.values?.[0]?.isToggle ?? false,
        dataForAnalytics: privacyData?.[0]?.values?.[1]?.isToggle ?? false,
        consentToProcessData: checked ?? false,
      };
      const response = await updateDataPrivacyDetails(param);

      if (response?.data?.statusCode === 200) {
        setError("");
        dispatch(
          showToast({
            title: "Success",
            message: response.data.message,
            theme: "success",
          })
        );
        nextStep(AccountSettingsStageKey.SubscriptionDetails);
      }
    }
  };

  return (
    <>
      <div className="body-settings">
        <div className="data-privacy-settings">
          <div className="notify">
            <div className="notify-header notify-menu">
              <div className="dashboard-section-block">
                <Typography
                  variant="h4"
                  className="d-s-b-title setting-sub-title"
                >
                  {`${accSetLang("dataPrivacySettings.PersonalDataControl")} :`}
                </Typography>
              </div>
            </div>

            <div className="data-privacy-box">
              <div className="section">
                <Typography variant="h4" className="data-privacy-title">
                  {`${accSetLang("dataPrivacySettings.PersonalInformation")} :`}
                </Typography>
                {userData?.data?.firstName ? (
                  <>
                    <Typography variant="p" className="data-privacy-info-title">
                      {userData?.data?.firstName} {userData?.data?.lastName}{" "}
                      {userData?.data?.middleName}{" "}
                    </Typography>
                    <Typography
                      variant="p"
                      className="data-privacy-info-subtitle"
                    >
                      {userData?.data?.workEmail}{" "}
                    </Typography>
                    <Typography
                      variant="p"
                      className="data-privacy-info-subtitle"
                    >
                      {userData?.data?.workPhoneNo?.countryCode}{" "}
                      {userData?.data?.workPhoneNo?.number}{" "}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="p" className="data-privacy-info-title">
                    {`${accSetLang(
                      "dataPrivacySettings.NoPersonalInformation"
                    )}`}
                  </Typography>
                )}
              </div>
              <div className="section">
                <Typography variant="h4" className="data-privacy-title">
                  {`${accSetLang("dataPrivacySettings.CompanyInformation")} :`}
                </Typography>
                <Typography variant="p" className="data-privacy-info-title">
                  {userData?.data?.jobTitle}{" "}
                </Typography>
                {userData?.data?.personalAddress?.addressLine ? (
                  <>
                    <Typography
                      variant="p"
                      className="data-privacy-info-subtitle"
                    >
                      {userData?.data?.personalAddress?.addressLine} <br />
                      {userData?.data?.personalAddress?.city} ,
                      {userData?.data?.personalAddress?.state}{" "}
                    </Typography>
                    <Typography
                      variant="p"
                      className="data-privacy-info-subtitle"
                    >
                      {userData?.data?.personalAddress?.country.name} -{" "}
                      {userData?.data?.personalAddress?.pinCode}{" "}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="p" className="data-privacy-info-title">
                    {`${accSetLang(
                      "dataPrivacySettings.NoCompanyInformation"
                    )}`}
                  </Typography>
                )}
              </div>
            </div>

            <div className="custom-bottom-border" />
            {privacyData.map((section, sectionIndex) => (
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
                          <Typography variant="h4" className="toggle-title">
                            {item.title}
                          </Typography>
                          <div>
                            {" "}
                            <Typography
                              variant="h4"
                              className="toggle-sub-title"
                            >
                              {item.subTitle}
                            </Typography>
                          </div>
                        </div>
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
            <div className="custom-bottom-border" />
            <div className="notify-header notify-menu">
              <div className="dashboard-section-block">
                <Typography
                  variant="h4"
                  className="d-s-b-title setting-sub-title"
                >
                  {`${accSetLang("dataPrivacySettings.TermsPrivacyPolicy")} :`}
                </Typography>
              </div>
              <div className="view-term">
                <Buttons
                  text={accSetLang("dataPrivacySettings.ViewTermsPrivacy")}
                  className="btn-plain-txt"
                  subClassName="link-btn-dark"
                  onClick={() => {
                    window.open("/s/legal", "_blank");
                  }}
                ></Buttons>
              </div>
            </div>
            <div className="custom-bottom-border" />
            <div className="notify-header notify-menu">
              <div className="dashboard-section-block">
                <Typography
                  variant="h4"
                  className="d-s-b-title setting-sub-title"
                >
                  {`${accSetLang("dataPrivacySettings.ConsentProcessData")} :`}
                </Typography>
                {/* <CheckBoxInputs
                // label={accSetLang("dataPrivacySettings.Accept")}
                className="my-checkbox"
                id="accept"
                checked={checked}
                onchange={(e) => setChecked(e.target.checked)}
              /> */}

                <label className={`forms-checkbox my-checkbox`}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setChecked(e.target.checked);
                    }}
                    id={"accept"}
                    checked={checked}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="data-privacy-accept-wrapper">
                    <span>{accSetLang("dataPrivacySettings.Accept_1")}</span>{" "}
                    <span className="data-privacy-accept-mydata">
                      {accSetLang("dataPrivacySettings.Accept_2")}
                    </span>{" "}
                    <span>{accSetLang("dataPrivacySettings.Accept_3")}</span>
                  </span>
                </label>
                {error && <small className="error-txt">{error}</small>}
              </div>
            </div>
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

export default DataPrivacySettings;
