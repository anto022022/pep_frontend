import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';
import React, { useRef } from 'react';

export interface AlertMessageProps {
    showMessage: (msgsRef: React.RefObject<Messages | null>) => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ showMessage }) => {
    const msgs = useRef<Messages>(null);

    useMountEffect(() => {
        if (msgs.current) {
            showMessage(msgs);
        }
    });

    return (
        <div className='alert-message-comp'>
            <Messages ref={msgs} />
        </div>
    );
};

export default AlertMessage;
