"use client";
import { useLazyGetCustomersDropdownListQuery } from "@/app/[locale]/_store/apiReducer/customerApi";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { CustomerListItem } from "../../_interface/CustomerInterface";

interface OptionType {
  value: string;
  label: string;
  data: CustomerListItem;
}

interface ContactPickerProps {
  onSelect?: (customer: CustomerListItem | null) => void;
  disabled?: boolean;
}

const ContactPicker = ({ onSelect, disabled }: ContactPickerProps) => {
  const t = useTranslations("contact.contactForm.contactPicker");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const optionsCache = useRef<OptionType[]>([]);

  const loadOptions = async (inputValue: string) => {
    if (inputValue !== searchValue) {
      setSearchValue(inputValue);
      setPage(1);
      optionsCache.current = [];
      setHasMore(true);
    }

    if (!hasMore) {
      return optionsCache.current;
    }

    const { data } = useLazyGetCustomersDropdownListQuery({
      search: inputValue,
      limit: 10,
      page: page,
    });

    const newOptions =
      data?.data?.listData?.result?.map((contact: CustomerListItem) => ({
        value: contact._id,
        label: contact.name,
        data: contact,
      })) ?? [];

    optionsCache.current = [...optionsCache.current, ...newOptions];
    setHasMore(page < (data?.data?.listData?.totalPages ?? 1));
    setPage((prev) => prev + 1);

    return optionsCache.current;
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: 40,
      borderRadius: 8,
      borderColor: "#CDD7E1",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#CDD7E1",
      },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const [selectedContact, setSelectedContact] = useState<OptionType | null>(
    null
  );

  const handleChange = (option: OptionType | null) => {
    setSelectedContact(option);
    onSelect?.(option?.data ?? null);
  };

  return (
    <div className="autocomplete-dropdown-comp">
      <div className="a-d-c-input-wrap">
        <AsyncSelect<OptionType>
          cacheOptions
          defaultOptions
          value={selectedContact}
          onChange={handleChange}
          loadOptions={loadOptions}
          styles={customStyles}
          placeholder={t("searchContacts")}
          noOptionsMessage={() => t("noContactsFound")}
          isClearable
          isDisabled={disabled}
          onMenuScrollToBottom={() => {
            if (hasMore) {
              loadOptions(searchValue);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ContactPicker;
