"use client";
import React, { useEffect, useRef, useState } from "react";

import ChipInputs from "@/app/[locale]/_components/StoreFront/Forms/ChipInputs";
import { Dropdowndata } from "@/app/[locale]/_interface/ConnectInterface";
import Typography from "../Base/Typography";
import { ChipCloseIcon } from "../Icons/SVGIcons";

interface MentionInputsProps {
  chipValue: any[]; // Replace `any[]` with more specific type like `Contact[]` if available
  setChipValue: (val: any[]) => void;
  item?: any;
  index?: number | 0;
  data: Dropdowndata[];
}

const MentionInputs: React.FC<MentionInputsProps> = ({
  chipValue,
  setChipValue,
  data,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        onChange={(e: any) => setChipValue(e.value)}
        value={chipValue}
        onFocus={() => setIsDropdownOpen((prev) => !prev)}
        handleOnAdd={(value) => {
          const exists = (chipValue || []).some(
            (item) => item._id === value._id
          );
          if (!exists) {
            setChipValue([...(chipValue || []), value]);
          }
        }}
        handleOnRemove={(valueToRemove) => {
          const updated = (chipValue || []).filter(
            (item) => item._id !== valueToRemove._id
          );
          setChipValue(updated);
        }}
        itemTemplate={(attriValue: any) => (
          <span
            className={`chip-custom ${attriValue.isSelected ? "chip-selected" : ""
              }`}
          >
            <span className="chip-text">{attriValue.email}</span>
            {!attriValue.isSelected && (
              <div
                className="chip-close"
                onClick={(e) => {
                  e.stopPropagation();
                  const updated = chipValue.filter(
                    (item) => item._id !== attriValue._id
                  );
                  setChipValue(updated);
                }}
              >
                <ChipCloseIcon />
              </div>
            )}
          </span>
        )}
      />
      {isDropdownOpen && (
        <div
          className={`c-i-d-dropdown-block ${isDropdownOpen ? "dropdown-show" : "dropdown-hide"
            }`}
        >
          <ul className="c-i-d-d-b-ul">
            <li className="suggest-txt">
              <span className="s-t-txt">Suggested Contacts</span>
            </li>
            <div className="profile-list-block">
              {data?.length > 0
                ? data.map((contact: Dropdowndata) => (
                  <>
                    <li
                      className="profile-info-item"
                      key={contact._id}
                      onClick={() => {
                        const alreadyExists = chipValue.some(
                          (c) =>
                            c._id === contact._id || c.email === contact.email
                        );
                        if (!alreadyExists) {
                          setChipValue([...chipValue, contact]);
                        }
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="p-i-i-img bg-1">
                        <Typography
                          variant="span"
                          className="p-i-i-i-short-name"
                        ></Typography>
                      </div>
                      <div className="p-i-i-details">
                        <Typography variant="span" className="p-i-i-d-name">
                          {contact.contactName}
                        </Typography>
                        <Typography variant="span" className="p-i-i-d-mail">
                          {contact?.email}
                        </Typography>
                      </div>
                    </li>
                  </>
                ))
                : null}
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MentionInputs;
