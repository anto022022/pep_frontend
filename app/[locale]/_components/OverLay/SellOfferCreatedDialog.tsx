"use client";
import CheckBoxInputs from "@/app/[locale]/_components/StoreFront/Forms/CheckBoxInputs";
import ToggleInput from "@/app/[locale]/_components/StoreFront/Forms/ToggleInputs";
import Img1 from '@/public/img/saved-contacts-1.png';
import Img2 from '@/public/img/saved-contacts-2.png';
import Img3 from '@/public/img/saved-contacts-3.png';
import Img4 from '@/public/img/saved-contacts-4.png';
import Img5 from '@/public/img/saved-contacts-5.png';
import Img6 from '@/public/img/saved-contacts-6.png';
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { savedContacts } from "../../_models/sales/product";
import { setSellOfferCreatedDialog } from "../../_store/reducers/ui_store";
import { RootState, useAppSelector } from "../../_store/store";
import Typography from "../Base/Typography";
import CustomButton from "../Buttons/Button";
import ButtonIconRight from "../Buttons/ButtonIconRight";
import {
  CloseIcon,
  InfoIcon,
  RightArrowIcon,
  SavedContactsIcon,
  TickIcon,
} from "../Icons/SVGIcons";
import { useTranslations } from "next-intl";

const SellOfferCreatedDialog = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isContactsEnabled, setIsContactsEnabled] = useState<boolean>(false);
  const [isPostOnFeed, setIsPostOnFeed] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const common = useTranslations("common");
  const showSellOfferCreatedDialog = useAppSelector(
    (state: RootState) => state.uiData.sellOfferCreatedDialog
  );

  const dispatch = useDispatch();

  const router = useRouter();
  const handleContactChange = (id: number, isChecked: boolean) => {
    setSelectedContacts((prevSelected) =>
      isChecked
        ? [...prevSelected, id]
        : prevSelected.filter((contactId) => contactId !== id)
    );
  };
  const handleSelectAll = () => {
    const allContactIds = savedContacts.map((contact) => contact.id);
    setSelectedContacts(allContactIds);
  };

  const handleClearAll = () => {
    setSelectedContacts([]);
  };
  const handleClose = () => {
     router.push(`/app/sales-sell-offer`);
    dispatch(setSellOfferCreatedDialog(false));
   
  };
  return (
    <Dialog
      visible={showSellOfferCreatedDialog}
      modal
      onHide={() => dispatch(setSellOfferCreatedDialog(false))}
      className="modal-comp sell-offer-created-modal"
      closable={true}
      content={() => (
        <>
          <div className="m-c-head">
            <div className="m-c-h-left">
              <TickIcon />
              <div className="m-c-h-l-content">
                <Typography variant="h6" className="modal-title">
                  Sell offer created successfully.{" "}
                </Typography>
                <Typography variant="span" className="modal-subtxt">
                  It will be listed on the marketplace after admin approval.
                </Typography>
              </div>
            </div>
            <div className="m-c-h-right">
              <div className="close-icon-action" onClick={() => handleClose()}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="m-c-body">
            <div className="share-contacts-block">
              <div className="alert-message-custom a-m-c-sm info-bg">
                <div className="a-m-c-left">
                  <div className="a-m-c-icon-message">
                    <InfoIcon />
                    <span className="a-m-c-message">
                      Sell Offers can be posted on the feed or Shared with
                      contacts after Admin Approval.
                    </span>
                  </div>
                </div>
                <div className="a-m-c-right">
                  <CloseIcon className={"close-icon"} />
                </div>
              </div>
              <div className="s-c-b-content">
                <Typography variant="span" className="s-c-b-c-title">
                  Share with your contacts!
                </Typography>
                <Typography variant="span" className="s-c-b-c-subtxt">
                  Easily send offer notifications to saved contacts.
                </Typography>
              </div>
              <div className="s-c-b-toggle-group">
                <div className="forms-group">
                  <div className="f-g-input-horiz">
                    <label
                      className="f-g-label cursor-pointer"
                      htmlFor="PostOnFeed"
                    >
                      Post on feed
                    </label>
                    <ToggleInput
                      name="PostOnFeed"
                      checked={isPostOnFeed}
                      onChange={(e) => setIsPostOnFeed(e.target.checked)}
                    />
                  </div>
                </div>
                <div className="forms-group">
                  <div className="f-g-input-horiz">
                    <label
                      className="f-g-label cursor-pointer"
                      htmlFor="SendToContacts"
                    >
                      Send to contacts
                    </label>
                    <ToggleInput
                      name="SendToContacts"
                      checked={isContactsEnabled}
                      onChange={(e) => setIsContactsEnabled(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {isContactsEnabled && (
              <div className="saved-contacts-block">
                <div className="s-c-b-head">
                  <div className="s-c-b-h-left">
                    <SavedContactsIcon />
                    <Typography variant="span" className="s-c-b-h-l-title">
                      Saved Contacts
                    </Typography>
                  </div>
                  <div className="s-c-b-h-right">
                    <CustomButton
                      className="btn-plain-txt btn-c-sm"
                      text={`${common("selectAll")}`} 
                      onClick={handleSelectAll}
                    />
                    <CustomButton
                      className="btn-plain-txt btn-c-sm"
                      text={`${common("clearAll")}`}
                      onClick={handleClearAll}
                    />
                  </div>
                </div>
                <div className="s-c-b-body">
                  {/* {savedContacts.map((contact) => (
                    <label
                      htmlFor={`contact-${contact.id}`}
                      className="saved-contacts-comp"
                      key={contact.id}
                    >
                      <CheckBoxInputs
                        checked={selectedContacts.includes(contact.id)}
                        onChange={(e) =>
                          handleContactChange(contact.id, e.target.checked)
                        }
                      />
                      <div className="s-c-c-info-block">
                        <div className="s-c-c-i-b-img">
                          
                          <img src={contact.img} width={48} height={48} alt={contact.name} />

                        </div>
                        <div className="s-c-c-i-b-content">
                          <Typography
                            variant="span"
                            className="s-c-c-i-b-c-title"
                          >
                            {contact.name}
                          </Typography>
                          <Typography
                            variant="span"
                            className="s-c-c-i-b-c-subtxt"
                          >
                            {contact.manufactures}
                          </Typography>
                        </div>
                      </div>
                    </label>
                  ))} */}
                  <label htmlFor="contact-1" className="saved-contacts-comp">
                    <CheckBoxInputs
                      checked={selectedContacts.includes(1)}
                      onChange={(e) => handleContactChange(1, e.target.checked)}
                    />
                    <div className="s-c-c-info-block">
                      <div className="s-c-c-i-b-img">
                      <Image src={Img1} width={48} height={48} alt="Aneesh Exports" />

                      </div>
                      <div className="s-c-c-i-b-content">
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-title"
                        >
                          Aneesh Exports
                        </Typography>
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-subtxt"
                        >
                          Manufacturers | Madurai
                        </Typography>
                      </div>
                    </div>
                  </label>

                  <label htmlFor="contact-2" className="saved-contacts-comp">
                    <CheckBoxInputs
                      checked={selectedContacts.includes(2)}
                      onChange={(e) => handleContactChange(2, e.target.checked)}
                    />
                    <div className="s-c-c-info-block">
                      <div className="s-c-c-i-b-img">
                      <Image src={Img2} width={48} height={48} alt="Aneesh Exports" />

                      </div>
                      <div className="s-c-c-i-b-content">
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-title"
                        >
                          Duo Exports
                        </Typography>
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-subtxt"
                        >
                          Manufacturers | Madurai
                        </Typography>
                      </div>
                    </div>
                  </label>

                  <label htmlFor="contact-3" className="saved-contacts-comp">
                    <CheckBoxInputs
                      checked={selectedContacts.includes(3)}
                      onChange={(e) => handleContactChange(3, e.target.checked)}
                    />
                    <div className="s-c-c-info-block">
                      <div className="s-c-c-i-b-img">
                      <Image src={Img3} width={48} height={48} alt="Aneesh Exports" />

                      </div>
                      <div className="s-c-c-i-b-content">
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-title"
                        >
                          Angle Exports
                        </Typography>
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-subtxt"
                        >
                          Manufacturers | Madurai
                        </Typography>
                      </div>
                    </div>
                  </label>

                  <label htmlFor="contact-4" className="saved-contacts-comp">
                    <CheckBoxInputs
                      checked={selectedContacts.includes(4)}
                      onChange={(e) => handleContactChange(4, e.target.checked)}
                    />
                    <div className="s-c-c-info-block">
                      <div className="s-c-c-i-b-img">
                      <Image src={Img4} width={48} height={48} alt="Aneesh Exports" />

                      </div>
                      <div className="s-c-c-i-b-content">
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-title"
                        >
                          Duo Exports
                        </Typography>
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-subtxt"
                        >
                          Manufacturers | Madurai
                        </Typography>
                      </div>
                    </div>
                  </label>

                  <label htmlFor="contact-5" className="saved-contacts-comp">
                    <CheckBoxInputs
                      checked={selectedContacts.includes(5)}
                      onChange={(e) => handleContactChange(5, e.target.checked)}
                    />
                    <div className="s-c-c-info-block">
                      <div className="s-c-c-i-b-img">
                      <Image src={Img5} width={48} height={48} alt="Aneesh Exports" />

                      </div>
                      <div className="s-c-c-i-b-content">
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-title"
                        >
                          Caty Exports
                        </Typography>
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-subtxt"
                        >
                          Manufacturers | Madurai
                        </Typography>
                      </div>
                    </div>
                  </label>

                  <label htmlFor="contact-6" className="saved-contacts-comp">
                    <CheckBoxInputs
                      checked={selectedContacts.includes(6)}
                      onChange={(e) => handleContactChange(6, e.target.checked)}
                    />
                    <div className="s-c-c-info-block">
                      <div className="s-c-c-i-b-img">
                      <Image src={Img6} width={48} height={48} alt="Aneesh Exports" />

                      </div>
                      <div className="s-c-c-i-b-content">
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-title"
                        >
                          Bearing Exports
                        </Typography>
                        <Typography
                          variant="span"
                          className="s-c-c-i-b-c-subtxt"
                        >
                          Manufacturers | Madurai
                        </Typography>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="m-c-footer btn-max-wid btn-right">
            <ButtonIconRight
              name={"Submit"}
              className={`btn-c-sm `}
              onClick={() => handleClose()}

              //   onClick={() => {
              //     dispatch(setSellOfferCreatedDialog(false));
              //     router.push("/app/sales-sell-offer");
              //   }}
            >
              <RightArrowIcon />
            </ButtonIconRight>
          </div>
        </>
      )}
    ></Dialog>
  );
};

export default SellOfferCreatedDialog;
