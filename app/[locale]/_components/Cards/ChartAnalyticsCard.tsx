import {
  AnalyticsIcon,
  EyeIcon,
  SlipIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import { useTranslations } from "next-intl";
import Typography from "../Base/Typography";
import ThreePartPieChart from "../Common/ThreePartPieChart";

const ChartAnalyticsCard = (analyticsData: {
  impressions: number;
  views: number;
  quotes: number;
}) => {
  const t = useTranslations("rfq.buyingRequest.buyingRequestDetails.analytics");
  return (
    <div className='analytics-card-comp'>
      <div className='a-c-c-head'>
        <div className='a-c-c-h-left'>
          <div className='icon-title-wrapper'>
            <AnalyticsIcon />
            <Typography variant='span' className='i-t-w-title'> {t("title")}</Typography>
          </div>
        </div>
        <div className='a-c-c-h-right'>
          <Select options={[{ name: 'Last 7 Days', value: 'last7Days' }, { name: 'Last 30 Days', value: 'last30Days' }, { name: 'Last 90 Days', value: 'last90Days' }]} placeholder={'Select Range'} value={''} onChange={() => { }}></Select>
        </div>
      </div>
      <div className='a-c-c-body'>
        <div className='graph-block'>
          <ThreePartPieChart
            impressions={analyticsData.impressions || 0}
            views={analyticsData.views || 0}
            quotes={analyticsData.quotes || 0}
          /></div>
      </div>
      <div className='a-c-c-footer'>
        <div className='analytics-option-group'>
          <div className='a-o-g-item'>
            <div className='a-o-g-i-left'>
              <span className='options-dot'></span>
              <SlipIcon />
              <Typography variant='span' className='a-o-g-txt'>{t("impressions")}</Typography>
            </div>
            <div className='a-o-g-i-right'>
              <Typography variant='span' className='a-o-g-txt'>{analyticsData.impressions || 0}</Typography>
            </div>
          </div>
          <div className='a-o-g-item eye-icon'>
            <div className='a-o-g-i-left'>
              <span className='options-dot red'></span>
              <EyeIcon />
              <Typography variant='span' className='a-o-g-txt'>{t("views")}</Typography>
            </div>
            <div className='a-o-g-i-right'>
              <Typography variant='span' className='a-o-g-txt'>{analyticsData.views || 0}</Typography>
            </div>
          </div>
          <div className='a-o-g-item'>
            <div className='a-o-g-i-left'>
              <span className='options-dot black'></span>
              <SlipIcon />
              <Typography variant='span' className='a-o-g-txt'>{t("quotesReceived")}</Typography>
            </div>
            <div className='a-o-g-i-right'>
              <Typography variant='span' className='a-o-g-txt'>{analyticsData.quotes || 0}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartAnalyticsCard;