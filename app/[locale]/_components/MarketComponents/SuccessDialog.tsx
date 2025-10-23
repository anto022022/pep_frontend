import { Dialog } from 'primereact/dialog';
import React from 'react';
import Typography from '../Base/Typography';
import { TickIcon } from '../Icons/SVGIcons';

interface SuccessDialogProps {
  visible: boolean;
  title: string;
  subTxt: string;
  onHide: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ visible, title, subTxt,onHide }) => {
  return (
    <div>
      <Dialog
        visible={visible}
        modal
        className='modal-comp add-prouct-successfully-modal'
        closable={true}
        onHide={onHide}
        content={() => (
          <div className='add-prouct-successfully-main'>
            <TickIcon />
            <div className='a-p-s-content'>
              <Typography variant='span' className='a-p-s-txt'>{title}</Typography>
              <Typography variant='span' className='a-p-s-subtxt'>{subTxt}</Typography>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default SuccessDialog;