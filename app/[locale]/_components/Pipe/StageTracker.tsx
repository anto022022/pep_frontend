import React from 'react'
import { LeadStage } from '../../_interface/LeadsInterface'
import { useTranslations } from 'next-intl'

const StageTracker = ({ activeStage }: { activeStage: LeadStage }) => {
    const t = useTranslations("common");
    return (
        <div className='stage-tracker-comp'>
            <span className={`s-t-c-item ${activeStage === LeadStage.NEW_INQUIRY ? 'new' : ''}`}>{t("stageTracker.new")}</span>
            <span className={`s-t-c-item ${activeStage === LeadStage.CONTACTED_QUOTED ? 'quote' : ''}`}>{t("stageTracker.quote")}</span>
            <span className={`s-t-c-item ${activeStage === LeadStage.NEGOTIATION ? 'negotiation' : ''}`}>{t("stageTracker.negotiation")}</span>
            <span className={`s-t-c-item ${activeStage === LeadStage.DEAL_WON ? 'won' : ''}`}>{t("stageTracker.won")}</span>
            <span className={`s-t-c-item ${activeStage === LeadStage.DEAL_LOST ? 'lost' : ''}`}>{t("stageTracker.lost")}</span>
        </div>
    )
}

export default StageTracker