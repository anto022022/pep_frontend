import { Sidebar } from "primereact/sidebar";
import { setIsAccountSettingOpen } from "../../_store/reducers/ui_store";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import Typography from "../Base/Typography";
import ButtonIconRight from "../Buttons/ButtonIconRight";
import { CloseIcon, RightArrowIcon } from "../Icons/SVGIcons";

interface CustomDialogProps {
  title: string;
  submitText: string;
  submitLoadingText: string
  isLoading: boolean;
  reset: () => void;
  handleSubmit: () => void;
  children?: React.ReactNode;
}

const ComplianceSettingsForm: React.FC<CustomDialogProps> = ({
  title,
  submitText,
  submitLoadingText,
  isLoading,
  reset,
  handleSubmit,
  children,
}) => {
  const dispatch = useAppDispatch();
  const { isAccountSettingOpen } = useAppSelector(
    (state: RootState) => state.uiData
  );

  return (
    <>
      <Sidebar
        visible={isAccountSettingOpen}
        position="right"
        onHide={() => dispatch(setIsAccountSettingOpen(false))}
        className="offcanvas-sidebar-comp addnew-lead-sidebar sidebar-md-image"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  {title}
                </Typography>
                <CloseIcon
                  onClick={() => {
                    dispatch(setIsAccountSettingOpen(false));
                    reset();
                  }}
                />
              </div>
              <div className="o-s-c-body">{children}</div>
              <div className="o-s-c-footer">
                <div className="o-s-c-f-left"></div>
                <div className="o-s-c-f-right">
                  <div className="o-s-c-btn-group">
                    <ButtonIconRight name={isLoading ? submitLoadingText : submitText} disabled={isLoading} onClick={handleSubmit}>
                      <RightArrowIcon />
                    </ButtonIconRight>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      />
    </>
  );
};

export default ComplianceSettingsForm;
