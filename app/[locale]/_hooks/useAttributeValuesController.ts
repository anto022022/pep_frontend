import { Attribute, AttributeValue } from "../(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";

export const useAttributeValuesController = (
  value: Attribute,
  onChange: (value: Attribute) => void
) => {

  const { values, isValid, ...rest } = value

  const handleOnAdd = (value: string, valueNameArray: string[]) => {
    if (valueNameArray.includes(value.toLowerCase())) return;

    const newValues = [
      ...values,
      { name: value, isSelected: true, isRemoved: false }
    ];
    onChange({
      key: rest.key,
      isSuggested: rest.isSuggested,
      values: newValues,
      isValid: isValid + 1
    });
  };

  const handleOnRemove = (value: AttributeValue) => {
    if (value.isRemoved) return;
    const newValues = values.map((val) =>
      val.name === value.name
        ? { ...val, isRemoved: true, isSelected: false }
        : val
    );

    onChange({
      ...rest,
      values: newValues,
      isValid: isValid > 0 ? isValid - 1 : 0
    });

  };

  const handleOnSelect = (value: AttributeValue) => {
    if (value.isSelected && !value.isRemoved) return;
    const newValues = values.map((val) =>
      val.name === value.name
        ? { ...val, isSelected: true, isRemoved: false }
        : val
    );

    onChange({
      ...rest,
      values: newValues,
      isValid: isValid + 1
    });
  };

  return {
    handleOnAdd,
    handleOnRemove,
    handleOnSelect,
  };
};
