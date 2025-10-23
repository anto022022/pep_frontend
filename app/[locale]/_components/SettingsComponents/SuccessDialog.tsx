import { Dialog } from "primereact/dialog";
import React from "react";

interface SuccessDialogProps {
  visible: boolean;
  livenessUrl: string;
  onClose?: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  visible,
  livenessUrl,
  onClose,
}) => {
  return (
    <Dialog
      visible={visible}
      modal
      className="modal-comp add-prouct-successfully-modal"
      closable={true}
      onHide={onClose || (() => {})}
      style={{ width: '90vw', maxWidth: '800px' }}
    >
      <div className="kyc-iframe-container">
        <h3>Complete Your KYC Verification</h3>
        <p>Please complete the verification process below:</p>
        
        {livenessUrl ? (
          <iframe
            src={livenessUrl}
            allow="camera; microphone; geolocation"
            style={{
              width: "100%",
              height: "600px",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            title="KYC Verification"
          />
        ) : (
          <div className="error-message">
            <p>Verification URL not available. Please try again.</p>
          </div>
        )}
        
        <div className="kyc-actions">
          <button 
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default SuccessDialog;
