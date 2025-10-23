export interface attachment {
  url: string;
  name: string;
}
export interface MessageThread {
  _id: string;
  messages: Message[];
}

export interface MessageThreadResponse {
  listData: MessageThreadListData;
  totalItems: number;
  totalDrafted: number;
  totalArchived: number;
}

export interface MessageThreadListData {
  result: MessageThread[];
  totalPages: number;
  currentPage: number;
  totalListCount: number;
}

export interface Message {
    _id: string;
    createdBy: string;
    user_id: string;
    subject: string;
    content: string;
    attachment: attachment[];
    fav: boolean;
    read: boolean;
    isArchive: boolean;
    to: string[];
    createdAt: string;
}