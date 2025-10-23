import React from "react";
import { CategoriesListInterface } from "../../_interface/common";
import Typography from "../Base/Typography";
import { CategoryEmptyIcon, SearchIcon } from "../Icons/SVGIcons";

interface DataTableOptionsProps {
  loading: boolean;
  list: any;
  selected: any;
  searchQuery?: string;
  type: string;
  title: string;
  instructionText: string;
  setSearchQuery: (val: any) => void;
  handleListClick: (val: any) => void;
  errors?: boolean;
}

export const NestedCategorySelectList: React.FC<DataTableOptionsProps> = ({
  searchQuery,
  type,
  title,
  setSearchQuery,
  handleListClick,
  selected,
  list,
  loading,
  instructionText,
  errors,
}) => {
  return (
    <>
      <div className="category-block">
        <div className="c-b-header">
          <div className="forms-group">
            <label className="f-g-label">{title}</label>
            <div className="icon-input-comp invert">
              <SearchIcon />
              <input
                placeholder="Search"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                type="search"
                className={`forms-input ${errors && "error-input"}`}
              />
            </div>
          </div>
        </div>
        <div className="c-b-body">
          {loading ? (
            <li className="loading">Loading...</li>
          ) : list?.length ? (
            <ul className="category-ul">
              {list.map((cat: CategoriesListInterface) => (
                <li
                  key={cat._id}
                  onClick={() => handleListClick(cat)}
                  className={`${
                    cat?._id === selected?._id && "active"
                  } category-li`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="placeholder-txt-block">
              {type !== "Category" && <CategoryEmptyIcon />}
              <Typography variant="span" className="p-t-b-txt">
                {instructionText}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
