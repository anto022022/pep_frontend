// import WhyBusiness from "@/app/[locale]/(public_pages)/categories/(sections)/why-business"
// import Button from "@/app/[locale]/_components/Buttons/Button"
// import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline"
// import BreadCrumbs from "@/app/[locale]/_components/Cards/Marketplace/BreadCrumbs"
// import ProductListingCard from "@/app/[locale]/_components/Cards/ProductsListingCard"
// import SupplierCard from "@/app/[locale]/_components/Cards/SupplierCard"
// import Tabs from "@/app/[locale]/_components/Common/Tabs"
// import CategoryOverview from "@/app/[locale]/_components/MarketComponents/CategoryOverView"
// import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard"
// import SkeletonSupplierCard from "@/app/[locale]/_components/Skeleton/SkeletonSupplierCard"
// import Select from "@/app/[locale]/_components/StoreFront/Forms/Select"
// import { catDetailTabs, categoryBadgeList, sortingList } from "@/app/[locale]/_models/common"
// import { RootState, useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store"
// import { TabPanel, TabView } from "primereact/tabview"
// import { useState } from "react"
// import {
//     setIsFilterSideBarOpen
// } from "../../_store/reducers/ui_store";
// import { FilterIcon } from "@/app/[locale]/_components/Icons/SVGIcons"
// import { breadCrumbsList, supplierFeaturesList } from "@/public/sampleData"
// import Typography from "@/app/[locale]/_components/Base/Typography"
// import CategoryBadge from "@/app/[locale]/_components/MarketComponents/CategoryBadge"
// import SupplierDetails from "@/app/[locale]/_components/Cards/SupplierDetails"
// import ProductList from "@/app/[locale]/_components/MarketComponents/ProductList"
// const [activeIndex, setActiveIndex] = useState(0);
// const [isProductListView, setProductListView] = useState('Grid');
// const dispatch = useAppDispatch();
// const { isFilterSidebarOpen } =
//     useAppSelector((state: RootState) => state.uiData);

// const [selectedSort, setSelectedSort] = useState(sortingList[0]);



// <div className={`page-wrapper ${isFilterSidebarOpen ? 'sidebar-close' : ''}`}>
//     {/* <div className='p-w-sidebar'>
//             <FilterSidebar />
//           </div> */}
//     <div className='p-w-main page-container category-page-main category-detail-page-main'>
//         <BreadCrumbs data={breadCrumbsList} />
//         <div className='section-block-group'>
//             <div className='overview-filter-block'>
//                 <section className='section-block cate-info-tabs-block'>
//                     <div className='s-b-head'>
//                         <div className='s-b-h-left'>
//                             <div className='title-block sub-cat-title-block'>
//                                 <Typography className='cat-title' variant='h1'>Jackets</Typography>
//                                 <Typography className='cat-subtxt' variant='p'>226,978 products available</Typography>
//                             </div>
//                         </div>
//                         <div className='s-b-h-right'>
//                             <CategoryOverview
//                                 marketSize={'$250B'}
//                                 annualGrowth={'15%'}
//                                 avgMargin={'30%-40%'}
//                             />
//                         </div>
//                     </div>
//                     <div className='tabs-block-group'>
//                         <div className='tabs-block'>
//                             <Button className={`btn-outline ${activeIndex == 0 ? 'active' : ''}`} text={'Products'} onClick={() => setActiveIndex(0)} />
//                             <Button className={`btn-outline ${activeIndex == 1 ? 'active' : ''}`} text={'Suppliers'} onClick={() => setActiveIndex(1)} />
//                         </div>
//                         {activeIndex == 0 &&
//                             <Tabs tabsName={catDetailTabs} className='grid-view-switch' setListStatus={setProductListView} />
//                         }
//                     </div>
//                 </section>
//                 <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
//                     <TabPanel className='tab-panel'>
//                         <section className='section-block filter-list-sort-block p-mob-pad'>
//                             <div className='s-b-head'>
//                                 <div className='s-b-h-left filter-list-group'>
//                                     <ButtonIconLeftOutline className={'bg-outline-grey btn-filter-select filter-btn'} onClick={() => dispatch(setIsFilterSideBarOpen(!isFilterSidebarOpen))}>
//                                         <FilterIcon />
//                                     </ButtonIconLeftOutline>
//                                 </div>
//                                 <div className='s-b-h-right'>
//                                     <Tabs tabsName={catDetailTabs} className='grid-view-switch'
//                                         setListStatus={setProductListView}
//                                     />
//                                     <Select options={sortingList} value={selectedSort} onChange={(val) => setSelectedSort(val)} placeholder={'Sort by relevance'} />
//                                 </div>
//                             </div>
//                             {!isLoading ? (<>
//                                 {
//                                     products?.length > 0 ?
//                                         <ProductList hasMore={hasMoreProducts}
//                                         isFetching={isProductFetching}
//                                         products={products}
//                                         isProductListView={isProductListView}/>
//                                         : null
//                                 }
//                             </>) : <>
//                                 <div className='cards-listing-group c-l-g-5 c-l-g-autofill'>
//                                     {Array.from({ length: 5 }).map((_, index) => {
//                                         return <SkeletonProductCard key={index} />
//                                     })}
//                                 </div>
//                             </>}
//                         </section>
//                         <div className='filters-block'>
//                             <Typography className='f-b-title' variant='h5'>Filter by</Typography>
//                             {categoryBadgeList.length > 0 ?
//                                 <div className='category-badge-group'>
//                                     {categoryBadgeList.map((item: any, index: number) => {
//                                         return <CategoryBadge
//                                             name={item.name}
//                                             path={item.path}
//                                             icon={item.icon}
//                                             key={index}
//                                         />
//                                     })}
//                                 </div>
//                                 : null}
//                         </div>
//                         <section className='section-block filter-list-sort-block p-mob-pad'>
//                             {!isLoading ? (<>
//                                 {
//                                     products?.length > 0 ?
//                                         <ProductList hasMore={hasMoreProducts}
//                                         isFetching={isProductFetching}
//                                         products={products}
//                                         isProductListView={isProductListView}/>
//                                         : null
//                                 }
//                             </>) : <>
//                                 <div className='cards-listing-group c-l-g-5 c-l-g-autofill'>
//                                     {Array.from({ length: 5 }).map((_, index) => {
//                                         return <SkeletonProductCard key={index} />
//                                     })}
//                                 </div>
//                             </>}
//                         </section>

//                         <section className='section-block filter-list-sort-block p-mob-pad'>
//                             {!isLoading ? (<>
//                                 {
//                                     trendingProductList?.length > 0 ?
//                                         <div className={`${isProductListView == 'Grid' ? 'cards-listing-group c-l-g-autofill c-l-g-5' : 'list-view-group'}`}>
//                                             {trendingProductList?.map((item, index) => {
//                                                 return <ProductListingCard
//                                                     key={index}
//                                                     product={item}
//                                                     className={`${isProductListView == 'List' ? 'product-listing-card-comp-row' : ''}`}
//                                                 />
//                                             })}

//                                         </div>
//                                         : null
//                                 }
//                             </>) : <>
//                                 <div className='cards-listing-group c-l-g-5 c-l-g-autofill'>
//                                     {Array.from({ length: 5 }).map((_, index) => {
//                                         return <SkeletonProductCard key={index} />
//                                     })}
//                                 </div>
//                             </>}
//                         </section>
//                     </TabPanel>


//                     {/* SuppliersList */}
//                     <TabPanel>
//                         <section className='section-block filter-list-sort-block'>
//                             <div className='s-b-head p-mob-pad'>
//                                 <div className='s-b-h-left filter-list-group'>
//                                     <ButtonIconLeftOutline className={'bg-outline-grey btn-filter-select filter-btn'} onClick={() => dispatch(setIsFiltersidebarOpen(!isFiltersidebarOpen))}>
//                                         <FilterIcon />
//                                     </ButtonIconLeftOutline>
//                                 </div>
//                                 <div className='s-b-h-right'>
//                                     <Tabs tabsName={catDetailTabs} className='grid-view-switch'
//                                        setListStatus={setProductListView}
//                                     />
//                                     <Select options={sortingList} value={selectedSort} onChange={(val) => setSelectedSort(val)} placeholder={'Sort by relevance'} />
//                                 </div>
//                             </div>
//                             {isProductListView == 'Grid' && (<>
//                                 {!isLoading ? (<>
//                                     {
//                                         featuredSuppliersList?.length > 0 ?
//                                             <div className='feature-supplier-grid'>
//                                                 {featuredSuppliersList?.map((item, index) => {
//                                                     return <SupplierCard
//                                                         key={index}
//                                                         supplier={item}
//                                                     />
//                                                 })}
//                                             </div>
//                                             : null
//                                     }
//                                 </>) : <>
//                                     <div className='feature-supplier-grid'>
//                                         {Array.from({ length: 4 }).map((_, index) => {
//                                             return <SkeletonSupplierCard key={index} />
//                                         })}
//                                     </div>
//                                 </>}
//                             </>
//                             )
//                             }

//                             {isProductListView == 'List' && (<>
//                                 {!isLoading ? (<>
//                                     {
//                                         supplierDetailsList?.length > 0 ?
//                                             <div className='supplier-details-group'>
//                                                 {supplierDetailsList?.map((item, index) => {
//                                                     return <SupplierDetails
//                                                         key={index}
//                                                         supplier={item}
//                                                         featuresList={supplierFeaturesList}
//                                                     />
//                                                 })}
//                                             </div>
//                                             : null
//                                     }
//                                 </>) : <>
//                                     <div className='feature-supplier-grid'>
//                                         {Array.from({ length: 4 }).map((_, index) => {
//                                             return <SkeletonSupplierCard key={index} />
//                                         })}
//                                     </div>
//                                 </>}
//                             </>
//                             )
//                             }
//                         </section>
//                     </TabPanel>
//                 </TabView>
//             </div>

//             {/* Why Businesses */}
//             <WhyBusiness />
//         </div>
//     </div>
// </div>




