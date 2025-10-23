'use client'
import Typography from '@/components/Base/Typography'
import Buttons from '@/components/Buttons/Buttons'
import ProductDetailGallerySlider from '@/components/Carousel/ProductDetailGallerySlider'
import ReusableSwiper from '@/components/Carousel/ReusableSwiper'
import RatingStar from '@/components/Common/RatingStar'
import ResponsiveNavbar from '@/components/Common/ResponsiveNavbar'
import Select from '@/components/Forms/Select'
import { MoneyIcon, TimerStartIcon, TruckTickIcon, ViewAllRightIcon } from '@/components/Icons/SVGIcons'
import BreadCrumbs from '@/components/MarketPlaceComponents/BreadCrumbs'
import MainAccordion from '@/components/MarketPlaceComponents/ProductDetailAccordion/MainAccordion'
import ProductDetailCard from '@/components/MarketPlaceComponents/ProductDetailCard'
import ProductListingCard from '@/components/MarketPlaceComponents/ProductListingCard'
import AddReviewDialog from '@/components/Overlay/AddReviewDialog'
import AllReviewsSidebar from '@/components/Overlay/AllReviewsSidebar'
import SelectVariantsSidebar from '@/components/Overlay/SelectVariantsSidebar'
import SkeletonProductCard from '@/components/Skeleton/SkeletonProductCard'
import useIsMobile from '@/hooks/useIsMobile'
import { setAddReviewDialog, setIsAllReviewssidebarOpen } from '@/lib/features/ui/uiSlice'
import { breadCrumbsList, ratingList, reviewList, sortingList, trendingProductList } from '@/sampleData'
import Image from 'next/image'
import Link from 'next/link'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { TabPanel, TabView } from 'primereact/tabview'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import companyProfile from '../../../../../../../../public/img/company-profile-product.png'
import countryImg from '../../../../../../../../public/img/countryFlag/india.png'
import verifiedBadge from '../../../../../../../../public/img/true-verified-badge.svg'
import verifyImg from '../../../../../../../../public/img/true-verified.png'
import trusted1 from '../../../../../../../../public/img/trusted-1.png'
import trusted2 from '../../../../../../../../public/img/trusted-2.png'
import trusted4 from '../../../../../../../../public/img/trusted-4.png'


const page = () => {

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const [activeIndex, setActiveIndex] = useState(0);

    const [activeReviewFilter, setReviewFilter] = useState(0);

    const isMobile = useIsMobile();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [])

    return (
        <>
            <div className='p-l-m-top'>
                <ResponsiveNavbar mobileTitle={''} mobilePath={''} />
                <div className='p-l-m-t-body'>
                    <div className='page-wrapper'>
                        <div className='p-w-main page-container product-detail-main'>
                            <BreadCrumbs data={breadCrumbsList} />
                            <div className='section-block-group s-b-g-split'>
                                <div className='s-b-g-left'>

                                    {/* GallerySlider */}
                                    <section className='section-block'>
                                        <ProductDetailGallerySlider />
                                    </section>

                                    {/* Similar Products */}
                                    {!isMobile && (<>
                                        <section className='section-block product-list-block'>
                                            <div className='s-b-head p-mob-pad'>
                                                <div className='s-b-h-left'>
                                                    <div className='title-block'>
                                                        <Typography className='cat-title cat-title-sm' variant='h4'>Similar Products</Typography>
                                                    </div>
                                                </div>
                                            </div>
                                            {!isLoading ? (<>
                                                <ReusableSwiper
                                                    slides={trendingProductList}
                                                    slidesPerView={'auto'}
                                                    spaceBetween={10}
                                                    slidesOffsetAfter={0}
                                                    loop={false}
                                                    freeMode={true}
                                                    navigation={false}
                                                    pagination={false}
                                                    paginationClass='r-s-pagination'
                                                    className='reusable-swiper card-max-width'
                                                    renderItem={(item, index) => (
                                                        <ProductListingCard
                                                            key={index}
                                                            ProductImageData={item.productImageData}
                                                            productName={item.productName}
                                                            productPrice={item.productPrice}
                                                            minOrder={item.minOrder}
                                                            deliveryDate={item.deliveryDate}
                                                            companyName={item.companyName}
                                                            countryImg={item.countryImg}
                                                            countryName={item.countryName}
                                                            years={item.years}
                                                            verifyImg={item.verifyImg}
                                                            badgeTheme={item.badgeTheme}
                                                            badgeText={item.badgeText}
                                                        />
                                                    )}
                                                />
                                            </>)
                                                :
                                                (
                                                    <>
                                                        <div className='skel-cards-max-width'>
                                                            {Array.from({ length: 5 }).map((_, index) => {
                                                                return <SkeletonProductCard key={index} />
                                                            })}
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </section>
                                    </>)
                                    }

                                    {isMobile &&
                                        <div className='product-detail-mob'>
                                            <ProductDetailCard />
                                        </div>
                                    }

                                    {/* Tabs & Accordion */}
                                    <section className='section-block section-margin-minus'>
                                        <div className='tabs-accordion-block'>
                                            <div className='detail-navs-block'>
                                                <Link href={'#description'}>Description</Link>
                                                <Link href={'#specifications'}>Specifications</Link>
                                                <Link href={'#applications'}>Applications</Link>
                                                <Link href={'#tradeDetail'}>Trade Details</Link>
                                                <Link href={'#paymentTerms'}>Payment Terms</Link>
                                                <Link href={'#shippingLogistics'}>Shipping and Logistics</Link>
                                            </div>
                                            <div className='detail-box-wrapper description-box' id='description'>
                                                <Typography variant='h4' className='d-b-w-title'> Description</Typography>
                                                <Typography variant='p' className='d-b-txt'> This stylish leather jacket combines durability with a sleek design, perfect for any occasion. Its premium quality ensures comfort while making a bold fashion statement</Typography>
                                                <Buttons text={'Show more'} className={'btn-plain-txt'}></Buttons>
                                            </div>
                                            <MainAccordion />
                                            <div className='detail-box-wrapper company-profile-box'>
                                                <Typography variant='h5' className='d-b-w-title'> Company Profile </Typography>
                                                <div className='company-profile-block-box'>
                                                    <div className='company-info'>
                                                        <div className='c-i-img'>
                                                            <Image src={companyProfile} width={120} height={74} sizes='100vw' alt={'Rabiya Garments, Ludhiana, Punjab'}></Image>
                                                        </div>
                                                        <div className='c-i-details'>
                                                            <span className='c-i-d-title'>Rabiya Garments, Ludhiana, Punjab</span>
                                                            <div className='company-meta-badge'>
                                                                <div className='c-m-b-item'>
                                                                    <Image src={verifyImg} width={78} height={15} alt='Verified' sizes='100vw' className='img-contain'></Image>
                                                                </div>
                                                                <div className='c-m-b-item'>
                                                                    <Image src={countryImg} width={19} height={12} alt={'Chandigarh, India'} sizes='100vw'></Image>
                                                                    <span className='c-m-b-i-country txt-lght-grey-2'>Chandigarh, India</span>
                                                                </div>
                                                                <div className='c-m-b-item'>
                                                                    <span className='c-m-b-i-txt txt-lght-grey-2'>{'6 yrs'}</span>
                                                                </div>
                                                            </div>
                                                            <div className='c-i-category-block'>
                                                                <Typography variant='span' className='c-i-c-b-txt'>Apparel</Typography>
                                                                <Typography variant='span' className='c-i-c-b-txt'>•</Typography>
                                                                <Typography variant='span' className='c-i-c-b-txt'>Manufacturer </Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='company-features'>
                                                        <div className='c-f-item'>
                                                            <Typography variant='span' className='c-f-i-label'>Engagement Rate</Typography>
                                                            <Typography variant='h3' className='c-f-i-value'>96%</Typography>
                                                            <TruckTickIcon />
                                                        </div>
                                                        <div className='c-f-item'>
                                                            <Typography variant='span' className='c-f-i-label'>Response time</Typography>
                                                            <Typography variant='h3' className='c-f-i-value'>{'<6h'}</Typography>
                                                            <TimerStartIcon />
                                                        </div>
                                                        <div className='c-f-item'>
                                                            <Typography variant='span' className='c-f-i-label'>Turnover</Typography>
                                                            <Typography variant='h3' className='c-f-i-value'>$385k</Typography>
                                                            <MoneyIcon />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='feature-details-group'>
                                                    <div className='feature-details'>
                                                        <Typography variant='h5' className='f-d-title'>Factory details</Typography>
                                                        <div className='f-d-group'>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-title'>Factory Size</Typography>
                                                                <Typography variant='span' className='f-d-g-i-value'>1000–5000 sqm</Typography>
                                                            </div>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-title'>Contract Manufacturing</Typography>
                                                                <Typography variant='span' className='f-d-g-i-value'>OEM Service</Typography>
                                                            </div>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-title'>No. of QC Staff</Typography>
                                                                <Typography variant='span' className='f-d-g-i-value'>250-300</Typography>
                                                            </div>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-title'>No. of R&D Staff</Typography>
                                                                <Typography variant='span' className='f-d-g-i-value'>250-300</Typography>
                                                            </div>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-title'>No. of Production Lines</Typography>
                                                                <Typography variant='span' className='f-d-g-i-value'>5</Typography>
                                                            </div>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-title'>Annual Production Capacity</Typography>
                                                                <Typography variant='span' className='f-d-g-i-value'>1000 piece</Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='feature-details main-markets'>
                                                        <Typography variant='h5' className='f-d-title'>Main Markets</Typography>
                                                        <div className='f-d-group'>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-value'>South Asia</Typography>
                                                            </div>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-value'>China</Typography>
                                                            </div>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-value'>USA</Typography>
                                                            </div>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-value'>India</Typography>
                                                            </div>
                                                            <div className='f-d-g-item'>
                                                                <Typography variant='span' className='f-d-g-i-value'>South Africa</Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='feature-details quality-certify-box'>
                                                        <Typography variant='h5' className='f-d-title'>Quality & Certification</Typography>
                                                        <div className='quality-certify-group'>
                                                            <div className='q-c-g-item'>
                                                                <div className='q-c-g-i-img'>
                                                                    <Image src={trusted4} width={77} height={48} alt='ISO'></Image>
                                                                </div>
                                                                <Typography variant='span' className='q-c-g-i-txt'>ISO-9100-2004</Typography>
                                                            </div>
                                                            <div className='q-c-g-item'>
                                                                <div className='q-c-g-i-img'>
                                                                    <Image src={trusted1} width={77} height={48} alt='CE'></Image>
                                                                </div>
                                                                <Typography variant='span' className='q-c-g-i-txt'>CE</Typography>
                                                            </div>
                                                            <div className='q-c-g-item'>
                                                                <div className='q-c-g-i-img'>
                                                                    <Image src={trusted2} width={77} height={48} alt='GMP'></Image>
                                                                </div>
                                                                <Typography variant='span' className='q-c-g-i-txt'>GMP</Typography>
                                                            </div>
                                                        </div>
                                                        <div className='button-group-block btn-max-content'>
                                                            <Buttons className={'btn-c-primary'} text={'View profile'} />
                                                            <Buttons className={'btn-outline bg-outline-dark'} text={'Send Message'} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reviews */}
                                            <div className='detail-box-wrapper reviews-box'>
                                                <div className='r-b-head'>
                                                    <div className='r-b-h-left'>
                                                        <Typography variant='h6' className='d-b-w-title'>Customer Feedback</Typography>
                                                    </div>
                                                    <div className='r-b-h-right'>
                                                        <Buttons className={'btn-outline bg-outline-dark'} text={'Endorse'} />
                                                        <Buttons className={'btn-c-primary'} text={'Add Review'} onClick={() => dispatch(setAddReviewDialog(true))} />
                                                    </div>
                                                </div>
                                                <div className='reviews-comp'>
                                                    <div className='tabs-block-group'>
                                                        <div className='tabs-block'>
                                                            <Buttons className={`btn-outline ${activeIndex == 0 ? 'active' : ''}`} text={'All'} onClick={() => setActiveIndex(0)} />
                                                            <Buttons className={`btn-outline ${activeIndex == 1 ? 'active' : ''}`} text={' Reviews'} onClick={() => setActiveIndex(1)} />
                                                            <Buttons className={`btn-outline ${activeIndex == 2 ? 'active' : ''}`} text={'Endorsements'} onClick={() => setActiveIndex(2)} />
                                                        </div>
                                                        <Typography variant='span' className='r-c-helper-txt'>Real feedback from buyers who trust this business and its products.</Typography>
                                                    </div>
                                                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className='r-c-tabview'>
                                                        <TabPanel className='tab-panel'>
                                                            <div className='overall-rating-list-block'>
                                                                <div className='overall-rating-filters-block'>
                                                                    <div className='overall-rating-block'>
                                                                        <Typography variant='h5' className='o-r-b-txt'>4.0</Typography>
                                                                        <div className='star-rating-global'>
                                                                            <div className='star-statis'>
                                                                                <RatingStar value={4} readOnly />
                                                                                <Typography variant='span' className='statis-txt'>Satisfied</Typography>
                                                                            </div>
                                                                            <Typography variant='span' className='global-rating-txt'>2,691 global ratings</Typography>
                                                                        </div>
                                                                    </div>
                                                                    <div className='reviews-filters'>
                                                                        <div className='r-f-left'>
                                                                            <div className='filters-list-group'>
                                                                                <span className={`badge-comp ${activeReviewFilter == 0 ? 'active' : ''}`} onClick={() => setReviewFilter(0)}>All</span>
                                                                                <span className={`badge-comp ${activeReviewFilter == 1 ? 'active' : ''}`} onClick={() => setReviewFilter(1)}>With photos/videos (1)</span>
                                                                            </div>
                                                                            <Select options={ratingList} placeholder={'Ratings'} panelClassName={'custom-dropdown'} className={'rounded-select'} />
                                                                        </div>
                                                                        <div className='r-f-right'>
                                                                            <Select options={sortingList} placeholder={'Sort By'} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {!isMobile ? (<>
                                                                    {reviewList.length > 0 &&
                                                                        <div className='reviews-list-group'>
                                                                            {reviewList.map((item, index) => {
                                                                                return <div className='reviews-item' key={index}>
                                                                                    <div className='r-i-header'>
                                                                                        <div className='r-i-h-left'>
                                                                                            <div className='review-profile-info-block'>
                                                                                                <div className='r-p-i-b-img'>
                                                                                                    <Typography variant='span' className='r-p-i-b-i-txt'>{item.nameShort}</Typography>
                                                                                                </div>
                                                                                                <div className='r-p-i-b-details'>
                                                                                                    <Typography variant='span' className='r-p-i-b-d-name'>{item.name}</Typography>
                                                                                                    <Image src={item.verfiedBadge} alt='Verified Purchase' width={127} height={20}></Image>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='r-i-h-right'>
                                                                                            <Typography variant='span' className='r-p-i-date'>{item.date}</Typography>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='r-i-body'>
                                                                                        <div className='rating-review-content'>
                                                                                            <RatingStar value={item.ratingValue} readOnly />
                                                                                            <Typography variant='p' className='r-r-c-txt'>{item.message}</Typography>
                                                                                        </div>
                                                                                        <div className='help-report-group'>
                                                                                            <Select options={ratingList} placeholder={'Help'} panelClassName={'custom-dropdown'} className={'rounded-select'} />
                                                                                            <Select options={ratingList} placeholder={'Report'} panelClassName={'custom-dropdown'} className={'rounded-select'} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            })}
                                                                        </div>
                                                                    }
                                                                </>)
                                                                    :
                                                                    (<>
                                                                        {reviewList.length > 0 &&
                                                                            <div className='reviews-list-group'>
                                                                                {reviewList.slice(0, 1).map((item, index) => {
                                                                                    return <div className='reviews-item' key={index}>
                                                                                        <div className='r-i-header'>
                                                                                            <div className='r-i-h-left'>
                                                                                                <div className='review-profile-info-block'>
                                                                                                    <div className='r-p-i-b-img'>
                                                                                                        <Typography variant='span' className='r-p-i-b-i-txt'>{item.nameShort}</Typography>
                                                                                                    </div>
                                                                                                    <div className='r-p-i-b-details'>
                                                                                                        <Typography variant='span' className='r-p-i-b-d-name'>{item.name}</Typography>
                                                                                                        <Image src={item.verfiedBadge} alt='Verified Purchase' width={127} height={20}></Image>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='r-i-h-right'>
                                                                                                <Typography variant='span' className='r-p-i-date'>{item.date}</Typography>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='r-i-body'>
                                                                                            <div className='rating-review-content'>
                                                                                                <RatingStar value={item.ratingValue} readOnly />
                                                                                                <Typography variant='p' className='r-r-c-txt'>{item.message}</Typography>
                                                                                            </div>
                                                                                            <div className='help-report-group'>
                                                                                                <Select options={ratingList} placeholder={'Help'} panelClassName={'custom-dropdown'} className={'rounded-select'} />
                                                                                                <Select options={ratingList} placeholder={'Report'} panelClassName={'custom-dropdown'} className={'rounded-select'} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                })}
                                                                                <div className='view-all-reviews-btn' onClick={() => dispatch(setIsAllReviewssidebarOpen(true))}>
                                                                                    <span className='v-a-r-b-txt'>View All Reviews</span>
                                                                                    <ViewAllRightIcon />
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </>)
                                                                }

                                                            </div>
                                                        </TabPanel>
                                                        <TabPanel>
                                                            <p>Two</p>
                                                        </TabPanel>
                                                        <TabPanel>
                                                            <p>Three</p>
                                                        </TabPanel>
                                                    </TabView>
                                                </div>
                                            </div>
                                        </div>
                                    </section>



                                    {/* FAQ */}
                                    <section className='section-block faq-block'>
                                        <div className='detail-box-wrapper'>
                                            <Typography variant='h6' className='d-b-w-title'>FAQ</Typography>
                                            <div className='accordion-comp faq-accordion-comp'>
                                                <Accordion activeIndex={0}>
                                                    <AccordionTab header={
                                                        <>
                                                            <div className='faq-title'>
                                                                <Typography variant='span' className='f-t-count'>01</Typography>
                                                                <Typography variant='h6' className='f-t-title'>Who We are</Typography>
                                                            </div>
                                                        </>
                                                    }>
                                                        <p className="m-0">
                                                            We are based in Victoria, Australia. We started our business in 2015 and we sell our products to customers in the United States, the United Kingdom, and some countries in Southeast Asia. There are approximately 30 people in our office.
                                                        </p>
                                                    </AccordionTab>
                                                    <AccordionTab header={
                                                        <>
                                                            <div className='faq-title'>
                                                                <Typography variant='span' className='f-t-count'>02</Typography>
                                                                <Typography variant='h6' className='f-t-title'>How can we guarantee quality?</Typography>
                                                            </div>
                                                        </>
                                                    }>
                                                        <p className="m-0">
                                                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                                            quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                                            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                                                            Consectetur, adipisci velit, sed quia non numquam eius modi.
                                                        </p>
                                                    </AccordionTab>
                                                    <AccordionTab header={
                                                        <>
                                                            <div className='faq-title'>
                                                                <Typography variant='span' className='f-t-count'>03</Typography>
                                                                <Typography variant='h6' className='f-t-title'>Why should you buy from us not from other suppliers?</Typography>
                                                            </div>
                                                        </>
                                                    }>
                                                        <p className="m-0">
                                                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                                            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                                            mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                                            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                                                        </p>
                                                    </AccordionTab>
                                                    <AccordionTab header={
                                                        <>
                                                            <div className='faq-title'>
                                                                <Typography variant='span' className='f-t-count'>04</Typography>
                                                                <Typography variant='h6' className='f-t-title'>What services can we provide?</Typography>
                                                            </div>
                                                        </>
                                                    }>
                                                        <p className="m-0">
                                                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                                            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                                            mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                                            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                                                        </p>
                                                    </AccordionTab>
                                                </Accordion>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                {!isMobile &&
                                    <div className='s-b-g-right'>
                                        <div className='product-detail-card-sticky'>
                                            <ProductDetailCard />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-l-m-footer'>
                    {isMobile && <div className='mob-filter-nav'>
                        <div className='product-detail-footer'>
                            <div className='supplier-info-footer'>
                                <div className='s-i-f-left'>
                                    <Image src={verifiedBadge} width={71} height={17} alt='Verified'></Image>
                                    <Typography variant='h6' className='supplier-name'>Rabiya Garments, Ludhiana...</Typography>
                                </div>
                                <div className='s-i-f-right'>
                                    <Buttons text={'View Details'} className={'btn-plain-txt'}></Buttons>
                                </div>
                            </div>
                            <div className='button-group-block'>
                                <Buttons className={'btn-outline bg-outline-dark'} text={'Chat now'} />
                                <Buttons className={'btn-c-primary'} text={'Contact Supplier'} />
                            </div>
                        </div>
                    </div>}

                </div>
            </div>

            {/* Modals */}
            <AllReviewsSidebar />
            <SelectVariantsSidebar />
            <AddReviewDialog />
        </>
    )
}

export default page