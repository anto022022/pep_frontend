"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeft from "@/app/[locale]/_components/Buttons/ButtonIconLeft";
import DataTableComponent from "@/app/[locale]/_components/Common/dataTable/DataTableComponent";
import { DataTableOptions } from "@/app/[locale]/_components/Common/dataTable/DataTableOptions";
import NoDataScreenWrapper from "@/app/[locale]/_components/Common/dataTable/NoDataScreenWrapper";
import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import { ProfileUserIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import MobileTableListing from "@/app/[locale]/_components/MobileComponents/MobileTableListing";
import { TableDatePipe } from "@/app/[locale]/_components/Pipe/TableDatePipe";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { TableHeaders } from "@/app/[locale]/_interface/common";
import {
  LeadsListInterface,
  LeadsListItem,
  LeadStatusClassMap,
} from "@/app/[locale]/_interface/LeadsInterface";
import { listStatusIntersection } from "@/app/[locale]/_interface/RfqInterface";
import { tabsName } from "@/app/[locale]/_models/common";
import {
  useArchiveLeadsMutation,
  useGetLeadsListQuery,
  useUpdateLeadStageMutation,
} from "@/app/[locale]/_store/apiReducer/leadsApi";
import {
  setIsAddLeadOpen,
  setIsBulkActionActive,
  setIsEditLeadOpen,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DataTablePageEvent, DataTableSortEvent } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import NoLeadsImg from "../../../../../../assets/img/no-leads.png";
import Plus from "../../../../../../public/img/icons/plus.svg";
import AddLeadForm from "./form/AddLeadForm";

const page = () => {
  const row: number = 7;
  const leadStageList = [
    {
      name: "New Inquiry",
      value: "New Inquiry",
    },
    {
      name: "Negotiation",
      value: "Negotiation",
    },
    {
      name: "Contacted/Quoted",
      value: "Contacted/Quoted",
    },
    {
      name: "Deal Won",
      value: "Deal Won",
    },
    {
      name: "Deal Lost",
      value: "Deal Lost",
    },
  ];
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<LeadsListItem[]>([]);
  const isMobile = useIsMobile(1200);
  const [selectedEditLead, setSelectedEditLead] = useState<string>("");

  const dispatch = useAppDispatch();
  const isBulkActionActive = useAppSelector(
    (state) => state.uiData.isBulkActionActive
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [queryParams, setQueryParams] = useState<LeadsListInterface>({
    sortBy: "",
    sortOrder: 0,
    page: 1,
    limit: row,
    searchQuery: "",
    isArchived: false,
    isDraft: false,
  });
  const { data, isLoading, refetch } = useGetLeadsListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const t = useTranslations("leads");
  const [updateArchive] = useArchiveLeadsMutation();
  // const [updateLead] = useUpdateLeadsMutation();
  const [updateLeadstage] = useUpdateLeadStageMutation();

  const columnData: Array<TableHeaders> = [
    {
      id: 1,
      props: { className: "checkbox-row", selectionMode: "multiple" },
      visible: true,
      disabled: true,
    },
    {
      id: 2,
      field: "createdAt",
      header: t("LeadsTable.dateCreated"),
      visible: true,
      disabled: true,
      props: {
        sortable: true,
        body: (val: LeadsListItem) => (
          <TableDatePipe key={val._id} date={val?.createdAt} />
        ),
      },
    },
    {
      id: 2,
      field: "contactName",
      header: t("LeadsTable.contactName"),
      visible: true,
      disabled: true,
      props: {
        body: (val: LeadsListItem) => (
          <Typography variant="h6" className="b-p-body-text">
            {val?.contactName}
          </Typography>
        ),
      },
    },
    {
      id: 3,
      field: "email",
      header: t("LeadsTable.email"),
      visible: true,
      disabled: true,
      props: {
        body: (val: LeadsListItem) => (
          <Typography variant="h6" className="b-p-body-text">
            {val?.email}
          </Typography>
        ),
      },
    },
    {
      id: 4,
      field: "phoneNo",
      header: t("LeadsTable.phoneNo"),
      visible: true,
      disabled: false,
      props: {
        body: (val: LeadsListItem) => (
          <Typography variant="h6" className="b-p-body-text">
            {val?.countryCode}{" "}{val?.phoneNo}
          </Typography>
        ),
      },
    },
    {
      id: 5,
      field: "companyName",
      header: t("LeadsTable.companyName"),
      visible: true,
      disabled: false,
      props: {
        body: (val: LeadsListItem) => (
          <Typography variant="h6" className="b-p-body-text">
            {val?.companyName}
          </Typography>
        ),
      },
    },
    {
      id: 6,
      field: "source",
      header: t("LeadsTable.source"),
      disabled: false,
      visible: true,
    },
    {
      id: 7,
      field: "stage",
      header: t("LeadsTable.stage"),
      disabled: false,
      visible: true,
      props: {
        body: (val: LeadsListItem) => (
          <div className="select-wid-icon">
            <ProfileUserIcon className={"s-w-i-icon"} />
            <Select
              options={leadStageList}
              placeholder={"Lead Stage"}
              panelClassName={"custom-dropdown"}
              className={`lead-stage-wid  
              ${val?.stage == "New Inquiry" ? "new-inquiry" : ""}
              ${val?.stage == "Negotiation" ? "negotiation" : ""}
              ${val?.stage == "Contacted/Quoted" ? "contacted-quoted" : ""}
              ${val?.stage == "Deal Won" ? "deal-won" : ""}
              ${val?.stage == "Deal Lost" ? "deal-lost" : ""}
          `}
              optionLabel={`name`}
              optionValue="value"
              appendTo={document.body}
              value={val?.stage}
              onChange={(e: any) => {
                handleStageChange(val._id, e);
              }}
            />
          </div>
        ),
      },
    },
    {
      id: 8,
      field: "status",
      header: t("LeadsTable.status"),
      visible: true,
      disabled: false,
      props: {
        body: (val: LeadsListItem) => (
          <span
            className={`table-badge-comp ${LeadStatusClassMap[val?.status]}`}
          >
            {val?.status}
          </span>
        ),
      },
    },
    {
      id: 9,
      field: "lastContact",
      header: t("LeadsTable.lastContact"),
      visible: true,
      props: {
        sortable: true,
        body: (val: LeadsListItem) => (
          <TableDatePipe key={val._id} date={val?.lastContact} />
        ),
      },
      disabled: false,
    },
    {
      id: 10,
      field: "dateCreated",
      header: t("LeadsTable.dateCreated"),
      visible: false,
      props: {
        sortable: true,
        body: (val: LeadsListItem) => (
          <TableDatePipe key={val._id} date={val?.createdAt} />
        ),
      },
      disabled: false,
    },
    {
      id: 11,
      field: "interestedProducts",
      header: t("LeadsTable.interestedProducts"),
      visible: true,
      disabled: false,
      props: {
        body: (val: LeadsListItem) => (
          <div className="product-names">
            {val?.interestProductNames?.join(", ")}
          </div>
        ),
      },
    },
    // {
    //   id: 12,
    //   field: "takeAction",
    //   header: t("LeadsTable.takeAction"),
    //   disabled: false,
    //   visible: true,
    //   props: {
    //     body: (row: LeadsListItem) => (
    //       <div className="take-action-btn">
    //         {row.status == "Not Connected" && (
    //           <Buttons
    //             className={"btn-c-primary btn-c-sm"}
    //             text={"Send Quote"}
    //           />
    //         )}
    //         {row.status == "Schedule" && (
    //           <Buttons
    //             className={"btn-outline bg-outline-grey btn-c-sm"}
    //             text={"Schedule"}
    //           />
    //         )}
    //         {row.status == "Chat" && (
    //           <Buttons
    //             className={"btn-outline bg-outline-grey btn-c-sm"}
    //             text={"Chat"}
    //           />
    //         )}
    //       </div>
    //     ),
    //   },
    // },
    // {
    //   id: 13,
    //   field: "lifecycleTags",
    //   header: t("LeadsTable.lifecycleTags"),
    //   disabled: false,
    //   visible: true,
    //   props: {
    //     body: (row: LeadsListItem) =>
    //       row.lifecycleTags && (
    //         <>
    //           {row.lifecycleTags == "High Value" ? (
    //             <Typography variant="span" className="txt-pink colored-txt">
    //               High Value
    //             </Typography>
    //           ) : (
    //             <>
    //               <div className="colored-block">
    //                 <BulkBuyerIcon />
    //                 <Typography
    //                   variant="span"
    //                   className="txt-brown colored-txt"
    //                 >
    //                   Bulk Buyer
    //                 </Typography>
    //               </div>
    //             </>
    //           )}
    //         </>
    //       ),
    //   },
    // },
    {
      id: 14,
      visible: true,
      props: {
        body: (data: LeadsListItem) => (
          <DataTableOptions
            key={data._id}
            rowData={data}
            viewProduct={(e: any) => viewLead(e)}
            editProduct={editLead}
            archiveProduct={
              queryParams.itemStatus === "archive"
                ? undefined
                : (e: any) => archiveLead(e)
            }
          />
        ),
      },
      disabled: false,
    },
  ];

  useEffect(() => {
    refetch();
  }, []);

  const changeQueryParams = (
    field: string,
    val: string | number | listStatusIntersection
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const onSort = (e: DataTableSortEvent) => {
    setQueryParams({
      ...queryParams,
      sortBy: e.field,
      sortOrder: e.order,
    });
  };

  const handleMobileSort = (field: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: prev.sortBy === field ? "" : field,
      sortOrder: prev.sortBy === field ? 0 : 1,
    }));
  };

  const viewLead = (data: LeadsListItem) => {
    router.push(`/app/leads/${data._id}`);
  };

  const editLead = (data: LeadsListItem) => {
    setSelectedEditLead(data._id);
    dispatch(setIsAddLeadOpen(true));

    dispatch(setIsEditLeadOpen(true));
  };

  const handleStageChange = async (id: string, stage: string) => {
    await updateLeadstage({ id, stage });
    refetch();
  };

  const archiveLead = async (data: LeadsListItem) => {
    await updateArchive({
      id: [data._id],
      isArchived: !data.isArchived,
    });
    refetch();
  };

  const handleAddLead = () => {
    setSelectedEditLead("");
    dispatch(setIsAddLeadOpen(true));
  };

  const initiateBulkArchive = async () => {
    let filteredIds = selectedProducts.map((ele) => ele._id);
    await updateArchive({
      id: filteredIds,
      isArchived: true,
    })
      .unwrap()
      .then((res) => {
        if (res?.statusCode !== 201) return;
        setSelectedProducts([]);
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
    setSelectedProducts((prev) => {
      if (checked) {
        return [...prev, item]; // add item
      } else {
        return prev.filter((i) => i._id !== item._id); // remove item
      }
    });
  };

  const handleAllCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(data?.data?.listData?.result ?? []);
    } else {
      setSelectedProducts([]);
    }
  };

  const sortOptions = [
    {
      label: t("LeadsTable.lastContact"),
      field: "lastContact",
    },
    {
      label: t("LeadsTable.dateCreated"),
      field: "dateCreated",
    },
  ];

  const isAllSelected =
    selectedProducts.length === data?.data?.listData?.result.length;

  return (
    <>
      {!isMobile ? (
        <div className="body-preview">
          <div className="b-p-header">
            <div className="b-p-left">
              <Typography variant="h1" className="b-p-title">
                {t("title")}
              </Typography>
            </div>

            {!isLoading &&
              ((data?.data?.totalItems ?? 0) > 0 ||
                (data?.data?.totalDrafted ?? 0) > 0 ||
                (data?.data?.totalArchived ?? 0) > 0) ? (
              <div className="b-p-right">
                {/* <ButtonIconLeftOutline
            name={"Import"}
            className={"bg-outline-grey custom-width"}  
          >
            <ImportIcon width={17} height={18} />
          </ButtonIconLeftOutline> */}
                <ButtonIconLeft
                  name={t("addLead")}
                  icon={Plus}
                  onClick={handleAddLead}
                ></ButtonIconLeft>
              </div>
            ) : null}
          </div>
          {!isLoading &&
            ((data?.data?.totalItems ?? 0) > 0 ||
              (data?.data?.totalDrafted ?? 0) > 0 ||
              (data?.data?.totalArchived ?? 0) > 0) ? (
            <>
              <div className="b-p-body">
                <DataTableComponent
                  columnData={columnData.map((col) => ({
                    ...col,
                    sortable: true,
                  }))}
                  listCounts={{
                    totalArchived: data?.data?.totalArchived,
                    totalDrafted: data?.data?.totalDrafted,
                    totalItems: data?.data?.totalItems,
                  }}
                  totalRecords={data?.data?.listData?.totalListCount ?? 0}
                  sortField={queryParams.sortBy ?? "createdAt"}
                  searchPlaceHolder={t("searchPlaceHolder")}
                  uniqueKey="_id"
                  sortOrder={queryParams.sortOrder as 1 | -1 | 0}
                  tableData={data?.data?.listData?.result ?? []}
                  searchQuery={queryParams.searchQuery as string}
                  onSort={(e: DataTableSortEvent) => onSort(e)}
                  viewData={(e: any) => viewLead(e)}
                  archiveData={(e: any) => archiveLead(e)}
                  editData={editLead}
                  onPageChange={(e: DataTablePageEvent) =>
                    changeQueryParams("page", (e?.page ? e.page : 0) + 1)
                  }
                  first={(queryParams.page - 1) * row}
                  rows={row}
                  setSearchQuery={(e: string) =>
                    changeQueryParams("searchQuery", e)
                  }
                  setListStatus={(val: string) =>
                    setQueryParams({
                      sortBy: "",
                      sortOrder: 0,
                      page: 1,
                      limit: row,
                      searchQuery: "",
                      isArchived: val === "archive",
                      isDraft: val === "draft",
                    })
                  }
                  initiateBulkArchive={() => initiateBulkArchive()}
                  checkedItems={selectedProducts}
                  setCheckedItem={(val: LeadsListItem[]) =>
                    setSelectedProducts(val)
                  }
                />{" "}
                {/* </DataTableFilter> */}
              </div>{" "}
            </>
          ) : (
            <>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <NoDataScreenWrapper
                  image={NoLeadsImg}
                  title={t("noLeads.title")}
                  extraTitle={t("noLeads.extraTitle")}
                  subTitle={t("noLeads.subtitle")}
                >
                  <div>
                    <ButtonIconLeft
                      name={t("noLeads.createButtonTitle")}
                      icon={Plus}
                      onClick={handleAddLead}
                    />
                  </div>
                </NoDataScreenWrapper>
              )}
            </>
          )}
        </div>
      ) : (
        <MobileTableListing
          navTitle={t("title")}
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
              sortBy: "",
              sortOrder: 0,
              page: 1,
              limit: row,
              searchQuery: "",
              isArchived: val === "archive",
              isDraft: val === "draft",
            })
          }
          tabsName={tabsName}
          searchValue={queryParams.searchQuery as string}
          setSearchQuery={(e: string) => changeQueryParams("searchQuery", e)}
          searchPlaceholder={t("searchPlaceHolder")}
          selectedLength={selectedProducts.length}
          isAllSelected={isAllSelected}
          handleSelectAll={handleAllCheckboxChange}
          initiateBulkArchive={initiateBulkArchive}
          first={(queryParams.page - 1) * row}
          rows={row}
          totalRecords={data?.data?.listData?.totalListCount ?? 0}
          onPageChange={(e: DataTablePageEvent) =>
            changeQueryParams("page", (e?.page ? e.page : 0) + 1)
          }
          handleAdd={() => handleAddLead()}
          sortOptions={sortOptions}
          handleSort={handleMobileSort}
          activeSort={queryParams.sortBy}
          isEmpty={
            isLoading ||
            ((data?.data?.totalItems ?? 0) === 0 &&
              (data?.data?.totalDrafted ?? 0) === 0 &&
              (data?.data?.totalArchived ?? 0) === 0)
          }
        >
          {!isLoading ? (
            (data?.data?.totalItems ?? 0) > 0 ||
              (data?.data?.totalDrafted ?? 0) > 0 ||
              (data?.data?.totalArchived ?? 0) > 0 ? (
              (data?.data?.listData?.result.length ?? 0) > 0 ? (
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
                        checked={selectedProducts.some(
                          (i) => i._id === item._id
                        )}
                        onchange={(e) =>
                          handleCheckboxChange(e.target.checked, item)
                        }
                      />
                      <div className="t-c-c-info">
                        <span
                          className={`table-badge-comp ${LeadStatusClassMap[item?.status]
                            }`}
                        >
                          {item?.status}
                        </span>
                        <span className="t-c-c-txt txt-bold">
                          {item.companyName}
                        </span>
                        <span className="t-c-c-txt">{item.contactName}</span>
                        <span className="t-c-c-txt">{item.phoneNo}</span>
                        <span className="t-c-c-txt">{item.email}</span>
                      </div>
                    </div>
                    <div className="t-c-c-right">
                      <DataTableOptions
                        rowData={item}
                        viewProduct={(e: any) => viewLead(e)}
                        editProduct={editLead}
                        archiveProduct={
                          queryParams.itemStatus === "archive"
                            ? undefined
                            : (e: any) => archiveLead(e)
                        }
                      />
                      {/* {item.lifecycleTags == "High Value" ? (
                        <Typography
                          variant="span"
                          className="txt-pink colored-txt"
                        >
                          High Value
                        </Typography>
                      ) : (
                        <>
                          <div className="colored-block">
                            <BulkBuyerIcon />
                            <Typography
                              variant="span"
                              className="txt-brown colored-txt"
                            >
                              Bulk Buyer
                            </Typography>
                          </div>
                        </>
                      )} */}
                    </div>
                  </div>
                ))
              ) : (
                <>No Leads Found</>
              )
            ) : (
              <NoDataScreenWrapper
                image={NoLeadsImg}
                title={t("noLeads.title")}
                extraTitle={t("noLeads.extraTitle")}
                subTitle={t("noLeads.subtitle")}
              >
                <div>
                  <ButtonIconLeft
                    name={t("noLeads.createButtonTitle")}
                    icon={Plus}
                    onClick={handleAddLead}
                  />
                </div>
              </NoDataScreenWrapper>
            )
          ) : (
            <>Loading...</>
          )}
        </MobileTableListing>
      )}
      <AddLeadForm selectedEditLead={selectedEditLead} />
    </>
  );
};

export default page;
