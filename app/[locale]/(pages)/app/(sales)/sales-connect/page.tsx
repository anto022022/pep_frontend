"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeft from "@/app/[locale]/_components/Buttons/ButtonIconLeft";
import DataTableComponent from "@/app/[locale]/_components/Common/dataTable/DataTableComponent";
import { DataTableOptions } from "@/app/[locale]/_components/Common/dataTable/DataTableOptions";
import { LifeCycleTags } from "@/app/[locale]/_components/Common/dataTable/LifeCycleTag";
import NoDataScreen from "@/app/[locale]/_components/Common/dataTable/NoDataScreen";
import { RowStatus } from "@/app/[locale]/_components/Common/dataTable/RowStatus";
import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import MobileTableListing from "@/app/[locale]/_components/MobileComponents/MobileTableListing";
import AddNewContactForm, {
  ContactFormValues,
} from "@/app/[locale]/_components/OverLay/AddNewContactForm";
import ShareContactQrCode from "@/app/[locale]/_components/OverLay/ShareContactQrCode";
import { TableDatePipe } from "@/app/[locale]/_components/Pipe/TableDatePipe";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { TableHeaders } from "@/app/[locale]/_interface/common";
import { phoneNumberInterface } from "@/app/[locale]/_interface/ConnectInterface";
import { CountryOfOrigin } from "@/app/[locale]/_interface/SellOfferInterface";
import { tabsName } from "@/app/[locale]/_models/common";
import {
  useGetContactsListQuery,
  useUpdateContactArchiveMutation,
  useUpdateCustomerInformationMutation,
} from "@/app/[locale]/_store/apiReducer/connectApi";
import {
  setIsAddNewContactOpen,
  setIsBulkActionActive,
  setShowContactQrCode,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DataTablePageEvent } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import NoConnectImg from "../../../../../../public/img/connect-empty.svg";
import Plus from "../../../../../../public/img/icons/plus.svg";

export interface Contact {
  _id: string;
  contactName: string;
  companyName: string;
  email: string;
  jobTitle: string;
  phoneNo: phoneNumberInterface;
  whatsAppNo: phoneNumberInterface;
  source: string;
  country: CountryOfOrigin;
  lifeCycle: string;
  status: "active" | "inactive";
}

export interface SalesConnectListInterface {
  page: number;
  limit: number;
  isArchived?: boolean;
  isDraft?: boolean;
  sort_by: string;
  order?: number;
  search?: string;
  status?: "active" | "inactive";
  lifeCycle?: string;
  source?: string;
}
const page = () => {
  const row: number = 7;
  const router = useRouter();
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [qrData, setQrData] = useState<Contact>({} as Contact);
  const [editData, setEditData] = useState<Contact>();
  const isMobile = useIsMobile(1200);
  const dispatch = useAppDispatch();
  const [queryParams, setQueryParams] = useState<SalesConnectListInterface>({
    sort_by: "",
    page: 1,
    limit: row,
    search: "",
  });
  const isBulkActionActive = useAppSelector(
    (state) => state.uiData.isBulkActionActive
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("salesConnect.noContactsScreen");
  const [updateContactInformation] = useUpdateCustomerInformationMutation();
  const [updateContactArchive] = useUpdateContactArchiveMutation();
  const { data, isLoading, refetch } = useGetContactsListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const handleAddContact = () => {
    dispatch(setIsAddNewContactOpen(true));
  };

  useEffect(() => {
    refetch();
  }, []);

  //View
  const viewContact = (data: any) => {
    router.push(`sales-connect/${data?._id}`);
  };

  //Edit
  const editContact = (data: any) => {
    dispatch(setIsAddNewContactOpen(true));
    setEditData(data);
  };

  //Archive
  const archiveContact = async (formData: any) => {
    try {
      await updateContactInformation({
        id: formData?._id,
        data: {
          isArchived: !formData?.isArchived,
        },
      }).unwrap();
      dispatch(
        showToast({
          title: "Success",
          message: "Product Status Updated Successfully",
          theme: "success",
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          title: "Error",
          message: `Item failed to Archived`,
          theme: "error",
        })
      );
    }
  };
  //ConnectNow
  const connectNow = (data: any) => {
    dispatch(setShowContactQrCode(true));
    setQrData(data);
  };

  //changeQueryParams
  const changeQueryParams = (field: string, val: string | number | boolean) => {
    setQueryParams((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const initiateBulkArchive = async () => {
    let filteredIds = selectedContacts.map((ele: any) => ele._id);

    await updateContactArchive({
      id: filteredIds,
      isArchived: true,
    })
      .unwrap()
      .then((res) => {
        if (res?.statusCode !== 201) return;
        setSelectedContacts([]);

        dispatch(
          showToast({
            title: "Success",
            message: `${filteredIds.length} Items Archived`,
            theme: "success",
          })
        );
      })
      .catch(() => {
        dispatch(
          showToast({
            title: "Error",
            message: `Items failed to Archived`,
            theme: "error",
          })
        );
      });
  };

  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      dispatch(setIsBulkActionActive(true));
    }, 1000);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!isBulkActionActive) {
      // console.log("Short tap");
    }
  };

  const handleTouchCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleCheckboxChange = (checked: boolean, item: any) => {
    setSelectedContacts((prev) => {
      if (checked) {
        return [...prev, item]; // add item
      } else {
        return prev.filter((i) => i?._id !== item._id); // remove item
      }
    });
  };

  // const sortOptions = [
  //   {
  //     label: t("table-headers.productName"),
  //     field: "productName",
  //   },
  //   {
  //     label: t("table-headers.createdAt"),
  //     field: "createdAt",
  //   },
  // ];

  const isAllSelected =
    selectedContacts.length === data?.data?.listData?.result.length;

  const handleAllCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(
        (data?.data?.listData?.result ?? []) as unknown as Contact[]
      );
    } else {
      setSelectedContacts([]);
    }
  };

  const columnData: Array<TableHeaders> = [
    {
      id: 1,
      props: { className: "checkbox-row", selectionMode: "multiple" },
      visible: true,
      disabled: false,
    },
    {
      id: 2,
      field: "contactName",
      header: t("table-headers.contactName"),
      visible: true,
      disabled: true,
    },
    {
      id: 3,
      field: "companyName",
      header: t("table-headers.companyName"),
      visible: true,
      disabled: true,
    },
    {
      id: 4,
      field: "email",
      header: t("table-headers.email"),
      visible: true,
      disabled: false,
    },
    {
      id: 5,
      field: "phoneNo",
      header: t("table-headers.phoneNo"),
      visible: true,
      disabled: false,
      props: {
        body: (val: any) => {
          if (!val?.phoneNo) return "-";

          const countryCode = val.phoneNo.countryCode?.startsWith("+")
            ? val.phoneNo.countryCode
            : `+${val.phoneNo.countryCode}`;

          return `${countryCode} ${val.phoneNo.number}`;
        },
      },
    },
    {
      id: 6,
      field: "lifeCycle",
      header: t("table-headers.lifecycle"),
      visible: true,
      disabled: true,
      props: {
        body: (val: any) => {
          if (
            val.lifeCycle === "highValueCustomer" ||
            val.lifeCycle === "bulkBuyer"
          ) {
            return <LifeCycleTags lifeCycle={val.lifeCycle} />;
          }

          return <span>{val.lifeCycle}</span>;
        },
      },
    },

    {
      id: 7,
      field: "source",
      header: t("table-headers.source"),
      visible: true,
      disabled: true,
    },
    {
      id: 8,
      field: "status",
      header: t("table-headers.status"),
      visible: true,
      disabled: false,
      props: {
        body: (val: any) => (
          <RowStatus key={val._id} rowData={val} status={val.status} />
        ),
      },
    },
    {
      id: 9,
      field: "lastContactedAt",
      header: t("table-headers.lastContacted"),
      visible: true,
      disabled: false,
      props: {
        body: (val: any) => (
          <TableDatePipe key={val._id} date={val?.updatedAt} />
        ),
      },
    },
    {
      id: 11,
      visible: true,
      props: {
        body: (data: any) => (
          <DataTableOptions
            key={data._id}
            rowData={data}
            viewProduct={(e: any) => viewContact(e)}
            editProduct={(e: any) => editContact(e)}
            connectNow={(e: any) => connectNow(e)}
            archiveProduct={
              queryParams.isArchived === true
                ? undefined
                : (e: any) => archiveContact(e)
            }
          />
        ),
      },
      disabled: true,
    },
  ];

  return (
    <>
      {!isMobile ? (
        <div className="body-preview">
          <div className="b-p-header">
            <div className="b-p-left">
              <Typography variant="h1" className="b-p-title">
                {t("mainTitle")}
              </Typography>
            </div>

            {!isLoading && data?.data?.totalItems ? (
              <div className="b-p-right">
                <ButtonIconLeft
                  name={t("addContact")}
                  icon={Plus}
                  onClick={handleAddContact}
                ></ButtonIconLeft>
              </div>
            ) : null}
          </div>
          {!isLoading && data?.data?.totalItems && data.data.totalItems > 0 ? (
            <>
              <div className="b-p-body">
                <DataTableComponent
                  columnData={columnData.map((col) => ({
                    ...col,
                    sortable: false,
                  }))}
                  listCounts={{
                    totalArchived: data?.data?.totalArchived,
                    totalDrafted: data?.data?.totalDrafted,
                    totalItems: data?.data?.totalItems,
                  }}
                  totalRecords={data?.data?.listData?.totalListCount ?? 0}
                  sortField="productName"
                  searchPlaceHolder={t("search")}
                  uniqueKey="_id"
                  sortOrder={queryParams.order as 1 | -1 | 0}
                  tableData={data?.data?.listData?.result ?? []}
                  searchQuery={queryParams.search as string}
                  onSort={() => {}}
                  viewData={(e: any) => viewContact(e)}
                  editData={(e: any) => editContact(e)}
                  archiveData={(e: any) => archiveContact(e)}
                  connectNow={(e: any) => connectNow(e)}
                  onPageChange={(e: DataTablePageEvent) =>
                    changeQueryParams("page", (e?.page ? e.page : 0) + 1)
                  }
                  first={(queryParams.page - 1) * row}
                  rows={row}
                  setSearchQuery={(e: string) => changeQueryParams("search", e)}
                  setListStatus={(val: string) =>
                    setQueryParams({
                      sort_by: "",
                      page: 1,
                      limit: row,
                      search: "",
                      ...(val === "draft" && { isDraft: true }),
                      ...(val === "archive" && { isArchived: true }),
                    })
                  }
                  checkedItems={selectedContacts}
                  setCheckedItem={(val: Contact[]) => setSelectedContacts(val)}
                  initiateBulkArchive={() => initiateBulkArchive()}
                />
              </div>
            </>
          ) : (
            <>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <NoDataScreen
                  image={NoConnectImg}
                  title={t("title")}
                  subTitle={t("subtitle")}
                  buttonTitle={t("buttonTitle")}
                  onClickAdd={handleAddContact}
                  className="no-bottom-attach"
                />
              )}
            </>
          )}
        </div>
      ) : (
        <MobileTableListing
          navTitle={t("mainTitle")}
          navPath="/app"
          activeTab={
            queryParams.isArchived
              ? "archive"
              : queryParams.isDraft
              ? "draft"
              : ""
          }
          listCounts={{
            totalArchived: data?.data?.totalArchived,
            totalDrafted: data?.data?.totalDrafted,
            totalItems: data?.data?.totalItems,
          }}
          setListStatus={(val: string) =>
            setQueryParams({
              sort_by: "",
              page: 1,
              limit: row,
              search: "",
              ...(val === "draft" && { isDraft: true }),
              ...(val === "archive" && { isArchived: true }),
            })
          }
          tabsName={tabsName}
          searchValue={queryParams.search as string}
          setSearchQuery={(e: string) => changeQueryParams("searchQuery", e)}
          searchPlaceholder={t("search")}
          selectedLength={selectedContacts.length}
          isAllSelected={isAllSelected}
          handleSelectAll={handleAllCheckboxChange}
          initiateBulkArchive={initiateBulkArchive}
          first={(queryParams.page - 1) * row}
          rows={row}
          totalRecords={data?.data?.listData?.totalListCount ?? 0}
          onPageChange={(e: DataTablePageEvent) =>
            changeQueryParams("page", (e?.page ? e.page : 0) + 1)
          }
          handleAdd={handleAddContact}
          isEmpty={isLoading || (data?.data?.totalItems ?? 0) === 0}
        >
          {!isLoading ? (
            data?.data?.totalItems && data.data.totalItems > 0 ? (
              data?.data?.listData?.result.length > 0 ? (
                data?.data?.listData?.result.map((item, index) => (
                  <div
                    className="table-card-comp"
                    key={index}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                  >
                    <div className="t-c-c-left">
                      <CheckBoxInputs
                        id={item?._id}
                        className="sm light-bg"
                        checked={selectedContacts.some(
                          (i) => i._id === item._id
                        )}
                        onchange={(e) =>
                          handleCheckboxChange(e.target.checked, item)
                        }
                      />
                      <div className="t-c-c-info">
                        <RowStatus rowData={item} status={item?.status} />
                        <span className="t-c-c-txt txt-bold">
                          {item?.companyName}
                        </span>
                        <span className="t-c-c-txt">{item?.contactName}</span>
                        <span className="t-c-c-txt">{`${
                          item?.phoneNo?.countryCode ?? ""
                        } ${item?.phoneNo?.number ?? "--"}`}</span>
                        <span className="t-c-c-txt">{item?.email}</span>
                      </div>
                    </div>
                    <div className="t-c-c-right">
                      <DataTableOptions
                        rowData={item}
                        viewProduct={(e: any) => viewContact(e)}
                        editProduct={(e: any) => editContact(e)}
                        connectNow={(e: any) => connectNow(e)}
                        archiveProduct={
                          queryParams.isArchived === true
                            ? undefined
                            : (e: any) => archiveContact(e)
                        }
                      />
                      <LifeCycleTags lifeCycle={item?.lifeCycle} />
                    </div>
                  </div>
                ))
              ) : (
                <>No Contacts Found</>
              )
            ) : (
              <NoDataScreen
                image={NoConnectImg}
                title={t("title")}
                subTitle={t("subtitle")}
                buttonTitle={t("buttonTitle")}
                onClickAdd={handleAddContact}
                className="no-bottom-attach"
              />
            )
          ) : (
            <>Loading...</>
          )}
        </MobileTableListing>
      )}
      <AddNewContactForm data={editData as ContactFormValues} />
      <ShareContactQrCode
        contactName={qrData.contactName}
        companyName={qrData.companyName}
        phoneNo={qrData.phoneNo}
        email={qrData.email}
      />
    </>
  );
};
export default page;
