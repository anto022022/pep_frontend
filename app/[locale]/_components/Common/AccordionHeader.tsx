"use client";
import Typography from "../Base/Typography";
import ButtonIconLeftOutline from "../Buttons/ButtonIconLeftOutline";
import { EditVariantsIcon } from "../Icons/SVGIcons";

export interface AccordionHeaderProps {
  title: string;
  isEdit: boolean;
  subtxt?: string;
  // handleCancel: () => void;
  // handleSave: () => void;
  handleEdit: () => void;
  className?: string;
}

const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  title,
  isEdit,
  subtxt,
  handleEdit,
  className = "",
}) => {
  return (
    <div
      className={`accordion-header-left ${className} ${
        isEdit ? "isEdit-active" : ""
      }`}
    >
      <div className="a-h-l-content-wrapper">
        <Typography variant="h2" className="a-h-l-title">
          {title}
        </Typography>
        {subtxt && (
          <Typography variant="span" className="a-h-l-subtxt">
            {subtxt}
          </Typography>
        )}
      </div>
      <div className="button-group-block gap-10px wid-btn-block">
        {!isEdit && (
          //  (
          //   <>
          //     <div className="add-option-block">
          //       <ButtonIconLeftOutline
          //         name={"Cancel"}
          //         className={"bg-outline-grey btn-attributes"}
          //         onClick={(e) => {
          //           e.preventDefault();
          //           e.stopPropagation();
          //           handleCancel();
          //         }}
          //       >
          //         <CloseIcon />
          //       </ButtonIconLeftOutline>
          //     </div>
          //     <Buttons
          //       className={"btn-c-primary btn-c-sm"}
          //       text={"Save"}
          //       onClick={(e) => {
          //         e.preventDefault();
          //         e.stopPropagation();
          //         handleSave();
          //       }}
          //     />
          //   </>
          // ) : (
          <ButtonIconLeftOutline
            name={"Edit"}
            className={"bg-outline-grey remv-outline pad-unset"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEdit();
            }}
          >
            <EditVariantsIcon />
          </ButtonIconLeftOutline>
        )}
      </div>
    </div>
  );
};

export default AccordionHeader;
