export interface Fields {
  email: string;
  phone: string;
}

export interface VerificationStage {
  stage:
    | "initial"
    | "otpVerification"
    | "upsertMailSession"
    | "phoneVerification"
    | "loading"
    | "userVerification"
    | "tryAnotherWay";
}

export interface AuthPayloads {
  email?: string;
  phone?: string;
  countryCode?: string;
  countryISOCode?: string;
  smsType?: "whatsapp" | "sms";
}
export interface verifyPayload {
  email?: string;
  phoneNo?: string;
  countryCode?: string;
}
export type ContactType =
  | "Whatsapp"
  | "WeChat"
  | "Telegram"
  | "SMS"
  | "LinkNumber";
