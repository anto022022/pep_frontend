import Typography from "@/app/[locale]/_components/Base/Typography";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import { CompletedIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import { setIsAccountSettingOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { Dialog } from "primereact/dialog";

const CancelSubscription = () => {
  const dispatch = useAppDispatch();
  const accSetLang = useTranslations("accountSettings");

  const { isAccountSettingOpen } = useAppSelector(
    (state: RootState) => state.uiData
  );

  const handlePauseMyPlan = () => {
  };

  const handleChatSupport = () => { };

  const handleDowngradeMyPlan = () => { };

  return (
    <>
      {" "}
      <Dialog
        visible={isAccountSettingOpen}
        modal
        className="modal-comp category-modal ubo-verify-modal"
        closable={false}
        onHide={() => dispatch(setIsAccountSettingOpen(false))}
      >
        <div className="cancel-subscription">
          <div className="body-membership-settings">
            <div className="cancel-title-center">
              <img
                src="https://pepagora.s3.ap-south-1.amazonaws.com/assets/3k91cnr6KOgZcg71W_FSe.png"
                alt="icon"
              />
            </div>
            <Typography variant="h4" className="cancel-title-center">
              {accSetLang("subscriptionDetails.cancelMembershipForm.fields.title")}
            </Typography>
            <Typography variant="h4" className="cancel-sub-title">
              {accSetLang("subscriptionDetails.cancelMembershipForm.fields.subTitle")}
            </Typography>
          </div>

          <div>
            <Typography variant="h4" className="cancel-menu-title  ">
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_1.title")}
            </Typography>
            <Typography variant="h4" className="cancel-menu-sub-title">
              <span className="tick">
                {" "}
                <CompletedIcon />{" "}
              </span>{" "}
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_1.point_1")}
            </Typography>
            <Typography variant="h4" className="cancel-menu-sub-title">
              <span className="tick">
                {" "}
                <CompletedIcon />{" "}
              </span>{" "}
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_1.point_2")}
            </Typography>{" "}
            <Typography variant="h4" className="cancel-menu-sub-title">
              <span className="tick">
                {" "}
                <CompletedIcon />{" "}
              </span>{" "}
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_1.point_3")}
            </Typography>{" "}
            <Typography variant="h4" className="cancel-menu-sub-title">
              <span className="tick">
                {" "}
                <CompletedIcon />{" "}
              </span>{" "}
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_1.point_4")}
            </Typography>{" "}
            <Typography variant="h4" className="cancel-menu-sub-title">
              <span className="tick">
                {" "}
                <CompletedIcon />{" "}
              </span>{" "}
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_1.point_5")}
            </Typography>{" "}
            <Typography variant="h4" className="cancel-beg">
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_1.point_5")}
            </Typography>{" "}
          </div>
          <div className="ct-mb">
            {" "}
            <Typography variant="h4" className="cancel-menu-title ">
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_2.title")}
            </Typography>
            <Typography variant="h4" className="bullet-text ">
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_2.point_1")} <b>{accSetLang("subscriptionDetails.cancelMembershipForm.menu_2.point_1_highlight")}</b>
            </Typography>
            <Typography variant="h4" className="bullet-text ">
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_2.point_2")} <b>{accSetLang("subscriptionDetails.cancelMembershipForm.menu_2.point_2_highlight")}</b>
            </Typography>{" "}
            <Typography variant="h4" className="bullet-text ">
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_2.point_3")} <b>{accSetLang("subscriptionDetails.cancelMembershipForm.menu_2.point_3_highlight")}</b>
            </Typography>{" "}
            <Typography variant="h4" className="bullet-text ">
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_2.point_4")}
            </Typography>{" "}
          </div>

          <div className="ct-mb">
            <Typography variant="h4" className="cancel-menu-title ">
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_3.title")}
            </Typography>
          </div>
          <div className="still-unsure">
            <div className="card-container">
              <div className="card">
                <div className="icon">
                  <img
                    src="https://pepagora.s3.ap-south-1.amazonaws.com/assets/xkMi-lmDvb7cJQHDeGczp.png"
                    alt="refresh"
                  />
                </div>
                <div className="card-title">{accSetLang("subscriptionDetails.cancelMembershipForm.cards.card_1.title")}</div>
                <div className="card-description">
                  {accSetLang("subscriptionDetails.cancelMembershipForm.cards.card_1.subTitle")}
                </div>
                <button
                  className="btn-comp btn-outline bg-outline-dark w-s"
                  onClick={handlePauseMyPlan}
                >
                  {accSetLang("subscriptionDetails.cancelMembershipForm.cards.card_1.button")}
                </button>
              </div>

              <div className="card">
                <div className="icon">
                  <img
                    src="https://pepagora.s3.ap-south-1.amazonaws.com/assets/3V1SkQIG8dIcoZmp30yAd.png"
                    alt="message"
                  />
                </div>
                <div className="card-title">{accSetLang("subscriptionDetails.cancelMembershipForm.cards.card_2.title")}</div>
                <div className="card-description">{accSetLang("subscriptionDetails.cancelMembershipForm.cards.card_2.subTitle")}</div>
                <button
                  className="btn-comp btn-outline bg-outline-dark w-s"
                  onClick={handleChatSupport}
                >
                  {accSetLang("subscriptionDetails.cancelMembershipForm.cards.card_2.button")}
                </button>
              </div>

              <div className="card">
                <div className="icon">
                  <img
                    src="https://pepagora.s3.ap-south-1.amazonaws.com/assets/D4I6shQZT-4RlxevY7XsE.png"
                    alt="downgrade"
                  />
                </div>
                <div className="card-title">{accSetLang("subscriptionDetails.cancelMembershipForm.cards.card_3.title")}</div>
                <div className="card-description">{accSetLang("subscriptionDetails.cancelMembershipForm.cards.card_3.subTitle")}</div>
                <button
                  className="btn-comp btn-outline bg-outline-dark w-s"
                  onClick={handleDowngradeMyPlan}
                >
                  {accSetLang("subscriptionDetails.cancelMembershipForm.cards.card_3.button")}
                </button>
              </div>
            </div>
          </div>
          <div className="ct-mt">
            <Typography variant="h4" className="cancel-menu-title ">
              {accSetLang("subscriptionDetails.cancelMembershipForm.menu_3.title")}
            </Typography>
          </div>
          <Typography variant="h4" className="cancel-menu-sub-title">
            <div> {accSetLang("subscriptionDetails.cancelMembershipForm.decision")}</div>
            <div> {accSetLang("subscriptionDetails.cancelMembershipForm.feedback")}</div>
          </Typography>
          <div className="custom-bottom-border" />
          <div className="body-payment">
            <div className="m-c-footer pay-mt">
              <Buttons
                className="btn-comp btn-outline bg-outline-dark"
                text={accSetLang("subscriptionDetails.cancelMembershipForm.hopeBtn")}
                onClick={() => dispatch(setIsAccountSettingOpen(false))}
              />
              <Buttons
                className="btn-c-primary"
                text={accSetLang("subscriptionDetails.cancelMembershipForm.ContinueCancelBtn")}
                type="submit"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CancelSubscription;
