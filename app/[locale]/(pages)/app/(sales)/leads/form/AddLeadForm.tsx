"use client";
import {
  setIsAddLeadOpen,
  setLeadCreatedSuccessfullyPopup,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";

import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import SuccessDialog from "@/app/[locale]/_components/dialog/SuccessDialog";
import SingleSelectDropDown from "@/app/[locale]/_components/form/SingleSelectDropDown";
import {
  CloseIcon,
  NewLeadsIcon,
  RightArrowIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import SearchDropdown from "@/app/[locale]/_components/StoreFront/Forms/SearchDropdown";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { CustomerListItem } from "@/app/[locale]/_interface/CustomerInterface";
import {
  CreateLead,
  LeadContactPermission,
  LeadSource,
  LeadStage,
} from "@/app/[locale]/_interface/LeadsInterface";
import { DropdownlistInterface } from "@/app/[locale]/_interface/SalesProductInterface";
import {
  useCreateLeadsMutation,
  useGetLeadsDetailsQuery,
  useUpdateLeadsMutation,
} from "@/app/[locale]/_store/apiReducer/leadsApi";
import { useLazyGetLiveProductDropdownListQuery } from "@/app/[locale]/_store/apiReducer/productsApi";
import { postLeadsSchema } from "@/app/[locale]/_validationSchema/createLead";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";

const AddLeadForm = ({ selectedEditLead }: { selectedEditLead: string }) => {
  const dispatch = useAppDispatch();
  const { isAddLeadOpen, leadCreatedSuccessfullyPopup } = useAppSelector(
    (state: RootState) => state.uiData
  );
  const t = useTranslations("leads.LeadsForm");

  const leadT = useTranslations("leads");
  const common = useTranslations("common");
  const tContact = useTranslations("contact");
  const [items, setItems] = useState<any[]>([]);

  const [selectedContact, setSelectedContact] =
    useState<CustomerListItem | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateLead>({
    defaultValues: {
      contactName: "",
      email: "",
      phoneNo: "",
      jobTitle: "",
      companyName: "",
      customerId: "",
      permission: LeadContactPermission.ALLOWED,
      stage: LeadStage.NEW_INQUIRY,
      source: LeadSource.OFFLINE,
      interestProductIds: [],
      requirementDetails: "",
      isDraft: false,
    },
    mode: "onChange",
    resolver: zodResolver(postLeadsSchema),
    // mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { data, isSuccess } = useGetLeadsDetailsQuery(
    selectedEditLead ?? undefined,
    { skip: !selectedEditLead }
  );
  const [createLeads] = useCreateLeadsMutation();
  console.log("Leads data", data);
  useEffect(() => {
    if (selectedContact) {
      setValue("customerId", selectedContact._id);
    }
  }, [selectedContact, setValue]);
  useEffect(() => {
    if (data?.data) {
      if (selectedEditLead) {
        reset({
          contactName: data.data.customer?.contactName ,
          email:data.data.customer?.email ?? "",
          phoneNo: data.data.customer?.phoneNo,
          jobTitle: data.data.customer?.jobTitle,
          companyName: data.data.customer?.companyName,
          customerId: data.data.customer?._id,
          permission: data.data.permission,
          stage: data.data.stage,
          source: data.data.source,
          interestProductIds: data?.data?.interestedProducts || [],
          requirementDetails: data.data.requirementDetails,
          isDraft: false,
        });
      } else {
        reset({
          contactName: "",
          email: "",
          phoneNo: "",
          jobTitle: "",
          companyName: "",
          customerId: "",
          permission: LeadContactPermission.ALLOWED,
          stage: LeadStage.NEW_INQUIRY,
          source: LeadSource.OFFLINE,
          interestProductIds: [],
          requirementDetails: "",
          isDraft: false,
        });
      }
    }
  }, [data, isSuccess, selectedEditLead, items, reset]);
  console.log("interestProductIds", getValues("interestProductIds"));
  const itemTemplate = (item: any) => {
    return <div className="forms-input">{item.label}</div>;
  };

  const [queryParams, setQueryParams] = useState<DropdownlistInterface>({
    page: 1,
    searchQuery: "",
  });
  // const [customerQueryParams, setCustomerQueryParams] =
  //   useState<CustomerListInterface>({
  //     page: 1,
  //     search: "",
  //     limit: 7,
  //   });
  // const [customerItems, setCustomerItems] = useState<CustomerListItem[]>([]);
  const [getProductDropdownlist] = useLazyGetLiveProductDropdownListQuery();
  const [updated] = useUpdateLeadsMutation();

  // const [getCustomersDropdownlist] = useLazyGetCustomersDropdownListQuery();
  const onSubmit = async (data: CreateLead) => {
    const payload = {
      ...data,
      // convert objects → IDs
      interestProductIds: data?.interestProductIds.map(
        (p: any) => p.productId || p._id
      ),
    };
    try {
      if (selectedEditLead) {
        // Update lead flow
        const response = await updated({
          id: selectedEditLead,
          ...payload,
        }).unwrap();
        if (response) {
          dispatch(setLeadCreatedSuccessfullyPopup(true)); // You may want a different message for update
          setTimeout(() => {
            dispatch(setLeadCreatedSuccessfullyPopup(false));
          }, 3000);
        }
      } else {
        // Create lead flow
        const response = await createLeads(payload).unwrap();
        if (response) {
          dispatch(setLeadCreatedSuccessfullyPopup(true));
          reset();
          setTimeout(() => {
            dispatch(setLeadCreatedSuccessfullyPopup(false));
          }, 3000);
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showToast({
          title: "Error",
          message: `Creating Lead Failed`,
          theme: "error",
        })
      );
    } finally {
      dispatch(setIsAddLeadOpen(false));
    }
  };

  const customOptionTemplate = (option: any) => {
    return (
      <div className="option-product-item">
        <div className="o-p-i-img">
          <Image
            src={getImageUrl(option.productImageSrc)}
            width={52}
            height={52}
            alt={option.productName}
            sizes="100vw"
          />
        </div>
        <div className="o-p-i-content">
          <span className="o-p-i-c-txt">{option.productName}</span>
        </div>
      </div>
    );
  };

  const search = async (event: any) => {
    let searchQuery = event.query?.toLowerCase().trim();

    setQueryParams((prev) => ({
      ...prev,
      searchQuery,
      page: 1,
    }));

    const { data } = await getProductDropdownlist({
      ...queryParams,
      searchQuery,
      page: 1,
    });

    setItems(data?.data || []);
  };

  return (
    <>
      <Sidebar
        visible={isAddLeadOpen}
        position="right"
        onHide={() => dispatch(setIsAddLeadOpen(false))}
        className="offcanvas-sidebar-comp variants-sidebar addnewproduct-sidebar"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  <NewLeadsIcon />
                 {
                  selectedEditLead ? t("editTitle"):t("title")
                 } 
                </Typography>
                <CloseIcon onClick={() => dispatch(setIsAddLeadOpen(false))} />
              </div>
              <div className="o-s-c-body">
                <div className="o-s-c-b-right">
                  <div className="forms-block ">
                    {/* <div className="forms-group">
                      <label className="f-g-label">
                        {tContact("contactForm.contactPicker.label")}
                      </label>
                      <Controller
                        name="customerId"
                        control={control}
                        render={({ field }) => (
                          <SearchDropdown
                            items={customerItems}
                            value={selectedContact?.name}
                            onChange={(selected) => {
                              setSelectedContact(selected.name);
                              setValue("customerId", selected._id);
                            }}
                            disabled={false}
                            search={searchCustomer}
                            field="name"
                            customOptionTemplate={customContantOptionTemplate}
                          />
                        )}
                      />
                    </div> */}
                    <div className="forms-group">
                      <label className="f-g-label">{t("name.label")}</label>
                      <Controller
                        name="contactName"
                        control={control}
                        // disabled={!selectedContact}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("name.placeholder")}
                          />
                        )}
                      />
                      {errors.contactName?.message && (
                        <span className="error-txt">
                          {errors.contactName?.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">{t("email.label")}</label>
                      <Controller
                        name="email"
                        control={control}
                        // disabled={!selectedContact}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("email.placeholder")}
                          />
                        )}
                      />
                      {errors.email && (
                        <span className="error-txt">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">{t("phone.label")}</label>
                      <Controller
                        name="phoneNo"
                        control={control}
                        // disabled={!selectedContact}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("phone.label")}
                          />
                        )}
                      />
                      {errors.phoneNo && (
                        <span className="error-txt">
                          {errors.phoneNo.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">
                        {tContact("contactDetails.jobTitle.label")}
                      </label>
                      <Controller
                        name="jobTitle"
                        control={control}
                        // disabled={!selectedContact}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={tContact(
                              "contactDetails.jobTitle.placeholder"
                            )}
                          />
                        )}
                      />
                      {errors.jobTitle && (
                        <span className="error-txt">
                          {errors.jobTitle.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">
                        {tContact("contactDetails.company.label")}
                      </label>
                      <Controller
                        name="companyName"
                        control={control}
                        // disabled={!selectedContact}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={tContact(
                              "contactDetails.company.placeholder"
                            )}
                          />
                        )}
                      />
                      {errors.companyName && (
                        <span className="error-txt">
                          {errors.companyName.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("interestProducts.label")}
                      </label>
                      <Controller
                        name="interestProductIds"
                        control={control}
                        render={({ field }) => (
                          <SearchDropdown
                            items={items}
                            value={
                              // match the currently selected object from items by _id
                              items.find(
                                (item) =>
                                  item._id === field.value?.[0]?.productId
                              ) || null
                            }
                            onChange={(selected) => {
                              if (selected?._id) {
                                // only save productId in the form
                                field.onChange([{ productId: selected._id }]);
                              } else {
                                field.onChange([]);
                              }
                            }}
                            disabled={false}
                            search={search}
                            field="productName"
                            customOptionTemplate={customOptionTemplate}
                          />
                        )}
                      />

                      {errors.interestProductIds && (
                        <span className="error-txt">
                          {errors.interestProductIds.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group">
                      <Controller
                        name="requirementDetails"
                        control={control}
                        render={({ field }) => (
                          <TextArea
                            {...field}
                            label={t("requirementDetails.label")}
                            placeholder={t("requirementDetails.placeholder")}
                            value={field.value}
                            onChange={(value: string) => {
                              field.onChange(value);
                            }}
                            // aiFunc={regenerate}
                            // loading={descriptionIsLoading}
                            // isActive={isActive}
                          />
                        )}
                      />
                      {errors.requirementDetails && (
                        <span className="error-txt">
                          {errors.requirementDetails.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">{t("source.label")}</label>
                      <Controller
                        name="source"
                        control={control}
                        render={({ field }) => (
                          <SingleSelectDropDown
                            options={Object.values(LeadSource).map((item) => ({
                              label: item,
                              value: item,
                            }))}
                            optionLabel="label"
                            optionValue="value"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("source.placeholder")}
                            filter={true}
                            className="forms-select-2"
                            itemTemplate={itemTemplate}
                          />
                        )}
                      />
                      {errors.source && (
                        <span className="error-txt">
                          {errors.source.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">{t("stage.label")}</label>
                      <Controller
                        name="stage"
                        control={control}
                        render={({ field }) => (
                          <SingleSelectDropDown
                            options={Object.values(LeadStage).map((item) => ({
                              label: item,
                              value: item,
                            }))}
                            optionLabel="label"
                            optionValue="value"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("stage.placeholder")}
                            filter={true}
                            className="forms-select-2"
                            itemTemplate={itemTemplate}
                          />
                        )}
                      />
                      {errors.stage && (
                        <span className="error-txt">
                          {errors.stage.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("permission.label")}
                      </label>
                      <Controller
                        name="permission"
                        control={control}
                        render={({ field }) => (
                          <SingleSelectDropDown
                            options={Object.values(LeadContactPermission).map(
                              (item) => ({ label: item, value: item })
                            )}
                            optionLabel="label"
                            optionValue="value"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("permission.placeholder")}
                            filter={true}
                            className="forms-select-2"
                            itemTemplate={itemTemplate}
                          />
                        )}
                      />
                      {errors.permission && (
                        <span className="error-txt">
                          {errors.permission.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="o-s-c-footer">
              <div className="o-s-c-f-left"></div>
              <div className="o-s-c-f-right">
                <div className="o-s-c-btn-group">
                  {/* <ButtonIconLeftOutline
                    type="button"
                    name={common("saveAndContinue")}
                    className={"bg-outline-grey custom-width"}
                    onClick={handleSubmit((data) => {
                      setValue("isDraft", true);
                      onSubmit(data);
                    })}
                    disabled={isSubmitting}
                  />
                  <ButtonIconRight
                    name={common("Continue")}
                    onClick={handleSubmit((data) => {
                      setValue("isDraft", false);
                      onSubmit(data);
                    })}
                    disabled={isSubmitting}
                  >
                    <RightArrowIcon />
                  </ButtonIconRight> */}
                  {selectedEditLead ? (
                    <ButtonIconRight
                      type="button"
                      name={common("update")}
                      onClick={handleSubmit((data) => {
                        setValue("isDraft", false);
                        onSubmit(data);
                      })}
                      disabled={isSubmitting}
                    >
                      <RightArrowIcon />
                    </ButtonIconRight>
                  ) : (
                    <>
                      {" "}
                      <ButtonIconLeftOutline
                        type="button"
                        name={common("saveAndContinue")}
                        className={"bg-outline-grey custom-width"}
                        onClick={handleSubmit((data) => {
                          setValue("isDraft", true);
                          onSubmit(data);
                        })}
                        disabled={isSubmitting}
                      />
                      <ButtonIconRight
                        name={common("Continue")}
                        onClick={handleSubmit((data) => {
                          setValue("isDraft", false);
                          onSubmit(data);
                        })}
                        disabled={isSubmitting}
                      >
                        <RightArrowIcon />
                      </ButtonIconRight>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      />
      <SuccessDialog
        visible={leadCreatedSuccessfullyPopup}
        title={leadT("successDialog.title")}
        subTxt={leadT("successDialog.subtitle")}
        onClose={() => dispatch(setLeadCreatedSuccessfullyPopup(false))}
      />
    </>
  );
};

export default AddLeadForm;
