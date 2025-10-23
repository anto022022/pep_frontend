'use client'
import React, { useState } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion';
import Typography from '../Base/Typography';
import { CollapseUpIcon, EditIcon, InboxStarIcon, MessageCollapseIcon, MessageOptionsIcon, OptionBlockIcon, OptionDownloadAttachIcon, OptionEyeIcon, OptionForwardIcon, OptionReplyIcon, OptionReportIcon, OptionsIcon, ReplyIcon, RightArrowIcon, StarIcon } from '../Icons/SVGIcons';
import ButtonIcon from '../Buttons/ButtonIcon';
import Image from 'next/image';
import ButtonIconLeftOutline from '../Buttons/ButtonIconLeftOutline';
import ComposeCard from './ComposeCard';

const MessageCardNested = ({ variantOne = false, variantTwo = true, quotation = false, newBadge = false }: { variantOne?: boolean, variantTwo?: boolean, quotation?: boolean, newBadge?: boolean }) => {

    const [activeIndex, setActiveIndex] = useState<any>(null);

    const [replyCompose, setReplyCompose] = useState(false);

    const [optionActive, setOptionActive] = useState(false);

    const [isNested, setIsNested] = useState(false);


    const handleTabChange = () => {
        // do nothing — control manually
    };

    const toggleAccordion = () => {
        setActiveIndex((prev: any) => (prev === 0 ? null : 0));
    };

    const handleCloseCompose = () => {
        setReplyCompose(!replyCompose)
    }

    const handleNested = () => {
        setIsNested(true)
        toggleAccordion()
    }

    return (
        <>
            <Accordion activeIndex={activeIndex} className='message-card-comp' onTabChange={handleTabChange}>
                <AccordionTab header={
                    <>
                        <div className='message-card-head'>
                            {replyCompose &&
                                <div className='m-c-h-compose'>
                                    <ComposeCard handleCloseCompose={handleCloseCompose} variantTwo={true} />
                                </div>
                            }
                            <div className='m-c-h-info'>
                                <div className='m-c-h-i-left'>
                                    <ButtonIcon onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAccordion();
                                    }}>
                                        <MessageCollapseIcon />
                                    </ButtonIcon>
                                </div>
                                <div className='m-c-h-i-right'>
                                    <Typography variant='span' className='m-s-h-quote-txt' onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAccordion();
                                    }}>Requested for Quote</Typography>
                                    <div className='message-profile-actions-block'>
                                        <div className='m-p-a-b-left'>
                                            <div className='message-profile-info'>
                                                <div className='m-p-i-img'>
                                                    <Image src={'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D'} alt='Profile' width={32} height={32} />
                                                </div>
                                                <div className='m-p-i-details'>
                                                    <Typography variant='h4' className='profile-name'>Patrick Prik</Typography>
                                                    <Typography variant='h4' className='message-to-txt'>{`to: Aneesh Raj; Admin Official <admin@gmail.com>`}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                        {variantOne &&
                                            <div className='m-p-a-b-right'>
                                                <div className='msg-head-action-time'>
                                                    <div className='msg-action-block'>
                                                        <div className='m-a-b-wrapper'>
                                                            <ButtonIconLeftOutline name={'Reply'} className={'bg-outline-grey'} onClick={() => handleCloseCompose()}>
                                                                <ReplyIcon />
                                                            </ButtonIconLeftOutline>
                                                            <ButtonIcon>
                                                                <InboxStarIcon />
                                                            </ButtonIcon>
                                                        </div>
                                                        <div className={`table-options-block ${optionActive && 'active'}`}>
                                                            <ButtonIcon className={'message-option-icon'} onClick={() => setOptionActive(!optionActive)}>
                                                                <MessageOptionsIcon />
                                                            </ButtonIcon>
                                                            <div className='t-o-b-dropdown'>
                                                                <button className='t-o-btn'>
                                                                    <OptionReplyIcon />
                                                                    <span className='t-o-b-txt'>Reply</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionForwardIcon />
                                                                    <span className='t-o-b-txt'>Forward</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionEyeIcon />
                                                                    <span className='t-o-b-txt'>Mark as Read</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionDownloadAttachIcon />
                                                                    <span className='t-o-b-txt'>Download Attachments</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionReportIcon />
                                                                    <span className='t-o-b-txt'>Report</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionBlockIcon />
                                                                    <span className='t-o-b-txt'>Block</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <EditIcon />
                                                                    <span className='t-o-b-txt'>Delete</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Typography variant='span' className='time-txt'>Apr 14, 2024 at 8.00 pm GMT+8 </Typography>
                                                </div>
                                            </div>
                                        }
                                        {variantTwo &&
                                            <div className='m-p-a-b-right'>
                                                <div className='msg-head-action-time'>
                                                    <div className='msg-action-block'>
                                                        <div className='m-a-b-wrapper'>
                                                            <Typography variant='span' className='time-txt'>Apr 14, 2024 at 8.00 pm GMT+8 </Typography>
                                                            {newBadge &&
                                                                <span className="inbox-badge new">New</span>
                                                            }
                                                            {quotation &&
                                                                <span className="inbox-badge quotation">Quotation</span>
                                                            }
                                                        </div>
                                                        <div className={`table-options-block ${optionActive && 'active'}`}>
                                                            <ButtonIcon className={'message-option-icon'} onClick={() => setOptionActive(!optionActive)}>
                                                                <MessageOptionsIcon />
                                                            </ButtonIcon>
                                                            <div className='t-o-b-dropdown'>
                                                                <button className='t-o-btn'>
                                                                    <OptionReplyIcon />
                                                                    <span className='t-o-b-txt'>Reply</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionForwardIcon />
                                                                    <span className='t-o-b-txt'>Forward</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionEyeIcon />
                                                                    <span className='t-o-b-txt'>Mark as Read</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionDownloadAttachIcon />
                                                                    <span className='t-o-b-txt'>Download Attachments</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionReportIcon />
                                                                    <span className='t-o-b-txt'>Report</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <OptionBlockIcon />
                                                                    <span className='t-o-b-txt'>Block</span>
                                                                </button>
                                                                <button className='t-o-btn'>
                                                                    <EditIcon />
                                                                    <span className='t-o-b-txt'>Delete</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='m-c-h-message'>
                                <Typography variant='span' className='short-msg-txt'>Hi, I’m looking to place a bulk order for indoor plants. Please provide the best rates, MOQ...</Typography>
                            </div>
                        </div>
                        <div className={`nested-divider ${isNested ? 'display-none' : ''}`} onClick={() => {
                            handleNested()
                        }}>
                            <div className='n-d-count'>
                                <CollapseUpIcon />
                                <Typography variant='span' className='n-d-txt'>(12)</Typography>
                            </div>
                        </div>

                        {/* This is conversation */}
                        <div className={`message-card-head ${isNested ? 'display-none' : ''}`}>
                            <div className='m-c-h-info'>
                                <div className='m-c-h-i-left'></div>
                                <div className='m-c-h-i-right'>
                                    <div className='message-profile-actions-block'>
                                        <div className='m-p-a-b-left'>
                                            <div className='message-profile-info'>
                                                <div className='m-p-i-img'>
                                                    <Image src={'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D'} alt='Profile' width={32} height={32} />
                                                </div>
                                                <div className='m-p-i-details'>
                                                    <Typography variant='h4' className='profile-name'>Patrick Prik</Typography>
                                                    <Typography variant='h4' className='message-to-txt'>{`to: Aneesh Raj; Admin Official <admin@gmail.com>`}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='m-p-a-b-right'>
                                            <div className='msg-head-action-time'>
                                                <div className='msg-action-block'>
                                                    <div className='m-a-b-wrapper'>
                                                        <Typography variant='span' className='time-txt'>Apr 14, 2024 at 8.00 pm GMT+8 </Typography>
                                                        <span className="inbox-badge quotation">Quotation</span>
                                                    </div>
                                                    <div className={`table-options-block ${optionActive && 'active'}`}>
                                                        <ButtonIcon className={'message-option-icon'} onClick={() => setOptionActive(!optionActive)}>
                                                            <MessageOptionsIcon />
                                                        </ButtonIcon>
                                                        <div className='t-o-b-dropdown'>
                                                            <button className='t-o-btn'>
                                                                <OptionReplyIcon />
                                                                <span className='t-o-b-txt'>Reply</span>
                                                            </button>
                                                            <button className='t-o-btn'>
                                                                <OptionForwardIcon />
                                                                <span className='t-o-b-txt'>Forward</span>
                                                            </button>
                                                            <button className='t-o-btn'>
                                                                <OptionEyeIcon />
                                                                <span className='t-o-b-txt'>Mark as Read</span>
                                                            </button>
                                                            <button className='t-o-btn'>
                                                                <OptionDownloadAttachIcon />
                                                                <span className='t-o-b-txt'>Download Attachments</span>
                                                            </button>
                                                            <button className='t-o-btn'>
                                                                <OptionReportIcon />
                                                                <span className='t-o-b-txt'>Report</span>
                                                            </button>
                                                            <button className='t-o-btn'>
                                                                <OptionBlockIcon />
                                                                <span className='t-o-b-txt'>Block</span>
                                                            </button>
                                                            <button className='t-o-btn'>
                                                                <EditIcon />
                                                                <span className='t-o-b-txt'>Delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='m-c-h-message'>
                                <Typography variant='span' className='short-msg-txt'>Hi, I’m looking to place a bulk order for indoor plants. Please provide the best rates, MOQ...</Typography>
                            </div>
                        </div>
                    </>
                }>
                    <div className='m-c-body'>
                        <Typography variant='p' className='message-content'>Hi,
                            I’m looking to place a bulk order for indoor plants. Please provide the best rates, MOQ (minimum order quantity), and lead time.
                            Let me know if there are any volume discounts available.</Typography>
                        <div className='message-attachment-block'>
                            <Typography variant='span' className='m-a-b-title-txt'>2 Attachments</Typography>
                            <div className='m-a-b-items-block'>
                                <div className='m-a-b-i-b-img'>
                                    <Image src={'https://media.istockphoto.com/id/1394440950/photo/natural-view-cosmos-filed-and-sunset-on-garden-background.webp?b=1&s=612x612&w=0&k=20&c=o3n-h2j4aBnaDqKeY-876cTRm1DLOsZcCjcfDZf_9TQ='} width={110} height={80} alt='Attachments'></Image>
                                </div>
                                <div className='m-a-b-i-b-img'>
                                    <Image src={'https://hips.hearstapps.com/hmg-prod/images/cosmos-flowers-against-the-blue-sky-low-angle-royalty-free-image-1720283935.jpg?crop=0.536xw:1.00xh;0.141xw,0&resize=980:*'} width={110} height={80} alt='Attachments'></Image>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isNested &&
                        <div className='nested-message-group'>
                            {Array.from({ length: 5 }).map((_, index) => {
                                return <div className='nested-message-item' key={index}>
                                    <div className='message-card-head'>
                                        <div className='m-c-h-info'>
                                            <div className='m-c-h-i-left'></div>
                                            <div className='m-c-h-i-right'>
                                                <div className='message-profile-actions-block'>
                                                    <div className='m-p-a-b-left'>
                                                        <div className='message-profile-info'>
                                                            <div className='m-p-i-img'>
                                                                <Image src={'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D'} alt='Profile' width={32} height={32} />
                                                            </div>
                                                            <div className='m-p-i-details'>
                                                                <Typography variant='h4' className='profile-name'>Patrick Prik</Typography>
                                                                <Typography variant='h4' className='message-to-txt'>{`to: Aneesh Raj; Admin Official <admin@gmail.com>`}</Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='m-p-a-b-right'>
                                                        <div className='msg-head-action-time'>
                                                            <div className='msg-action-block'>
                                                                <div className='m-a-b-wrapper'>
                                                                    <Typography variant='span' className='time-txt'>Apr 14, 2024 at 8.00 pm GMT+8 </Typography>
                                                                    <span className="inbox-badge quotation">Quotation</span>
                                                                </div>
                                                                <div className={`table-options-block ${optionActive && 'active'}`}>
                                                                    <ButtonIcon className={'message-option-icon'} onClick={() => setOptionActive(!optionActive)}>
                                                                        <MessageOptionsIcon />
                                                                    </ButtonIcon>
                                                                    <div className='t-o-b-dropdown'>
                                                                        <button className='t-o-btn'>
                                                                            <OptionReplyIcon />
                                                                            <span className='t-o-b-txt'>Reply</span>
                                                                        </button>
                                                                        <button className='t-o-btn'>
                                                                            <OptionForwardIcon />
                                                                            <span className='t-o-b-txt'>Forward</span>
                                                                        </button>
                                                                        <button className='t-o-btn'>
                                                                            <OptionEyeIcon />
                                                                            <span className='t-o-b-txt'>Mark as Read</span>
                                                                        </button>
                                                                        <button className='t-o-btn'>
                                                                            <OptionDownloadAttachIcon />
                                                                            <span className='t-o-b-txt'>Download Attachments</span>
                                                                        </button>
                                                                        <button className='t-o-btn'>
                                                                            <OptionReportIcon />
                                                                            <span className='t-o-b-txt'>Report</span>
                                                                        </button>
                                                                        <button className='t-o-btn'>
                                                                            <OptionBlockIcon />
                                                                            <span className='t-o-b-txt'>Block</span>
                                                                        </button>
                                                                        <button className='t-o-btn'>
                                                                            <EditIcon />
                                                                            <span className='t-o-b-txt'>Delete</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='m-c-h-message'>
                                            <Typography variant='span' className='short-msg-txt'>Hi, I’m looking to place a bulk order for indoor plants. Please provide the best rates, MOQ...</Typography>
                                        </div>
                                    </div>
                                    <div className='m-c-body'>
                                        <Typography variant='p' className='message-content'>Hi,
                                            I’m looking to place a bulk order for indoor plants. Please provide the best rates, MOQ (minimum order quantity), and lead time.
                                            Let me know if there are any volume discounts available.</Typography>
                                    </div>
                                </div>
                            })}
                        </div>
                    }
                </AccordionTab >
            </Accordion >
        </>
    )
}

export default MessageCardNested
