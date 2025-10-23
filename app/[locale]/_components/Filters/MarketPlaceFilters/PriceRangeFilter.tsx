import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import {
  FiltersModuleTypes,
  PriceRangeInterface,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { Slider } from "primereact/slider";
import React, { useEffect, useRef, useState } from "react";

type PriceRangeFilterProps = {
  values: PriceRangeInterface;
  parentIndex: number;
  type: FiltersModuleTypes;
};

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  values,
  parentIndex,
  type,
}) => {
  const setFilterData = useFiltersData();

  const [value, setValue] = useState<[number, number]>([0, 100]);
  const [inputMin, setInputMin] = useState<number>(0);
  const [inputMax, setInputMax] = useState<number>(100);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      values?.minPriceRange !== undefined &&
      values?.maxPriceRange !== undefined
    ) {
      setValue([values.minPriceRange, values.maxPriceRange]);
      setInputMin(values.minPriceRange);
      setInputMax(values.maxPriceRange);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const onSliderChange = (e: any) => {
    if (Array.isArray(e.value)) {
      const newRange = e.value as [number, number];
      setValue(newRange);
      setInputMin(newRange[0]);
      setInputMax(newRange[1]);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      let newValue = { ...values };
      newValue.minPrice = newRange[0];
      newValue.maxPrice = newRange[1];
      debounceTimer.current = setTimeout(() => {
        setFilterData.setMarketsFiltersData({
          filterModuleType: type,
          value: newValue,
          filterType: "priceRange",
          parentIndex: parentIndex,
        });
      }, 400); // debounce duration
    }
  };

  const onGoClick = () => {
    const min = Math.max(values?.minPriceRange ?? 0, inputMin ?? 0);
    const max = Math.min(values?.maxPriceRange ?? 1000000, inputMax ?? 5000);
    const finalMin = Math.min(min, max);
    const finalMax = Math.max(min, max);
    const finalRange: [number, number] = [finalMin, finalMax];

    setValue(finalRange);
    let newValue = { ...values };
    newValue.minPrice = finalMin;
    newValue.maxPrice = finalMax;
    setFilterData.setMarketsFiltersData({
      filterModuleType: type,
      value: newValue,
      filterType: "priceRange",
      parentIndex: parentIndex,
    });
  };

  return (
    <div className="tabs-content">
      <Slider
        value={value}
        onChange={onSliderChange}
        className="price-range-slider"
        range
        min={values?.minPriceRange ?? 0}
        max={values?.maxPriceRange ?? 100000}
        step={values?.step ?? 50}
      />
      <div className="min-max-grp">
        <div className="forms-group">
          <label className="f-g-label" htmlFor="Min">
            Min
          </label>
          <InputField
            type="number"
            placeholder="-"
            value={inputMin}
            onChange={(e) => setInputMin(Number(e.target.value))}
          />
        </div>
        <div className="forms-group">
          <label className="f-g-label hypen">-</label>
        </div>
        <div className="forms-group">
          <label className="f-g-label" htmlFor="Max">
            Max
          </label>
          <InputField
            type="number"
            placeholder="-"
            value={inputMax === 0 ? '' : inputMax}
            onChange={(e) => {
              setInputMax(e.target.value === '' ? 0 : Number(e.target.value))
            }}
          />
        </div>
        <Buttons
          className="btn-c-primary btn-c-sm"
          disabled={false}
          text="Go"
          onClick={onGoClick}
        />
      </div>
    </div>
  );
};

export default PriceRangeFilter;
