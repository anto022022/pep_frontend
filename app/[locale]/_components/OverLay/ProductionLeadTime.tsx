import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocalizedOptions } from "../../_hooks/useLocalizedOptions";
import { unitOption } from "../../_models/StoreFront";
import { useAddProductionLeadTimeMutation } from "../../_store/apiReducer/productsApi";
import {
  setShowProductionLeadTimeDialog,
  showToast,
} from "../../_store/reducers/ui_store";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import { ProductionLeadTimeItemSchema } from "../../_validationSchema/salesProduct";
import Typography from "../Base/Typography";
import ButtonIconLeftOutline from "../Buttons/ButtonIconLeftOutline";
import { CloseIcon, PlusIcon } from "../Icons/SVGIcons";
import InputField from "../StoreFront/Forms/InputField";
import Select from "../StoreFront/Forms/Select";
import { useTranslations } from "next-intl";

const ProductionLeadTimeDialog = () => {
  const common = useTranslations("common");
  const dispatch = useAppDispatch();
  const showProductionLeadTimeDialog = useAppSelector(
    (state: RootState) => state.uiData.showProductionLeadTimeDialog
  );

  const localizedUnitList = useLocalizedOptions("salesProduct", unitOption);
  const [addProductionLeadTime] = useAddProductionLeadTimeMutation();
  interface ProductionLeadTimeItem {
    min_day: number | string;
    max_day: number | string;
    min_quantity: number | string;
    max_quantity: number | string;
    unit: string;
  }

  interface FormValues {
    productionLeadTime: ProductionLeadTimeItem[];
  }
  const {
    control,
    register,
    handleSubmit,

    reset,

    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      productionLeadTime: [
        {
          min_quantity: "",
          max_quantity: "",
          unit: "",
          min_day: "",
          max_day: "",
        },
      ],
    },
    mode: "all",
    resolver: zodResolver(ProductionLeadTimeItemSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productionLeadTime",
  });

  const onSubmit = async (data: any) => {
    try {
      // Call your API mutation with form data
      await addProductionLeadTime({ productionLeadTime: data?.productionLeadTime }).unwrap();
      dispatch(setShowProductionLeadTimeDialog(false));
      reset();
    } catch (err) {
      console.log(err);
      dispatch(
        showToast({
          title: "Error",
          message: "Something went wrong",
          theme: "error",
        })
      );
    }
  };
  const currentValues = getValues("productionLeadTime");

  const handleAddCustomRange = () => {

    // If no entries yet, allow adding the first one directly
    if (currentValues.length === 0) {
      append({
        min_quantity: "",
        max_quantity: "",
        unit: "",
        min_day: "",
        max_day: "",
      });
      return;
    }

    const lastEntry = currentValues[currentValues.length - 1];

    const isIncomplete =
      !lastEntry.min_quantity ||
      !lastEntry.max_quantity ||
      !lastEntry.unit ||
      !lastEntry.min_day ||
      !lastEntry.max_day;

    if (isIncomplete) {
      dispatch(
        showToast({
          title: "Incomplete Entry",
          message: "Please fill in all fields before adding a new range.",
          theme: "warning",
        })
      );
      return;
    }

    append({
      min_quantity: "",
      max_quantity: "",
      unit: "",
      min_day: "",
      max_day: "",
    });
  };


  return (
    <div>
      <Dialog
        visible={showProductionLeadTimeDialog}
        modal
        className="modal-comp"
        closable={true}
        header="Product Group"
        onHide={() => dispatch(setShowProductionLeadTimeDialog(false))}
        contentStyle={{ width: "500px" }}
        content={() => (
          <>
            <div className="m-c-head">
              <Typography variant="h6" className="modal-title">
                Production Lead Time
              </Typography>
              <CloseIcon
                className={"close-icon"}
                onClick={() => dispatch(setShowProductionLeadTimeDialog(false))}
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="m-c-body">
                <div className="p-l-t-m-forms-block">
                  {fields.map((field, index) => (
                    <div className="p-l-t-m-f-b-item" key={field.id}>
                      <div className="forms-split">
                        <div className="forms-group wid-100">
                          <label className="f-g-label">
                            Add Quantity Range
                          </label>
                          <div className="f-g-input-horiz">
                            <InputField
                              {...register(
                                `productionLeadTime.${index}.min_quantity`
                              )}
                              placeholder="Quantity From"
                              type="number"
                            />
                            {errors.productionLeadTime?.[index]
                              ?.min_quantity && (
                                <span className="error-txt">
                                  {
                                    errors.productionLeadTime[index]?.min_quantity
                                      ?.message
                                  }
                                </span>
                              )}
                            <InputField
                              {...register(
                                `productionLeadTime.${index}.max_quantity`
                              )}
                              placeholder="Quantity To"
                              type="number"
                            />
                            {errors.productionLeadTime?.[index]
                              ?.max_quantity && (
                                <span className="error-txt">
                                  {
                                    errors.productionLeadTime[index]?.max_quantity
                                      ?.message
                                  }
                                </span>
                              )}
                          </div>
                        </div>

                        <div className="forms-group wid-200px">
                          <label className="f-g-label">Unit</label>
                          <Controller
                            name={`productionLeadTime.${index}.unit`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                options={localizedUnitList}
                                optionLabel="name"
                                optionValue="value"
                                placeholder={`${common("Select")}`}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          {errors.productionLeadTime?.[index]?.unit && (
                            <span className="error-txt">
                              {errors.productionLeadTime[index]?.unit?.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="forms-group">
                        <label className="f-g-label">Add Duration</label>
                        <div className="f-g-input-horiz">
                          <InputField
                            {...register(`productionLeadTime.${index}.min_day`)}
                            type="number"
                            placeholder={"Enter Days"}
                          />
                          {errors.productionLeadTime?.[index]?.min_day && (
                            <span className="error-txt">
                              {
                                errors.productionLeadTime[index]?.min_day
                                  ?.message
                              }
                            </span>
                          )}
                          <InputField
                            {...register(`productionLeadTime.${index}.max_day`)}
                            type="number"
                            placeholder={"Enter Days"}
                          />
                          {errors.productionLeadTime?.[index]?.max_day && (
                            <span className="error-txt">
                              {
                                errors.productionLeadTime[index]?.max_day
                                  ?.message
                              }
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="mt-2 px-3 py-1 text-white bg-red-500 rounded text-sm"
                          >delete</button>
                        </div>
                      </div>

                    </div>

                  ))}
                </div>

                <div className="add-option-block">
                  <ButtonIconLeftOutline
                    name="Add Custom Range"
                    className="bg-outline-grey btn-attributes"
                    onClick={handleAddCustomRange}
                    disabled={currentValues.length === 4}
                  >
                    <PlusIcon />
                  </ButtonIconLeftOutline>
                </div>

                <div className="form-submit-btn mt-4"></div>
              </div>
              <div className="f-g-input-horiz">
                <button type="submit" className="btn-comp"
                >
                  {" "}
                  Save
                </button>
              </div>
            </form>
          </>
        )}
      ></Dialog>
    </div>
  );
};

export default ProductionLeadTimeDialog;
