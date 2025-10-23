'use client'
import { Dialog } from 'primereact/dialog';
import { FC } from 'react';
import { setShowSuccessModel } from '../../_store/reducers/ui_store';
import { RootState, useAppDispatch, useAppSelector } from '../../_store/store';
import Typography from '../Base/Typography';
import { TickIcon } from '../Icons/SVGIcons';

interface successModel{
    text:string;
}

const SuccessModel:FC<successModel> = ({text}) => {

    const dispatch = useAppDispatch();

    const showSuccessModel = useAppSelector((state:RootState) => state.uiData.showSuccessModel)


    return (
        <div>
            <Dialog
                visible={showSuccessModel}
                modal
                className='modal-comp add-prouct-successfully-modal'
                closable={true}
                onHide={() => dispatch(setShowSuccessModel(false))}
                content={() => (
                    <div className='add-prouct-successfully-main'>
                        <TickIcon />
                        <Typography variant='span' className='a-p-s-txt'>
                            {text}
                        </Typography>
                    </div>
                )}
            >
            </Dialog>
        </div>
    )
}

export default SuccessModel
