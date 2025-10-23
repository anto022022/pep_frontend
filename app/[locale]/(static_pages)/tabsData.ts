import { HomeTabItem } from "@/app/[locale]/(static_pages)/_components/TabbedSection";
import convertShape from "@/public/img/static-site/Icons/convertshape-2.svg";
import data from "@/public/img/static-site/Icons/data.svg";
import documentFilter from "@/public/img/static-site/Icons/document-filter.svg";
import exportImage from "@/public/img/static-site/Icons/export.svg";
import eye from "@/public/img/static-site/Icons/eye.svg";
import globalSearch from "@/public/img/static-site/Icons/global-search.svg";
import graph from "@/public/img/static-site/Icons/graph.svg";
import keyboardOpen from "@/public/img/static-site/Icons/keyboard-open.svg";
import magicPen from "@/public/img/static-site/Icons/magicpen.svg";
import receiptDis from "@/public/img/static-site/Icons/receipt-disscount.svg";
import send2 from "@/public/img/static-site/Icons/send-2.svg";
import sendSquare from "@/public/img/static-site/Icons/send-square.svg";
import shieldTick from "@/public/img/static-site/Icons/shield-tick.svg";
import star from "@/public/img/static-site/Icons/star.svg";
import connectOne from "@/public/img/static-site/connect/connect-img-1.png";
import connect2 from "@/public/img/static-site/connect/connect-img-2.png";
import connect3 from "@/public/img/static-site/connect/connect-img-3.png";
import connect4 from "@/public/img/static-site/connect/connect-img-4.png";
import connect5 from "@/public/img/static-site/connect/connect-img-5.png";
import sellOne from "@/public/img/static-site/sell/sell-img-1.png";
import sell2 from "@/public/img/static-site/sell/sell-img-2.png";
import sell3 from "@/public/img/static-site/sell/sell-img-3.png";
import sell4 from "@/public/img/static-site/sell/sell-img-4.png";
import sell5 from "@/public/img/static-site/sell/sell-img-5.png";
import sourceImg from "@/public/img/static-site/source/source-img-1.png";
import source2 from "@/public/img/static-site/source/source-img-2.png";
import source3 from "@/public/img/static-site/source/source-img-3.png";
import source4 from "@/public/img/static-site/source/source-img-4.png";
import source5 from "@/public/img/static-site/source/source-img-5.png";

export const connectTabs: HomeTabItem[] = [
  {
    id: "connect1",
    icon: shieldTick.src,
    title: "connect.tabs.tab1.title",
    description: "connect.tabs.tab1.description",
    image: connectOne.src,
    imageAlt: "Connect image 1",
  },
  {
    id: "connect2",
    icon: star.src,
    title: "connect.tabs.tab2.title",
    description: "connect.tabs.tab2.description",
    image: connect2.src,
    imageAlt: "Connect image 2",
  },
  {
    id: "connect3",
    icon: globalSearch.src,
    title: "connect.tabs.tab3.title",
    description: "connect.tabs.tab3.description",
    image: connect3.src,
    imageAlt: "Connect image 3",
  },
  {
    id: "connect4",
    icon: eye.src,
    title: "connect.tabs.tab4.title",
    description: "connect.tabs.tab4.description",
    image: connect4.src,
    imageAlt: "Connect image 4",
  },
  {
    id: "connect5",
    icon: data.src,
    title: "connect.tabs.tab5.title",
    description: "connect.tabs.tab5.description",
    image: connect5.src,
    imageAlt: "Connect image 5",
  },
];

export const sellTabs: HomeTabItem[] = [
  {
    id: "sell1",
    icon: keyboardOpen.src,
    title: "sell.tabs.tab1.title",
    description: "sell.tabs.tab1.description",
    image: sellOne.src,
    imageAlt: "Sell image 1",
  },
  {
    id: "sell2",
    icon: exportImage.src,
    title: "sell.tabs.tab2.title",
    description: "sell.tabs.tab2.description",
    image: sell2.src,
    imageAlt: "Sell image 2",
  },
  {
    id: "sell3",
    icon: graph.src,
    title: "sell.tabs.tab3.title",
    description: "sell.tabs.tab3.description",
    image: sell3.src,
    imageAlt: "Sell image 3",
  },
  {
    id: "sell4",
    icon: send2.src,
    title: "sell.tabs.tab4.title",
    description: "sell.tabs.tab4.description",
    image: sell4.src,
    imageAlt: "Sell image 4",
  },
  {
    id: "sell5",
    icon: shieldTick.src,
    title: "sell.tabs.tab5.title",
    description: "sell.tabs.tab5.description",
    image: sell5.src,
    imageAlt: "Sell image 5",
  },
];

export const sourceTabs: HomeTabItem[] = [
  {
    id: "source1",
    icon: documentFilter.src,
    title: "source.tabs.tab1.title",
    description: "source.tabs.tab1.description",
    image: sourceImg.src,
    imageAlt: "Source image 1",
  },
  {
    id: "source2",
    icon: sendSquare.src,
    title: "source.tabs.tab2.title",
    description: "source.tabs.tab2.description",
    image: source2.src,
    imageAlt: "Source image 2",
  },
  {
    id: "source3",
    icon: magicPen.src,
    title: "source.tabs.tab3.title",
    description: "source.tabs.tab3.description",
    image: source3.src,
    imageAlt: "Source image 3",
  },
  {
    id: "source4",
    icon: convertShape.src,
    title: "source.tabs.tab4.title",
    description: "source.tabs.tab4.description",
    image: source4.src,
    imageAlt: "Source image 4",
  },
  {
    id: "source5",
    icon: receiptDis.src,
    title: "source.tabs.tab5.title",
    description: "source.tabs.tab5.description",
    image: source5.src,
    imageAlt: "Source image 5",
  },
];
