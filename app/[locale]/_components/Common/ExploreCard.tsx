import Link from 'next/link';
import React, { ReactNode } from 'react';
import Typography from '../Base/Typography';
import { RightArrowIcon } from '../Icons/SVGIcons';

interface ExploreCardInterface {
    title: string;
    subTxt: string;
    linkTxt: string;
    path: string;
    icon: ReactNode;
};

const ExploreCard: React.FC<ExploreCardInterface> = (props) => {
    const { title, subTxt, linkTxt, path, icon } = props;
    return (
        <div className='explore-card-comp'>
            <div className='e-c-c-top'>
                {icon ?? ''}
                <div className='e-c-c-content-wrapper'>
                    <Typography variant='span' className='e-c-c-c-w-title'>{title}</Typography>
                    <Typography variant='span' className='e-c-c-c-w-subtxt'>{subTxt}</Typography>
                </div>
            </div>
            <div className='e-c-c-bottom'>
                {path !== '' && (
                    <Link href={path} className='e-c-c-link'>
                        <Typography className='e-c-c-l-txt' variant='span'>{linkTxt}</Typography>
                        <RightArrowIcon />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default ExploreCard