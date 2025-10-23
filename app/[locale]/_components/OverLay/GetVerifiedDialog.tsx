"use client";
import { setGetVerifiedDialog } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import GetVerifiedTick from "@/assets/img/get-verified-profile-tick.svg";
import Image from "next/image";
import { Dialog } from "primereact/dialog";
import Typography from "../Base/Typography";
import Buttons from "../Buttons/Buttons";
import { CloseIcon, TickGreenIcon } from "../Icons/SVGIcons";

const GetVerifiedDialog = () => {
  const dispatch = useAppDispatch();

  const getVerifiedDialog = useAppSelector(
    (state: RootState) => state.uiData.getVerifiedDialog
  );

  return (
    <>
      <Dialog
        visible={getVerifiedDialog}
        modal
        className="modal-comp get-verified-modal"
        closable={true}
        onHide={() => { }}
        content={() => (
          <>
            <div className="m-c-head">
              <div className="m-c-h-left">
                <Image
                  src={GetVerifiedTick}
                  alt="Verified"
                  width={66}
                  height={66}
                ></Image>
                <div className="title-block">
                  <Typography variant="span" className="t-b-title">
                    Get Verified!
                  </Typography>
                  <Typography variant="span" className="t-b-subtxt">
                    Complete your Profile and KYC to get verified badge
                  </Typography>
                </div>
              </div>
              <div className="m-c-h-right">
                <CloseIcon
                  onClick={() => dispatch(setGetVerifiedDialog(false))}
                />
              </div>
            </div>
            <div className="m-c-body">
              <div className="to-get-verified-list-block">
                <div className="t-g-v-l-b-item">
                  <TickGreenIcon />
                  <Typography variant="span" className="t-g-v-l-b-i-txt">
                    Receive Trust Badges
                  </Typography>
                </div>
                <div className="t-g-v-l-b-item">
                  <TickGreenIcon />
                  <Typography variant="span" className="t-g-v-l-b-i-txt">
                    Get Priority Listing
                  </Typography>
                </div>
                <div className="t-g-v-l-b-item">
                  <TickGreenIcon />
                  <Typography variant="span" className="t-g-v-l-b-i-txt">
                    Enable New Customer Discovery
                  </Typography>
                </div>
                <div className="t-g-v-l-b-item">
                  <TickGreenIcon />
                  <Typography variant="span" className="t-g-v-l-b-i-txt">
                    Increase Visibility
                  </Typography>
                </div>
              </div>
            </div>
            <div className="m-c-footer">
              <Buttons
                text={"Remind me later"}
                className={"btn-plain-txt"}
                onClick={() => dispatch(setGetVerifiedDialog(false))}
              ></Buttons>
              <Buttons
                className={"btn-c-primary"}
                text={"Complete now"}
                onClick={() => dispatch(setGetVerifiedDialog(false))}
              />
            </div>
          </>
        )}
      ></Dialog>
    </>
  );
};

export default GetVerifiedDialog;
