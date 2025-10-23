"use client";
import ComposeCard from "@/app/[locale]/_components/Cards/ComposeCard";
import LogComposeCard from "@/app/[locale]/_components/Cards/LogComposeCard";
import LogsCard from "@/app/[locale]/_components/Cards/LogsCard";
import MessageCard from "@/app/[locale]/_components/Cards/MessageCard";
import SuccessDialog from "@/app/[locale]/_components/dialog/SuccessDialog";
import TimeLineDivider from "@/app/[locale]/_components/Skeleton/TimelineDivider";
import {
  Attachment,
  Dropdowndata,
} from "@/app/[locale]/_interface/ConnectInterface";
import { useUpdateMessageStatusMutation } from "@/app/[locale]/_store/apiReducer/buyingRequestApi";
import {
  useAddContactMessageMutation,
  useGetContactThreadDetailsQuery,
} from "@/app/[locale]/_store/apiReducer/connectApi";
import {
  setMessageUpdated,
  setNewMessageSent,
} from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
interface LogListProps {
  listData: Dropdowndata[];
  threadData:MessageThread[];
  pageId:string;
  pageType:string;
}

export interface MessageThread {
  subject: string;
  content: string;
  attachment: Attachment[];
  fav: boolean;
  read: boolean;
  threadId: string;
  isDeleted: false;
  reactions: string[];
  isArchive: boolean;
  to: string[];
  type: string;
  cc: string[];
  bcc: string[];
  pageType: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  createdByUser: {
    _id: string;
    email: string;
  };
}
const LogsList: React.FC<LogListProps> = ({  listData,threadData,pageId,pageType}) => {
  const [addNewMessage] = useAddContactMessageMutation();
  const [updateMessageStatus] = useUpdateMessageStatusMutation();
  const threadId = useAppSelector((state: RootState) => state.connect.threadId);
  const messageUpdated = useAppSelector(
    (state: RootState) => state.uiData.messageUpdated
  );
  const messageSent = useAppSelector(
    (state: RootState) => state.uiData.newMessageSent
  );
  const dispatch = useAppDispatch();

  

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

  // const handleSend = async (content: string) => {
  //   try {
  //     const res = await addNewMessage({
  //       id: pageId,
  //       data: {
  //         content,
  //         type: "chat",
  //         threadId,
  //         pageType: "connect",
  //       },
  //     });
  //     if (res) {
  //       dispatch(setNewMessageSent(true));

  //       setTimeout(async () => {
  //         dispatch(setNewMessageSent(false));
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="logs-list-comp">
      <div className="l-l-c-list">
        <TimeLineDivider date={new Date()} />
        {(threadId?.length > 0 || threadId) && (
          <div className="logs-card-block">
            {/* <LogComposeCard handleSubmit={handleSend} /> */}
            <ComposeCard data={listData} pageType={pageType} pageId={pageId}  />
          </div>
        )}
      </div>
      {threadData?.map((m: MessageThread) => {
        return (
          <div className="l-l-c-list" key={m._id}>
            <TimeLineDivider date={m.createdAt} />
            <div className="logs-card-block">
              {m.type === "chat" ? (
                <LogsCard
                  image="https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg"
                  date={m.createdAt}
                  name={m.createdByUser?.email}
                  message={m.content}
                  reactions={m.reactions}
                  id={m._id}
                  markRead={markRead}
                  isDeleted={isDeleted}
                />
              ) : m.type === "email" ? (
                <MessageCard
                  subject={m.subject}
                  mail={m.createdByUser?.email}
                  to={m.to}
                  date={m.createdAt}
                  content={m.content}
                  attachments={m.attachment}
                  markRead={markRead}
                  id={m._id}
                  isDeleted={isDeleted}
                  threadId={threadId}
                  listData={listData}
                  pageId={pageId}
                />
              ) : null}
            </div>
          </div>
        );
      })}
      <SuccessDialog
        visible={messageUpdated}
        title={"Message Updated Successfully"}
      />
      <SuccessDialog
        visible={messageSent}
        title={"Message Sent Successfully"}
      />
    </div>
  );
};

export default LogsList;
