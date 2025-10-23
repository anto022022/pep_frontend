import useCookies from "@/app/[locale]/_hooks/useCookies";
import { currencyList } from "@/app/[locale]/_models/StoreFront";
import { setCurrency } from "@/app/[locale]/_store/reducers/location_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { Dropdown } from "primereact/dropdown";

const CurrencySelectInput = () => {
  const cookies = useCookies();
  const dispatch = useAppDispatch();
  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );

  const setCurrencyCodeInCookie = (value: string) => {
    cookies.setCookie("currencyCode", value, 2);
    dispatch(setCurrency(value));
  };

  return (
    <div className="language-input-comp">
      <Dropdown
        value={currencyCode}
        onChange={(e) => setCurrencyCodeInCookie(e.value)}
        options={currencyList}
        optionValue="code"
        // optionLabel="symbol"
        className="language-input currency-dropdown"
        panelClassName="custom-dropdown "
        valueTemplate={(option) => {
          return `${option?.symbol}`;
        }}
        itemTemplate={(option) => {
          return `${option?.symbol} - ${option?.code}`;
        }}
      />
    </div>
  );
};

export default CurrencySelectInput;
