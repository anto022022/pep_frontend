import Typography from "@/app/[locale]/_components/Base/Typography";
import DataTableFilter from "@/app/[locale]/_components/Common/dataTable/DataTableComponent";
import { DataTableOptions } from "@/app/[locale]/_components/Common/dataTable/DataTableOptions";
import { PaymentStatus } from "@/app/[locale]/_components/Common/dataTable/PaymentStatus";
import { ChevronRightIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import SettingsButtons from "@/app/[locale]/_components/MicroComponents/SettingsButtons";
import { TableDatePipe } from "@/app/[locale]/_components/Pipe/TableDatePipe";
import { TableDisplayToggle } from "@/app/[locale]/_components/Pipe/TableDisplayToggle";
import { PackageSelectionUI } from "@/app/[locale]/_components/Plans/PackageSelectionUI";
import BillingInformation from "@/app/[locale]/_components/SettingsComponents/BillingInformation";
import CancelSubscription from "@/app/[locale]/_components/SettingsComponents/CancelSubscription";
import UpdatePaymentMethod from "@/app/[locale]/_components/SettingsComponents/UpdatePaymentMethod";
import { TableHeaders } from "@/app/[locale]/_interface/common";
import {
  useGetMembershipDetailsQuery,
  useUpdateMembershipAutoRenewalMutation,
} from "@/app/[locale]/_store/apiReducer/settingsApi";
import {
  setIsAccountSettingOpen,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DataTablePageEvent } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";
import "@/assets/css/catalogsubdomain.css";

const MembershipSettings = () => {
  const row: number = 7;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [formType, setFormType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accSetLang = useTranslations("accountSettings");

  const { data, isSuccess } = useGetMembershipDetailsQuery();
  const membershipInfo = data?.data;

  useEffect(() => {
    if (
      isSuccess &&
      typeof membershipInfo?.currentPlan?.autoRenewal === "boolean"
    ) {
      setIsToggle(membershipInfo?.currentPlan?.autoRenewal);
    }
  }, [
    isSuccess,
    membershipInfo?.currentPlan?.autoRenewal,
    membershipInfo?.paymentDetails,
  ]);

  const paymentHistoryData = membershipInfo?.paymentDetails;
  const [openPlan, setOpenPlan] = useState(false);
  const [updateMembershipAutoRenewal] =
    useUpdateMembershipAutoRenewalMutation();
  const handleSwitchToAnnual = async () => {};
  const handleChangePlan = () => {
    setOpenPlan((prev) => !prev);
  };

  const handlePayNow = () => {};
  const handleUpdateBillingInformation = () => {
    setFormType("BillingInformation");
    dispatch(setIsAccountSettingOpen(true));
  };

  const handleUpdatePaymentMethod = () => {
    setFormType("UpdatePayment");
    dispatch(setIsAccountSettingOpen(true));
  };

  const handleCancelSubscription = () => {
    setFormType("CancelSubscription");
    dispatch(setIsAccountSettingOpen(true));
  };
  const handleClickAutoRenewal = async () => {
    setIsToggle(!isToggle);
    const response = await updateMembershipAutoRenewal({});
    if (response?.data?.statusCode === 200) {
      dispatch(
        showToast({
          title: "Success",
          message: response.data.message,
          theme: "success",
        })
      );
    }
  };
  const handleView = (data: any) => {};

  const handleEdit = (data: any) => {};

  const maskCardNumber = (cardNumber: string) => {
    if (!cardNumber) {
      return null;
    }
    const last4 = cardNumber.slice(-4);
    const masked = "**** **** ****";
    return `${masked} ${last4}`;
  };

  const convertSinceDate = (inputDate: Date) => {
    if (!inputDate) {
      return null;
    }
    const date = new Date(inputDate);
    const month = date
      .toLocaleString("default", { month: "long" })
      .toLowerCase();
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const year = date.getFullYear();
    const formatted = `${capitalizedMonth} ${year}`;
    return formatted;
  };

  const convertNextRenewalDate = (inputDate: Date) => {
    if (!inputDate) {
      return null;
    }
    const formatted = new Date(inputDate)
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-");
    return formatted;
  };

  const columnData: Array<TableHeaders> = [
    {
      id: 1,
      visible: true,
      disabled: true,
    },
    {
      id: 2,
      field: "paymentDate",
      header: accSetLang("subscriptionDetails.tableData.PaymentDate"),
      props: {
        sortable: true,
        body: (val: any) => (
          <TableDatePipe key={val._id} date={val?.paymentDate} />
        ),
      },
      visible: true,
      disabled: true,
    },

    {
      id: 3,
      field: "paymentMethod",
      header: accSetLang("subscriptionDetails.tableData.Paymentmethod"),
      props: {
        body: (val: any) => (
          <p key={val._id}>
            <span>
              <img
                className="card-type-img"
                src={val?.paymentMethod?.card}
                alt=""
              />
            </span>{" "}
            <span>{maskCardNumber(val?.paymentMethod?.number)}</span>{" "}
          </p>
        ),
      },
      visible: true,
      disabled: true,
    },

    {
      id: 4,
      field: "paymentStatus",
      header: accSetLang("subscriptionDetails.tableData.PaymentStatus"),
      props: {
        body: (val: any) => (
          <PaymentStatus key={val} status={val?.paymentStatus} />
        ),
      },
      visible: true,
      disabled: false,
    },

    {
      id: 5,
      field: "invoice",
      header: accSetLang("subscriptionDetails.tableData.Invoice"),
      visible: true,
      disabled: true,
      props: {
        body: (val: any) => (
          <button
            key={val._id}
            className="btn-comp btn-plain-txt"
            onClick={() => {
              if (val?.invoice) {
                window.open(val.invoice, "_blank");
              }
            }}
          >
            <div className="b-c-txt">
              {" "}
              <span>Download</span>{" "}
            </div>
          </button>
        ),
      },
    },
    {
      id: 6,
      field: "totalAmount",
      header: accSetLang("subscriptionDetails.tableData.Total"),
      visible: true,
      disabled: true,
    },
    {
      id: 7,
      header: "",
      visible: true,
      props: {
        body: (data: any) => (
          <DataTableOptions
            key={data._id}
            rowData={data}
            viewProduct={(e: any) => handleView(e)}
            editProduct={(e: any) => handleEdit(e)}
          />
        ),
      },
      disabled: true,
    },
  ];

  const staticData = [
    {
      paymentDate: "22-04-2025",
      paymentMethod: "**** **** **** 3783",
      paymentStatus: "processing",
      invoiceLink: "",
      total: "$ 200",
      cardTypeImage:
        "https://pepagora.s3.ap-south-1.amazonaws.com/assets/1w5GwUxCqMS_Dij0_6ARb.png",
    },
    {
      paymentDate: "22-04-2025",
      paymentMethod: "**** **** **** 3783",
      paymentStatus: "paid",
      invoiceLink: "",
      total: "$ 200",
      cardTypeImage:
        "https://pepagora.s3.ap-south-1.amazonaws.com/assets/1w5GwUxCqMS_Dij0_6ARb.png",
    },
    {
      paymentDate: "22-04-2025",
      paymentMethod: "s***s@oksbi",
      paymentStatus: "paid",
      invoiceLink: "",
      total: "$ 200",
      cardTypeImage:
        "https://pepagora.s3.ap-south-1.amazonaws.com/assets/f-oBYemZQDu1bYFa6ccfN.png",
    },
  ];

  const onSubmit = () => {
    router.push("/app");
  };

  return (
    <>
      <div className="body-membership-settings">
        <div className="compliance-settings-card-group">
          <div className="compliance-settings-card-comp">
            <div className="c-s-c-c-head">
              <div className="c-s-c-c-h-left">
                <span className="c-s-head-title">
                  {accSetLang("subscriptionDetails.annualCard.title_1")}{" "}
                  <span className="high-green">
                    {accSetLang("subscriptionDetails.annualCard.title_2")}
                  </span>{" "}
                  {accSetLang("subscriptionDetails.annualCard.title_3")}
                  <span className="dollar-line">
                    {accSetLang("subscriptionDetails.annualCard.title_4")}
                  </span>{" "}
                  {accSetLang("subscriptionDetails.annualCard.title_5")}
                </span>
                <span className="c-s-head-subtxt">
                  {accSetLang("subscriptionDetails.annualCard.subTxt")}
                </span>
              </div>
              <div className="c-s-c-c-h-right">
                <button
                  className="btn-comp btn-c-primary"
                  onClick={handleSwitchToAnnual}
                >
                  <span className="b-c-txt">
                    {accSetLang("subscriptionDetails.annualCard.button")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="compliance-settings-card-group">
          <div className="compliance-settings-card-comp">
            <div className="membership-card">
              <div>
                <div className="previous-btn-comp ">
                  <div className="pep-title ">
                    {accSetLang("subscriptionDetails.pepScale.title")}
                  </div>
                </div>
                <div className="sub-title">
                  {`${accSetLang(
                    "subscriptionDetails.pepScale.stateTxt"
                  )} ${convertSinceDate(
                    membershipInfo?.currentPlan?.startDate
                  )}`}
                </div>
                <div className="sub-title-month ">
                  {" "}
                  <span className="pill">
                    {" "}
                    {membershipInfo?.currentPlan?.billingType}
                  </span>{" "}
                  {`${accSetLang(
                    "subscriptionDetails.pepScale.endTxt"
                  )}: ${convertNextRenewalDate(
                    membershipInfo?.currentPlan?.endDate
                  )}`}
                </div>
              </div>
              <div>
                {" "}
                {membershipInfo?.currentPlan?.isActive ? (
                  <span className="table-badge-comp active">Active</span>
                ) : (
                  <span className="table-badge-comp pending">Pending</span>
                )}
              </div>
            </div>
            <div className="custom-bottom-border" />
            <div className="membership-card">
              <div className="auto-renewal-box">
                <span>
                  <TableDisplayToggle
                    id="autoRenewal"
                    value={isToggle}
                    onToggle={() => handleClickAutoRenewal()}
                  />
                </span>
                <span className="auto-renewal">
                  {accSetLang("subscriptionDetails.pepScale.AutoRenewal")}
                </span>
              </div>

              <div className="payNow">
                <button
                  className="btn-comp btn-plain-txt"
                  onClick={handleChangePlan}
                >
                  <div className="b-c-txt">
                    {" "}
                    <span>
                      {accSetLang("subscriptionDetails.pepScale.ChangePlan")}
                    </span>{" "}
                    <span className="left-arrow-icon">
                      <ChevronRightIcon />
                    </span>
                  </div>
                </button>
                <button
                  className="btn-comp btn-c-primary"
                  onClick={handlePayNow}
                >
                  <span className="b-c-txt">
                    {accSetLang("subscriptionDetails.pepScale.PayNow")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="cancel-subscription">
          {" "}
          <button
            className="btn-comp btn-plain-txt"
            onClick={handleCancelSubscription}
          >
            <div className="b-c-txt">
              {" "}
              <span>
                {accSetLang("subscriptionDetails.CancelSubscription")}
              </span>{" "}
            </div>
          </button>
        </div>
        <div className="body-settings">
          <div className="notify">
            <div className="notify-header notify-menu">
              <div className="dashboard-section-block">
                <Typography
                  variant="h4"
                  className="d-s-b-title setting-sub-title "
                >
                  {accSetLang("subscriptionDetails.PaymentDetails")}
                </Typography>
              </div>
            </div>

            <div className="data-privacy-box ">
              <div className="section payment-detail-line">
                <div>
                  <Typography variant="h4" className="title ct-mb ">
                    {accSetLang("subscriptionDetails.BillingInformation")}
                  </Typography>
                </div>
                {(membershipInfo?.billingAddress?.addressLine ||
                  membershipInfo?.businessAddress?.addressLine) && (
                  <div>
                    <Typography variant="p" className="sub-title-month ">
                      {membershipInfo?.billingAddress?.addressLine ||
                        membershipInfo?.businessAddress?.addressLine}
                    </Typography>
                    <Typography variant="p" className="sub-title-month ">
                      {membershipInfo?.businessName}
                    </Typography>
                    <Typography variant="p" className="sub-title-month">
                      {membershipInfo?.billingAddress?.city ||
                        membershipInfo?.businessAddress?.city}{" "}
                      ,
                    </Typography>
                    <Typography variant="p" className="sub-title-month">
                      {membershipInfo?.billingAddress?.state ||
                        membershipInfo?.businessAddress?.state}{" "}
                    </Typography>
                    <Typography variant="p" className="sub-title-month">
                      {membershipInfo?.billingAddress?.country.name ||
                        membershipInfo?.businessAddress?.country.name}{" "}
                      -{" "}
                      {membershipInfo?.billingAddress?.pinCode ||
                        membershipInfo?.businessAddress?.pinCode}{" "}
                    </Typography>
                  </div>
                )}
                <div className="section ">
                  {" "}
                  <button
                    className="btn-comp btn-plain-txt"
                    onClick={handleUpdateBillingInformation}
                  >
                    <div className="b-c-txt pa-mt-1">
                      {" "}
                      {membershipInfo?.billingAddress?.addressLine ? (
                        <span>
                          {accSetLang(
                            "subscriptionDetails.UpdateBillingInformation"
                          )}
                        </span>
                      ) : (
                        <span>
                          {accSetLang(
                            "subscriptionDetails.AddBillingInformation"
                          )}
                        </span>
                      )}{" "}
                    </div>
                  </button>
                </div>
              </div>

              <div className="section">
                <Typography variant="h4" className="title ct-mb">
                  {accSetLang("subscriptionDetails.Paymentmethod")}
                </Typography>
                <div>
                  {membershipInfo?.cardHolderName &&
                    membershipInfo?.cardExpiredDate &&
                    membershipInfo?.cardNo && (
                      <>
                        <div className="card member-payment-card-mb">
                          <div className="card-header">
                            <span className="card-title">
                              ICICI Credit card
                            </span>
                            <img
                              src="https://pepagora.s3.ap-south-1.amazonaws.com/assets/1w5GwUxCqMS_Dij0_6ARb.png"
                              alt="Visa"
                              className="card-logo"
                            />
                          </div>

                          <div className="card-body">
                            <div className="card-name">
                              {membershipInfo?.cardHolderName}
                            </div>
                            <div className="card-expiry">
                              {membershipInfo?.cardExpiredDate}
                            </div>
                          </div>

                          <div className="card-number ">
                            {" "}
                            {maskCardNumber(membershipInfo?.cardNo)}
                          </div>
                        </div>
                      </>
                    )}
                </div>

                <div className="section ">
                  <button
                    className="btn-comp btn-plain-txt"
                    onClick={handleUpdatePaymentMethod}
                  >
                    <div className="b-c-txt pa-mt-1">
                      {" "}
                      {membershipInfo?.cardNo ? (
                        <span>
                          {accSetLang(
                            "subscriptionDetails.UpdatePaymentMethod"
                          )}
                        </span>
                      ) : (
                        <span>
                          {accSetLang("subscriptionDetails.AddPaymentMethod")}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="dashboard-section-block member-payment-mt">
              <Typography
                variant="h4"
                className="d-s-b-title setting-sub-title "
              >
                {accSetLang("subscriptionDetails.PaymentHistory")}
              </Typography>
            </div>
            <div className="b-p-body">
              <DataTableFilter
                columnData={columnData.map((col) => ({
                  ...col,
                  sortable: false,
                }))}
                totalRecords={0}
                tableData={paymentHistoryData ?? []}
                viewData={(e: any) => handleView(e)}
                editData={(e: any) => handleEdit(e)}
                rows={row}
                uniqueKey={""}
                sortField={""}
                searchQuery={""}
                first={0}
                sortOrder={undefined}
                checkedItems={[]}
                setSearchQuery={function (id: string): void {
                  throw new Error("Function not implemented.");
                }}
                setCheckedItem={function (val: any): void {
                  throw new Error("Function not implemented.");
                }}
                setListStatus={function (val: string): void {
                  throw new Error("Function not implemented.");
                }}
                onPageChange={function (event: DataTablePageEvent): void {
                  throw new Error("Function not implemented.");
                }}
                isRenderHeader={false}
              />{" "}
            </div>
          </div>
        </div>
      </div>
      <SettingsButtons
        cancelRoute={`./`}
        onSubmit={onSubmit}
        isSubmitting={isLoading}
      />

      {formType === "UpdatePayment" && (
        <UpdatePaymentMethod
          paymentMethodInfo={{
            cardExpiredDate: membershipInfo?.cardExpiredDate,
            cardHolderName: membershipInfo?.cardHolderName,
            cardNo: membershipInfo?.cardNo,
            cvv: "", //secure purpose
            isCompliantWithRBIGuidelines:
              membershipInfo?.isCompliantWithRBIGuidelines,
          }}
        />
      )}
      {formType === "BillingInformation" && (
        <BillingInformation
          billingAddressInfo={{
            billingAddress:
              membershipInfo?.billingAddress || membershipInfo?.businessAddress,
            businessName:
              membershipInfo?.businessName || membershipInfo?.businessName1,
            name: membershipInfo?.name || membershipInfo?.name1,
          }}
        />
      )}
      {formType === "CancelSubscription" && <CancelSubscription />}
      <Sidebar
        visible={openPlan}
        position="right"
        onHide={() => setOpenPlan(false)}
        appendTo={null}
        className="offcanvas-sidebar-comp url-setup-sidebar"
        content={() => (
          <>
            <PackageSelectionUI />
          </>
        )}
      ></Sidebar>
    </>
  );
};
export default MembershipSettings;
