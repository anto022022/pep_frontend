import {
  Attribute,
  AttributeValue,
} from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import { FC, useEffect, useRef, useState } from "react";
import { ChipCloseIcon } from "../../Icons/SVGIcons";
import ChipInputs from "./ChipInputs";

interface ChipInputDropDownInterface {
  item: Attribute;
  index: number;
  handleOnAdd: (name: string) => void;
  handleOnRemove: (value: AttributeValue) => void;
  handleOnSelect: (value: AttributeValue) => void;
  handleOnSelectOnDropdown: (value: AttributeValue) => void;
}

const ChipInputDropDown: FC<ChipInputDropDownInterface> = ({
  item,
  handleOnAdd,
  handleOnRemove,
  handleOnSelect,
  handleOnSelectOnDropdown,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="chip-input-dropdown" ref={containerRef}>
      <ChipInputs
        value={item.values.filter((val: AttributeValue) => !val.isRemoved)}
        onFocus={() => setIsDropdownOpen((prev) => !prev)}
        onChange={() => {}} // not needed
        handleOnAdd={(name) =>
          // handleOnAdd(name, valueNameArray, item, index)
          handleOnAdd(name)
        }
        handleOnRemove={(value) =>
          // handleOnRemove(value, item, index)
          handleOnRemove(value)
        }
        itemTemplate={(attriValue: AttributeValue) => (
          <span
            className={`chip-custom ${
              attriValue.isSelected ? "chip-selected" : ""
            }`}
            onClick={() =>
              // handleOnSelect(attriValue, item, index)
              handleOnSelect(attriValue)
            }
          >
            <span className="chip-text">{attriValue.name}</span>
            {!attriValue.isSelected && (
              <div
                className="chip-close"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOnRemove(attriValue);
                }}
              >
                <ChipCloseIcon />
              </div>
            )}
            <div className="click-accept-block">
              <button type="button" className="btn btn-click-accept">
                Click to accept
              </button>
            </div>
          </span>
        )}
      />
      {isDropdownOpen && item.values.length > 0 && (
        <div
          className={`c-i-d-dropdown-block ${
            isDropdownOpen ? "dropdown-show" : "dropdown-hide"
          }`}
        >
          <ul className="c-i-d-d-b-ul">
            {item.values.map((value) => (
              <li key={value.name}>
                <label className={`forms-checkbox sm light-bg`}>
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={value.isSelected}
                      onChange={() => handleOnSelectOnDropdown(value)}
                    />
                    <span className="custom-checkbox"></span>
                  </div>
                  <span className="f-r-label">{value.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChipInputDropDown;
