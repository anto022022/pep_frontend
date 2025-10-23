import { listCounts } from "@/app/[locale]/_interface/SalesProductInterface";
import { SearchIcon } from "../../Icons/SVGIcons";

interface TableHeaderProps {
  searchQuery: string;
  setSearchQuery: (id: string) => void;
  listCounts: listCounts;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <>
      <div className="p-datatable-header-left">
        {/* <Tabs listCounts={listCounts} setListStatus={(val:string) => setListStatus(val)} /> */}
      </div>
      <div className="p-datatable-header-right">
        <div className="icon-input-comp">
          <SearchIcon />
          <input
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search Product"
            type="search"
            className="forms-input"
          />
        </div>
        {/* <MultiSelectInputs className="customize-dropdown" appendTo="self" /> */}
      </div>
    </>
  );
};
