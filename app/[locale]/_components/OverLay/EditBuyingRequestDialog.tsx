"use client"
import Typography from '@/app/[locale]/_components/Base/Typography';
import ButtonIconLeftOutline from '@/app/[locale]/_components/Buttons/ButtonIconLeftOutline';
import { LeftArrowIcon } from '@/app/[locale]/_components/Icons/SVGIcons';
import DateTimePickerCalender from '@/app/[locale]/_components/StoreFront/Forms/DateTimePickerCalender';
import InputField from '@/app/[locale]/_components/StoreFront/Forms/InputField';
import Select from '@/app/[locale]/_components/StoreFront/Forms/Select';
import { useLocalizedOptions } from '@/app/[locale]/_hooks/useLocalizedOptions';
import { PostBuyingRequest } from '@/app/[locale]/_interface/RfqInterface';
import { currencyList, unitOption } from '@/app/[locale]/_models/StoreFront';
import { useGetBuyingRequestDetailsQuery, useUpdateBuyingRequestMutation } from '@/app/[locale]/_store/apiReducer/buyingRequestApi';
import { showToast } from '@/app/[locale]/_store/reducers/ui_store';
import { useAppDispatch } from '@/app/[locale]/_store/store';
import { postRequestDetailsSchema } from '@/app/[locale]/_validationSchema/postBuyingRequest';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { InputTextarea } from 'primereact/inputtextarea';
import { use, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const EditBuyingRequestDialog = ({ params }: { params: Promise<any> }) => {
    const [previewData, setPreviewData] = useState<PostBuyingRequest | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const unwrappedParams = use(params);
    const dispatch = useAppDispatch();
    const [updateBuyingRequest] = useUpdateBuyingRequestMutation();

    const localizedCurrencyList = useLocalizedOptions("common", currencyList);
    const localizedUnitList = useLocalizedOptions("salesProduct", unitOption);

    const { data, isSuccess } = useGetBuyingRequestDetailsQuery(
        unwrappedParams?.id ?? undefined,
        { skip: !unwrappedParams?.id }
    );

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            productName: "",
            productDescription: "",
            estOrderQuantity: {
                quantity: undefined,
                unit: ""
            },
            preferredUnitPrice: {
                currency: {},
                priceRange: {
                    minPrice: undefined,
                    maxPrice: undefined,
                },
            },
            RFQDate: undefined
        },
        mode: "onBlur",
        resolver: zodResolver(postRequestDetailsSchema),
    });

    useEffect(() => {
        if (isSuccess && data) {
            setPreviewData(data.data);
            // Set form values when data is loaded
            setValue("productName", data.data.productName);
            setValue("productDescription", data.data.productDescription);
            setValue("estOrderQuantity.quantity", data.data.estOrderQuantity.quantity);
            setValue("estOrderQuantity.unit", data.data.estOrderQuantity.unit);
            setValue("preferredUnitPrice.currency", data.data.preferredUnitPrice.currency);
            setValue("preferredUnitPrice.priceRange.minPrice", data.data.preferredUnitPrice.priceRange.minPrice);
            setValue("preferredUnitPrice.priceRange.maxPrice", data.data.preferredUnitPrice.priceRange.maxPrice);
            setValue("RFQDate", new Date(data.data.validityDate));
        }
    }, [data, isSuccess, setValue]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const onSubmit = async (formData: any) => {
        try {
            await updateBuyingRequest({
                id: unwrappedParams.id,
                ...formData
            }).unwrap();
            
            dispatch(showToast({
                title: "Success",
                message: "Buying request updated successfully",
                theme: "success"
            }));
            setIsEditing(false);
        } catch (error) {
            dispatch(showToast({
                title: "Error",
                message: "Failed to update buying request",
                theme: "error"
            }));
        }
    };

    const formatDescription = (description: any) => {
        if (typeof description === 'string') return description;
        if (description && typeof description === 'object') {
            return `${description.min} - ${description.max} ${description.unit}`;
        }
        return '';
    };

    return (<>
        {previewData && (
            <div className="landing-E-layout">
                <header className="l-p-l-header">
                    <div className="l-p-l-h-left">
                        <div className="previous-btn-comp">
                            <Link
                                href={`/app/sourcing-rfq`}
                                className="btn-comp btn-icon"
                            >
                                <LeftArrowIcon />
                            </Link>
                            <Typography variant="span" className="p-b-c-txt">
                                Back to List
                            </Typography>
                        </div>
                    </div>
                    <div className="l-p-l-h-right">
                        <ButtonIconLeftOutline
                            name={isEditing ? "Cancel" : "Edit Details"}
                            className={"bg-outline-grey custom-width"}
                            onClick={() => isEditing ? setIsEditing(false) : handleEditClick()}
                        />
                    </div>
                </header>
                <section className="l-p-l-body">
                    <div className="l-p-l-b-left wid-100">
                        <div className="box-shads-1 product-main-info">
                            {isEditing ? (
                                <form onSubmit={handleSubmit(onSubmit)} className="forms-block">
                                    <div className="forms-group">
                                        <label className="f-g-label">Product Name</label>
                                        <Controller
                                            name="productName"
                                            control={control}
                                            render={({ field }) => (
                                                <InputField
                                                    {...field}
                                                    placeholder="Enter Product Name"
                                                />
                                            )}
                                        />
                                        {errors.productName && (
                                            <span className="error-txt">{errors.productName.message}</span>
                                        )}
                                    </div>

                                    <div className="forms-group">
                                        <Controller
                                            name="productDescription"
                                            control={control}
                                            render={({ field }) => (
                                                <InputTextarea
                                                    {...field}
                                                    rows={5}
                                                    cols={30}
                                                    className="p-m-i-desc"
                                                    placeholder="Enter product description"
                                                />
                                            )}
                                        />
                                        {errors.productDescription && (
                                            <span className="error-txt">{errors.productDescription.message}</span>
                                        )}
                                    </div>

                                    <div className="forms-group">
                                        <label className="f-g-label">Estimated Order Quantity</label>
                                        <div className="f-g-input-horiz">
                                            <div className="forms-group f-g-w100">
                                                <Controller
                                                    name="estOrderQuantity.quantity"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputField
                                                            {...field}
                                                            placeholder="Enter quantity"
                                                            type="number"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="forms-group f-g-w100">
                                                <Controller
                                                    name="estOrderQuantity.unit"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            options={localizedUnitList}
                                                            optionLabel="name"
                                                            optionValue="value"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Select unit"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="forms-group">
                                        <label className="f-g-label">Currency</label>
                                        <Controller
                                            name="preferredUnitPrice.currency"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    options={localizedCurrencyList}
                                                    optionLabel="name"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select currency"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="forms-group">
                                        <label className="f-g-label">Price Range</label>
                                        <div className="f-g-input-horiz">
                                            <div className="forms-group f-g-w100">
                                                <Controller
                                                    name="preferredUnitPrice.priceRange.minPrice"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputField
                                                            {...field}
                                                            placeholder="Min price"
                                                            type="number"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="forms-group f-g-w100">
                                                <Controller
                                                    name="preferredUnitPrice.priceRange.maxPrice"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputField
                                                            {...field}
                                                            placeholder="Max price"
                                                            type="number"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="forms-group">
                                        <label className="f-g-label">RFQ Validity Date</label>
                                        <Controller
                                            name="RFQDate"
                                            control={control}
                                            render={({ field }) => (
                                                <DateTimePickerCalender
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select date"
                                                    showTime={false}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="o-s-c-footer">
                                        <div className="o-s-c-f-right">
                                            <ButtonIconLeftOutline
                                                type="submit"
                                                name="Update"
                                                className="bg-outline-grey custom-width"
                                            />
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-m-i-title-breif">
                                    <Typography variant="h1" className="p-m-i-title">
                                        {previewData?.productName}
                                    </Typography>
                                    <p className="p-m-i-desc">{formatDescription(previewData?.productDescription)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        )}
    </>)
}

export default EditBuyingRequestDialog