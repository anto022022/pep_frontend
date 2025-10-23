'use client'
import React from 'react'
import Typography from '../Base/Typography'
import Buttons from '../Buttons/Buttons'
import { useTranslations } from 'next-intl'

const ConnectsMessageCard = () => {
    const t = useTranslations("common");
    return (
        <div className='connects-message-card-comp'>
            <div className='c-m-c-c-head'>
                <div className='c-m-c-c-h-left'>
                    <Typography variant='h4' className='c-m-c-c-title'>{t("stageTracker.title")}</Typography>
                </div>
                <div className='c-m-c-c-h-right'>
                    <div className='stage-tracker-comp'>
                        <span className='s-t-c-item negotiation'>{t("stageTracker.negotiation")}</span>
                    </div>
                </div>
            </div>
            <div className='c-m-c-c-body'>
                <div className='connects-info-block'>
                    <div className='c-i-b-item'>
                        <div className='c-i-b-i-wrapper'>
                            <Typography variant='span' className='c-i-b-i-w-txt'>{t("stageTracker.inbox")} (20)</Typography>
                            <Typography variant='span' className='c-i-b-i-w-txt'>{t("stageTracker.logNotes")} (10)</Typography>
                        </div>
                    </div>
                    <div className='c-i-b-item'>
                        <Typography variant='span' className='txt-brown colored-txt'>{t("stageTracker.bulkOrder")}</Typography>
                    </div>
                    <div className='c-i-b-item'>
                        <Typography variant='span' className='c-i-b-i-w-light-txt'>{t("stageTracker.lastActive")}: Apr 14, 2024</Typography>
                    </div>
                    <div className='c-i-b-item'>
                        <Buttons className={'btn-outline btn-left bg-outline-grey'} text={t("stageTracker.seeDetails")} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConnectsMessageCard