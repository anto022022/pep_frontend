import LogsList from "@/app/[locale]/_components/StoreFront/LogsList";
import { Dropdowndata } from "@/app/[locale]/_interface/ConnectInterface";
import React, { useState } from "react";
import { LeadsDetails } from "../../_interface/LeadsInterface";
import Typography from "../Base/Typography";
import ButtonIcon from "../Buttons/ButtonIcon";
import Buttons from "../Buttons/Buttons";
import NoInquiresCard from "../Cards/NoInquiriesCard";
import { FilterMobIcon, SearchIcon } from "../Icons/SVGIcons";
import StageTracker from "../Pipe/StageTracker";
import LogsCard from "@/app/[locale]/_components/Cards/LogsCard";
import { useGetContactThreadDetailsQuery } from "@/app/[locale]/_store/apiReducer/connectApi";
import { useUpdateMessageStatusMutation } from "@/app/[locale]/_store/apiReducer/buyingRequestApi";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import {
  setMessageUpdated,
  setNewMessageSent,
} from "@/app/[locale]/_store/reducers/ui_store";
import LogComposeCard from "@/app/[locale]/_components/Cards/LogComposeCard";
import SuccessDialog from "@/app/[locale]/_components/dialog/SuccessDialog";
import { useAddLeadLogMutation } from "@/app/[locale]/_store/apiReducer/leadsApi";
import { useTranslations } from "next-intl";

interface LayoutProps {
  previewData: LeadsDetails;
  listData: Dropdowndata[];
}

const MessagingLayout: React.FC<LayoutProps> = ({ previewData, listData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [updateMessageStatus] = useUpdateMessageStatusMutation();
  const [addLeadLog] = useAddLeadLogMutation();
  const messageSent = useAppSelector(
    (state: RootState) => state.uiData.newMessageSent
  );
  const dispatch = useAppDispatch();
  const t = useTranslations("common");
  const { data: threadData } = useGetContactThreadDetailsQuery(
    {
      threadId: previewData?.threadId ?? undefined,
      page: 1,
      limit: 10,
      pageType: "lead",
      pageId: previewData?._id,
    },
    {
      skip: !previewData?.threadId,
    }
  );

  const markRead = async (id: string) => {
    try {
      const res = await updateMessageStatus({
        id: [id],
        read: true,
      }).unwrap();
      if (res) {
        dispatch(setMessageUpdated(true));

        setTimeout(async () => {
          dispatch(setMessageUpdated(false));
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isDeleted = async (id: string) => {
    try {
      const res = await updateMessageStatus({
        id: [id],
        isDeleted: true,
      }).unwrap();
      if (res) {
        dispatch(setMessageUpdated(true));

        setTimeout(async () => {
          dispatch(setMessageUpdated(false));
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = async (content: string) => {
    try {
      const res = await addLeadLog({
        id: previewData?._id,
        data: {
          description: content,
        },
      });
      if (res) {
        dispatch(setNewMessageSent(true));

        setTimeout(async () => {
          dispatch(setNewMessageSent(false));
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="message-card-head">
      <div className="leads-inbox-block">
        <div className="inbox-title-block-comp">
          {previewData?.requirementDetails &&
            <div className="i-t-b-c-details-block">
              <div className="i-t-b-c-d-b-left">
                <div className="i-t-b-c-info-block">
                  <Typography
                    variant="h3"
                    className="i-t-b-c-i-b-title"
                    htmlContent={previewData.requirementDetails}
                  >
                    {previewData.requirementDetails}
                  </Typography>
                </div>
              </div>
              {/* <div className="i-t-b-c-d-b-right">
              <ButtonIcon className={"b-c-i-outline b-c-i-grey"}>
                <SearchIcon />
              </ButtonIcon>
              <ButtonIcon className={"b-c-i-outline b-c-i-grey"}>
                <FilterMobIcon />
              </ButtonIcon>
            </div> */}
            </div>
          }
          <div className="i-t-b-c-action-block">
            <div className="tabs-block leads-inbox-tabs">
              <Buttons
                className={`btn-outline ${activeIndex == 0 ? "active" : ""}`}
                text={t("stageTracker.inbox")}
                onClick={() => setActiveIndex(0)}
              />
              <Buttons
                className={`btn-outline ${activeIndex == 1 ? "active" : ""}`}
                text={t("stageTracker.logNotes")}
                onClick={() => setActiveIndex(1)}
              />
            </div>
            <StageTracker activeStage={previewData.stage} />
          </div>
        </div>
        {activeIndex == 0 && (
          <>
            {threadData?.data?.listData?.length > 0 ? (
              <LogsList
                pageId={previewData._id}
                threadData={threadData?.data?.listData}
                listData={listData}
                pageType="lead"
              />
            ) : (
              <NoInquiresCard
                listData={listData}
                id={previewData._id}
                pageType="lead"
              />
            )}
          </>
        )}
        {activeIndex == 1 && (
          <>
            <LogComposeCard handleSubmit={handleSend} />
            {previewData?.logs.map((log, index) => (
              // <LogsCard
              //   key={log._id}
              //   name={previewData.customer?.contactName || ""}
              //   image={previewData.customer?.profileImage?.url || ""}
              //   date={log.createdAt}
              //   message={log.description}
              //   updateLog={() => {}}
              //   // addReaction={() => {}}
              //   reactions={log.reactions || []}
              // />
              <LogsCard
                key={index}
                date={log.createdAt}
                name={previewData.customer?.contactName || ""}
                message={log.description}
                reactions={log?.reactions || []}
                id={log._id}
                markRead={markRead}
                isDeleted={isDeleted}
              />
            ))}
            <div className="month-division">
              <div className="month-action-block">
                <div className="m-a-b-left">
                  <Typography variant="h4" className="m-a-b-title"></Typography>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <SuccessDialog
        visible={messageSent}
        title={"Message Sent Successfully"}
      />
    </div>
  );
};

export default MessagingLayout;
