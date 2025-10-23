"use client"
import Typography from '@/app/[locale]/_components/Base/Typography';
import ContactPicker from '@/app/[locale]/_components/Common/ContactPicker';
import SingleSelectDropDown from '@/app/[locale]/_components/form/SingleSelectDropDown';
import { BrochureIcon, CloseIcon } from '@/app/[locale]/_components/Icons/SVGIcons';
import InputField from '@/app/[locale]/_components/StoreFront/Forms/InputField';
import SearchDropdown from '@/app/[locale]/_components/StoreFront/Forms/SearchDropdown';
import { CustomerListItem } from '@/app/[locale]/_interface/CustomerInterface';
import { CreateLead, LeadContactPermission, LeadSource, LeadStage } from '@/app/[locale]/_interface/LeadsInterface';
import { DropdownlistInterface } from '@/app/[locale]/_interface/SalesProductInterface';
import { useLazyGetProductDropdownListQuery } from '@/app/[locale]/_store/apiReducer/productsApi';
import { setIsAddLeadOpen, setIsEditLeadOpen } from '@/app/[locale]/_store/reducers/ui_store';
import { RootState, useAppDispatch } from '@/app/[locale]/_store/store';
import { useTranslations } from 'next-intl';
import { Sidebar } from 'primereact/sidebar';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const AddEditLeadForm = () => {
    const dispatch = useAppDispatch();
    const isAddLeadOpen = useSelector((state: RootState) => state.uiData.isAddLeadOpen);
    const isEditLeadOpen = useSelector((state: RootState) => state.uiData.isEditLeadOpen);
    const editLeadData = useSelector((state: RootState) => state.uiData.editLeadData); // Global edit data
    const t = useTranslations("leads.LeadsForm");
    const tContact = useTranslations("contact");
    const [selectedContact, setSelectedContact] = useState<CustomerListItem | null>(null);

    const isEditMode = isEditLeadOpen;
    const isVisible = isAddLeadOpen || isEditLeadOpen;

    const { control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<CreateLead>({
        defaultValues: {
            permission: LeadContactPermission.ALLOWED,
            stage: LeadStage.NEW_INQUIRY,
            source: LeadSource.OFFLINE,
            interestProductIds: [],
            requirementDetails: "",
        }
    });

    // Initialize form with edit data
    useEffect(() => {
        if (isEditMode && editLeadData) {
            const formData: Partial<CreateLead> = {
                customerId: editLeadData.customerId,
                contactName: editLeadData.contactName,
                email: editLeadData.email,
                phoneNo: editLeadData.phoneNo,
                jobTitle: editLeadData.jobTitle,
                companyName: editLeadData.companyName,
                interestProductIds: editLeadData.interestProductIds || [],
                source: editLeadData.source,
                stage: editLeadData.stage,
                permission: editLeadData.permission,
                requirementDetails: editLeadData.requirementDetails || "",
            };

            // Reset form with edit data
            reset(formData);

            // Set selected contact if exists
            if (editLeadData.customer) {
                setSelectedContact({
                    _id: editLeadData.customer._id,
                    name: editLeadData.customer.name,
                    email: editLeadData.customer.email,
                    phoneNo: editLeadData.customer.phoneNo,
                    jobTitle: editLeadData.customer.jobTitle,
                    companyName: editLeadData.customer.companyName,
                } as CustomerListItem);
            }
        } else {
            // Reset form for create mode
            reset({
                permission: LeadContactPermission.ALLOWED,
                stage: LeadStage.NEW_INQUIRY,
                source: LeadSource.OFFLINE,
                interestProductIds: [],
                requirementDetails: "",
            });
            setSelectedContact(null);
        }
    }, [isEditMode, editLeadData, reset]);

    useEffect(() => {
        if (selectedContact) {
            setValue("customerId", selectedContact._id);
        }
    }, [selectedContact, setValue]);

    const handleClose = () => {
        if (isEditMode) {
            dispatch(setIsEditLeadOpen(false));
        } else {
            dispatch(setIsAddLeadOpen(false));
        }
        // Reset form and selected contact when closing
        reset();
        setSelectedContact(null);
    };

    const handleError = (error: string | undefined) => {
        return error ? () => { } : undefined;
    };

    const itemTemplate = (item: any) => {
        return <div className='forms-input'>{item.label}</div>
    }

    const [queryParams, setQueryParams] = useState<DropdownlistInterface>({
        page: 1,
        searchQuery: "",
    });
    const [items, setItems] = useState<any[]>([]);

    const [getProductDropdownlist] = useLazyGetProductDropdownListQuery();

    const search = async (event: any) => {
        let searchQuery = event.query.toLowerCase();

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

    const onSubmit = async (data: CreateLead) => {
        try {
            if (isEditMode) {
                // Handle edit submission
                // console.log('Updating lead:', data);
                // Add your update API call here
            } else {
                // Handle create submission
                // console.log('Creating lead:', data);
                // Add your create API call here
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Sidebar
            visible={isVisible}
            position="right"
            onHide={handleClose}
            className="offcanvas-sidebar-comp variants-sidebar addnewproduct-sidebar"
            content={() => (
                <>
                    <div className="o-s-c-top">
                        <div className="o-s-c-header">
                            <Typography variant="h4" className="o-s-c-h-title">
                                <BrochureIcon />
                                {isEditMode ? t("editTitle") : t("title")}
                            </Typography>
                            <CloseIcon onClick={handleClose} />
                        </div>
                        <div className="o-s-c-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="o-s-c-b-right">
                                    <div className="forms-block">
                                        <div className="forms-group">
                                            <label className="f-g-label">
                                                {tContact("contactForm.contactPicker.searchContacts")}
                                            </label>
                                            <ContactPicker
                                                onSelect={setSelectedContact}
                                                // initialValue={selectedContact}
                                                disabled={isEditMode && !!editLeadData?.customerId}
                                            />
                                        </div>
                                        <div className="forms-group">
                                            <label className="f-g-label">
                                                {t("name.label")}
                                            </label>
                                            {selectedContact?.name ? <div className='forms-input'>{selectedContact.name}</div> :
                                                <Controller
                                                    name="contactName"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputField
                                                            {...field}
                                                            placeholder={t("name.placeholder")}
                                                            onError={handleError(errors.contactName?.message)}
                                                        />
                                                    )}
                                                />
                                            }
                                        </div>
                                        <div className="forms-group">
                                            <label className="f-g-label">
                                                {tContact("contactDetails.email.label")}
                                            </label>
                                            {selectedContact?.email ? <div className='forms-input'>{selectedContact.email}</div> :
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputField
                                                            {...field}
                                                            placeholder={tContact("contactDetails.email.placeholder")}
                                                            onError={handleError(errors.email?.message)}
                                                        />
                                                    )}
                                                />
                                            }
                                        </div>
                                        <div className="forms-group">
                                            <label className="f-g-label">
                                                {tContact("contactDetails.phoneNo.label")}
                                            </label>
                                            {selectedContact?.phoneNo ? <div className='forms-input'>{selectedContact.phoneNo}</div> :
                                                <Controller
                                                    name="phoneNo"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputField
                                                            {...field}
                                                            placeholder={tContact("contactDetails.phoneNo.placeholder")}
                                                            onError={handleError(errors.phoneNo?.message)}
                                                        />
                                                    )}
                                                />
                                            }
                                        </div>
                                        <div className="forms-group">
                                            <label className="f-g-label">
                                                {tContact("contactDetails.jobTitle.label")}
                                            </label>
                                            {selectedContact?.jobTitle ? <div className='forms-input'>{selectedContact.jobTitle}</div> :
                                                <Controller
                                                    name="jobTitle"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputField
                                                            {...field}
                                                            placeholder={tContact("contactDetails.jobTitle.placeholder")}
                                                            onError={handleError(errors.jobTitle?.message)}
                                                        />
                                                    )}
                                                />
                                            }
                                        </div>
                                        <div className="forms-group">
                                            <label className="f-g-label">
                                                {tContact("contactDetails.company.label")}
                                            </label>
                                            {selectedContact?.companyName ? <div className='forms-input'>{selectedContact.companyName}</div> :
                                                <Controller
                                                    name="companyName"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputField
                                                            {...field}
                                                            placeholder={tContact("contactDetails.company.placeholder")}
                                                            onError={handleError(errors.companyName?.message)}
                                                        />
                                                    )}
                                                />
                                            }
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
                                                        value={field.value}
                                                        onChange={(selected) => {
                                                            field.onChange(selected);
                                                        }}
                                                        disabled={false}
                                                        search={search}
                                                        field='productName'
                                                        customOptionTemplate={itemTemplate}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="forms-group">
                                            <label className="f-g-label">
                                                {t("source.label")}
                                            </label>
                                            <Controller
                                                name="source"
                                                control={control}
                                                render={({ field }) => (
                                                    <SingleSelectDropDown
                                                        options={Object.values(LeadSource)}
                                                        optionLabel="key"
                                                        optionValue="key"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder={t("source.placeholder")}
                                                        filter={true}
                                                        className='forms-select-2'
                                                        itemTemplate={itemTemplate}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="forms-group">
                                            <label className="f-g-label">
                                                {t("stage.label")}
                                            </label>
                                            <Controller
                                                name="stage"
                                                control={control}
                                                render={({ field }) => (
                                                    <SingleSelectDropDown
                                                        options={Object.values(LeadStage)}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder={t("stage.placeholder")}
                                                        filter={true}
                                                        className='forms-select-2'
                                                        itemTemplate={itemTemplate}
                                                    />
                                                )}
                                            />
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
                                                        options={Object.values(LeadContactPermission)}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder={t("permission.placeholder")}
                                                        filter={true}
                                                        className='forms-select-2'
                                                        itemTemplate={itemTemplate}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="forms-group">
                                            <label className="f-g-label">
                                                {t("requirementDetails.label")}
                                            </label>
                                            <Controller
                                                name="requirementDetails"
                                                control={control}
                                                render={({ field }) => (
                                                    <textarea
                                                        {...field}
                                                        className="forms-input"
                                                        placeholder={t("requirementDetails.placeholder")}
                                                        rows={4}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="forms-group">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting
                                                    ? (isEditMode ? t("updating") : t("creating"))
                                                    : (isEditMode ? t("update") : t("create"))
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        />
    )
}

export default AddEditLeadForm