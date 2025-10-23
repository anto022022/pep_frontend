import { Dialog } from 'primereact/dialog';
import React from 'react';
import Typography from '../Base/Typography';
import Buttons from '../Buttons/Buttons';
import { ActiveIcon } from '../Icons/SVGIcons';

interface AlertDialogProps {
    visible: boolean;
    title?: string;
    subTxt: string;
    cancelOnclick?: () => void;
    continueOnclick: () => void;
    continueLabel?: string;
    cancelLabel?: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
    visible,
    title,
    subTxt,
    cancelOnclick,
    continueOnclick,
    continueLabel = 'Continue',
    cancelLabel = 'Cancel'
}) => {
    return (
        <div>
            <Dialog
                visible={visible}
                modal
                className='modal-comp add-prouct-successfully-modal alert-modal'
                closable={true}
                onHide={cancelOnclick ?? continueOnclick}
                content={() => (
                    <div className='add-prouct-successfully-main'>
                        <div className='a-m-m-top'>
                            <ActiveIcon />
                            <div className='a-p-s-content'>
                                {title && (
                                    <Typography variant='span' className='a-p-s-txt'>
                                        {title}
                                    </Typography>
                                )}
                                <Typography variant='span' className='a-p-s-subtxt'>
                                    {subTxt}
                                </Typography>
                            </div>
                        </div>
                        <div className='a-m-m-bottom'>

                            {cancelOnclick && (
                                <Buttons
                                    className='btn-outline bg-outline-grey btn-c-sm'
                                    text={cancelLabel}
                                    onClick={cancelOnclick}
                                />
                            )}
                            <Buttons
                                className='btn-c-primary btn-c-sm'
                                text={continueLabel}
                                onClick={continueOnclick}
                            />
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default AlertDialog;
