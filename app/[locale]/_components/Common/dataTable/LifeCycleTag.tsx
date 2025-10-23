
import Typography from "@/app/[locale]/_components/Base/Typography";
import { BulkBuyerIcon } from "@/app/[locale]/_components/Icons/SVGIcons";

interface LifeCycleProps {
  lifeCycle:string;
}
export const LifeCycleTags: React.FC<LifeCycleProps> = ({lifeCycle}) => {
        return (
            <>
                {lifeCycle == 'highValueCustomer' ? <Typography variant='span' className='txt-pink colored-txt'>High Value</Typography>
                    :
                    (
                        <>
                            <div className='colored-block'>
                                <BulkBuyerIcon />
                                <Typography variant='span' className='txt-brown colored-txt'>Bulk Buyer</Typography>
                            </div>
                        </>
                    )
                }
            </>
        )
    };