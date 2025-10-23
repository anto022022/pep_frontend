// Utility function to get display label for business type based on database value
export const getBusinessTypeLabel = (
  businessTypeValue: string,
  t: any
): string => {
  const businessTypeOpt = [
    {
      id: 1,
      title: t("businessTypes.unregister.title"),
      subtitle: t("businessTypes.unregister.subtitle"),
      value: "unregister",
    },
    {
      id: 2,
      title: t("businessTypes.register.title"),
      subtitle: t("businessTypes.register.subtitle"),
      value: "register",
    },
    {
      id: 3,
      title: t("businessTypes.nonprofit.title"),
      subtitle: t("businessTypes.nonprofit.subtitle"),
      value: "nonprofit",
    },
  ];

  const businessType = businessTypeOpt.find(
    (option) => option.value === businessTypeValue
  );
  return businessType ? businessType.title : businessTypeValue;
};
