import { SearchIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import { FiltersModuleTypes } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { Country } from "country-state-city";
import { useEffect, useState } from "react";
import Image from "next/image";

export const defaultCountryList = [
  { value: "IN", title: "India" },
  { value: "CN", title: "China" },
  { value: "AE", title: "United Arab Emirates" },
  { value: "US", title: "United States" },
];
interface CountryType {
  parentIndex: number;
  values: Array<any>;
  type: FiltersModuleTypes;
}
const CountyFilter: React.FC<CountryType> = ({ parentIndex, type, values }) => {
  const setFilterData = useFiltersData();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [countryList, setCountryList] = useState<
    { title: string; value: string }[]
  >([]);
  const [filteredValues, setFilteredValues] =
    useState<{ title: string; value: string; selected?: boolean }[]>(
      defaultCountryList
    );

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      title: country.name,
      value: country.isoCode,
    }));
    setCountryList(countries);
  }, []);

  useEffect(() => {
    if (values.length > 0) {
      const selectedCountries = values.filter((item) => item.selected);
      if (selectedCountries.length > 0) {
        const baseList = defaultCountryList.filter(
          (d) => !selectedCountries.some((s) => s.value === d.value)
        );

        const merged = [...baseList.slice(0, 5), ...selectedCountries];
        setFilteredValues(merged);
      } else {
        setFilteredValues(defaultCountryList);
      }
      return;
    }
    if (countryList.length === 0) return;
    setFilterData.setMarketsFiltersData({
      filterModuleType: type,
      value: countryList,
      filterType: "common",
      parentIndex: parentIndex,
    });
  }, [values, countryList]);

  useEffect(() => {
    const updated = filteredValues.map((item) => ({
      ...item,
      selected: !!values.find((f) => f.value === item.value && f.selected),
    }));
    setFilteredValues(updated);
  }, [values]);

  const getSelectedCountries = () => {
    return filteredValues.length > 0
      ? filteredValues.filter((c) => c.selected)
      : [];
  };

  const handleFilter = (query: string) => {
    setSearchQuery(query);
    const selectedCountries = getSelectedCountries();

    if (!query.trim()) {
      // base = default list
      const baseList = defaultCountryList.filter(
        (d) => !selectedCountries.some((s) => s.value === d.value)
      );

      const merged = [...baseList.slice(0, 5), ...selectedCountries];

      setFilteredValues(merged);
    } else {
      // search results
      const results = countryList.filter((c) =>
        c.title.toLowerCase().startsWith(query.toLowerCase())
      );

      const baseList = results.filter(
        (r) => !selectedCountries.some((s) => s.value === r.value)
      );

      const merged = [...baseList.slice(0, 5), ...selectedCountries];

      setFilteredValues(merged);
    }
  };

  const handleCheck = (value: string) => {
    // const updatedFiltered = filteredValues.map((item) =>
    //   item.value === value ? { ...item, selected: !item.selected } : item
    // );
    const finalValue = values.map((item) =>
      item.value === value ? { ...item, selected: !item.selected } : item
    );

    // update both states
    // setFilteredValues(updatedFiltered);
    setFilterData.setMarketsFiltersData({
      filterModuleType: type,
      value: finalValue,
      filterType: "common",
      parentIndex: parentIndex,
    });
  };

  return (
    <div className="tabs-content">
      <div className="icon-input-comp">
        <SearchIcon />
        <input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleFilter(e.target.value)}
          type="search"
          className="forms-input"
        />
      </div>
      <div className="checkbox-grp">
        {filteredValues.map((ele, index) => (
          <label key={index} className="forms-checkbox sm">
            <input
              type="checkbox"
              checked={!!ele?.selected}
              onChange={() => handleCheck(ele.value)}
            />
            <span className="custom-checkbox"></span>
            <>
             <Image
                                      src={`https://flagcdn.com/w320/${ele.value.toLowerCase()}.png`}
                                      width={19}
                                      height={12}
                                      alt={
                                        ele.title ?? ""
                                      }
                                      sizes="100vw"
                                    />
            <span className="f-r-label">{ele.title}</span>
            </>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CountyFilter;
