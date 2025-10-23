"use client";

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type CountryCodeProps = {
  setCountryCode: (code: string) => void;
  country_code: string
};

const CountryCode: React.FC<CountryCodeProps> = ({ setCountryCode }) => {
  // const [flag, setFlag] = useState("/flags/in.png");

  const handleOnChange = (country: any) => {
    const countryCode = `+${country.dialCode}`;
    setCountryCode(countryCode);
    // setFlag(`/flags/${country.countryCode}.png`);
  };

  return (
    <div className="flex items-center gap-2">
      {/* <Image src={flag} width={20} height={20} alt="Country Flag" /> */}

      <PhoneInput
        country={"in"}
        onChange={(country: any) => handleOnChange(country)}
        inputStyle={{ width: "100%" }}
      />
    </div>
  );
};

export default CountryCode;
