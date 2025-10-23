import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Typography from "../Base/Typography";
import { ChipCloseIcon } from "../Icons/SVGIcons";
import ChipInputs from "../StoreFront/Forms/ChipInputs";

const Suggestions = ({
  chipValue,
  setChipValue,
  item,
  index,
  handleOnSelect,
}: {
  chipValue: string;
  setChipValue: (value: string) => void;
  item: any;
  index: number;
  handleOnSelect: (value: any, item: any, index: number) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect click outside for this instance
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="chip-input-dropdown mention-inputs-comp" ref={containerRef}>
      <ChipInputs
        onChange={(e) => setChipValue(e[0])}
        value={[chipValue]}
        onFocus={() => setIsDropdownOpen((prev) => !prev)}
        itemTemplate={(attriValue) => (
          <span
            className={`chip-custom ${
              attriValue.isSelected ? "chip-selected" : ""
            }`}
            onClick={() => handleOnSelect(attriValue, item, index)}
          >
            <span className="chip-text">{attriValue}</span>
            {!attriValue.isSelected && (
              <div className="chip-close">
                <ChipCloseIcon />
              </div>
            )}
          </span>
        )}
        handleOnAdd={() => {}}
        handleOnRemove={() => {}}
      />
      {isDropdownOpen && (
        <div
          className={`c-i-d-dropdown-block ${
            isDropdownOpen ? "dropdown-show" : "dropdown-hide"
          }`}
        >
          <ul className="c-i-d-d-b-ul">
            <li className="suggest-txt">
              <span className="s-t-txt">Suggested Contacts</span>
            </li>
            <div className="profile-list-block">
              <li className="profile-info-item">
                <div className="p-i-i-img">
                  <Image
                    src={
                      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                    }
                    width={40}
                    height={40}
                    alt="Profile"
                  ></Image>
                </div>
                <div className="p-i-i-details">
                  <Typography variant="span" className="p-i-i-d-name">
                    Yathindra Raj
                  </Typography>
                  <Typography variant="span" className="p-i-i-d-mail">
                    yathindraraj@gmail.com
                  </Typography>
                </div>
              </li>
              <li className="profile-info-item">
                <div className="p-i-i-img bg-1">
                  <Typography variant="span" className="p-i-i-i-short-name">
                    YA
                  </Typography>
                </div>
                <div className="p-i-i-details">
                  <Typography variant="span" className="p-i-i-d-name">
                    Yathindra Raj
                  </Typography>
                  <Typography variant="span" className="p-i-i-d-mail">
                    yathindraraj@gmail.com
                  </Typography>
                </div>
              </li>
              <li className="profile-info-item">
                <div className="p-i-i-img bg-2">
                  <Typography variant="span" className="p-i-i-i-short-name">
                    VR
                  </Typography>
                </div>
                <div className="p-i-i-details">
                  <Typography variant="span" className="p-i-i-d-name">
                    Vijayarajan
                  </Typography>
                  <Typography variant="span" className="p-i-i-d-mail">
                    vijayarajan@gmail.com
                  </Typography>
                </div>
              </li>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
