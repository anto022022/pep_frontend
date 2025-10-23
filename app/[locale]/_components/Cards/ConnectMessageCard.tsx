'use client'
import React from 'react'
import Typography from '../Base/Typography'

import DatePipe from '@/app/[locale]/_components/Pipe/DatePipe'
import Link from 'next/link'

import { LeadItem } from '@/app/[locale]/_interface/ConnectInterface'
import { useTranslations } from 'next-intl'

interface ConnectCardProps{   
    data:LeadItem
}
const ConnectsMessageCard :React.FC<ConnectCardProps>= ({data}) => {
    const t = useTranslations("common");
    return (
        <div className='connects-message-card-comp'>
            <div className='c-m-c-c-head'>
                <div className='c-m-c-c-h-left'>
                    <Typography variant='h4' className='c-m-c-c-title'>{data.requirementDetails}</Typography>
                </div>
                <div className='c-m-c-c-h-right'>
                    <div className='stage-tracker-comp'>
                        <span className='s-t-c-item negotiation'>{data.stage}</span>
                    </div>
                </div>
            </div>
            <div className='c-m-c-c-body'>
                <div className='connects-info-block'>
                    <div className='c-i-b-item'>
                        <div className='c-i-b-i-wrapper'>
                            <Typography variant='span' className='c-i-b-i-w-txt'>{t("stageTracker.inbox")} ({data.threadId?.length||0})</Typography>
                            <Typography variant='span' className='c-i-b-i-w-txt'>{t("stageTracker.logNotes") }({data.logs?.length||0})</Typography>
                        </div>
                    </div>
                    <div className='c-i-b-item'>
                        <Typography variant='span' className='txt-brown colored-txt'>{data.status}</Typography>
                    </div>
                    <div className='c-i-b-item'>
                        <Typography variant='span' className='c-i-b-i-w-light-txt'>{t("stageTracker.lastActive")}:<DatePipe value={data.lastContact} type='shortDate'  /></Typography>
                    </div>
                    <div className='c-i-b-item'>
                        <Link href={`/app/leads/${data._id}`} className={'btn-outline btn-left bg-outline-grey'} >{t("stageTracker.seeDetails")}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConnectsMessageCard