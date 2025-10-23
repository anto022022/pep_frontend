'use client'
import Image from 'next/image'
import EmptyQuotes from '../../../../assets/img/empty-quotes.svg'
import verifiedImg from '../../../../assets/img/true-verified.png'
import Typography from '../Base/Typography'
import ButtonIcon from '../Buttons/ButtonIcon'
import ButtonIconLeftOutline from '../Buttons/ButtonIconLeftOutline'
import Buttons from '../Buttons/Buttons'
import { ArrowSwapIcon, SendMessageIcon } from '../Icons/SVGIcons'
// import { setIsQuotationDetailsidebarOpen } from '@/lib/features/ui/uiSlice'

const SupplierQuoteCard = ({ data }: { data: any }) => {

    return (
        <div className='supplier-quote-card-comp'>
            {data.length > 0 ? <>
                <div className='s-q-c-c-head'>
                    <div className='s-q-c-c-h-item'>
                        <Typography variant='span' className='s-q-c-c-h-i-txt'>Seller Details</Typography>
                        <ButtonIcon className={'icon-only'}>
                            <ArrowSwapIcon />
                        </ButtonIcon>
                    </div>
                    <div className='s-q-c-c-h-item'>
                        <Typography variant='span' className='s-q-c-c-h-i-txt'>Action</Typography>
                    </div>
                </div>
                <div className='s-q-c-c-body'>
                    {data.map((item, index) => {
                        return <div className='s-q-c-c-b-item' key={index}>
                            <div className='seller-details-block'>
                                <div className='s-d-b-left'>
                                    <div className='company-info'>
                                        <div className='c-i-img'>
                                            <Image src={item.img} width={48} height={48} sizes='100vw' alt={item.name}></Image>
                                        </div>
                                        <div className='c-i-details'>
                                            <div className='name-badge-wrapper'>
                                                <span className='c-i-d-title'>{item.name}</span>
                                                {item.isNew &&
                                                    <span className='badge-comp badge-red b-c-xs'>New</span>
                                                }
                                            </div>
                                            {item?.features.length > 0 &&
                                                <div className='c-i-d-features-list'>
                                                    {item?.features.map((featuresItem, index) => {
                                                        return <div className='c-i-d-l-item' key={index}>
                                                            <Typography variant='span' className='c-i-d-f-l-txt'>{featuresItem.name}</Typography>
                                                            <Typography variant='span' className='c-i-d-f-l-dot'>•</Typography>
                                                        </div>
                                                    })}
                                                </div>
                                            }
                                            <div className='company-meta-badge'>
                                                <div className='c-m-b-item'>
                                                    <Image src={verifiedImg} width={78} height={15} alt='Verified' sizes='100vw' className='img-contain'></Image>
                                                </div>
                                                <div className='c-m-b-item'>
                                                    <Image src={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1280px-Flag_of_the_People%27s_Republic_of_China.svg.png'} width={19} height={12} alt={'CH'} sizes='100vw'></Image>
                                                    <span className='c-m-b-i-country'>CH</span>
                                                </div>
                                                <div className='c-m-b-item'>
                                                    <span className='c-m-b-i-txt'>6 yrs</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='s-d-b-right'>
                                    <div className='button-group-block'>
                                        <ButtonIconLeftOutline className={'send-msg'} name={'Send Message'}>
                                            <SendMessageIcon />
                                        </ButtonIconLeftOutline>
                                        <Buttons className={'btn-outline bg-outline-dark'} text={'See Quote'} onClick={() => { }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </>
                :
                <>
                    <div className='waiting-qoutes-block'>
                        <Image src={EmptyQuotes} alt='Empty' width={100} height={100} sizes='100vw' className='w-q-b-img'></Image>
                        <Typography variant='span' className='w-q-b-title'>Waiting for Supplier Quotes</Typography>
                        <Typography variant='span' className='w-q-b-subtxt'>Your request has been sent to matched suppliers. Once they <br /> respond with their quotations, they’ll appear here.</Typography>
                    </div>
                </>
            }


        </div>
    )
}

export default SupplierQuoteCard