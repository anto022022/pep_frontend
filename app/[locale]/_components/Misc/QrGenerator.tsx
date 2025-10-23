"use client";
import Image from "next/image";
import QRCode from "qrcode";
import React, { useEffect, useState } from "react";

interface ContactInfo {
  contactName: string;
  email: string;
  phoneNo: string;
  companyName: string;
}

interface ContactQRCodeProps {
  contactName: string;
  email: string;
  phoneNo: string;
  companyName: string;
  size?: number;
  className?: string;
}

// Simulate QR code generation (replace with actual qrcode library in your implementation)
const generateQRCodeDataURL = async (
  contact: ContactInfo,
  size: number = 256
): Promise<string> => {
  // In your actual implementation, use this code:
  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.contactName}
ORG:${contact.companyName}
TEL:${contact.phoneNo}
EMAIL:${contact.email}
END:VCARD`;

  return await QRCode.toDataURL(vCard, {
    errorCorrectionLevel: "M",
    type: "image/png",
    margin: 1,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    width: size,
  });
};

const ContactQRCode: React.FC<ContactQRCodeProps> = ({
  contactName,
  email,
  phoneNo,
  companyName,
  size = 256,
}) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const contact: ContactInfo = {
    contactName,
    email,
    phoneNo,
    companyName,
  };

  const generateQRCode = async () => {
    // Don't generate if any required field is empty
    if (!contactName || !email || !phoneNo || !companyName) {
      setError("All contact fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const dataURL = await generateQRCodeDataURL(contact, size);
      setQrCodeDataURL(dataURL);
    } catch (err) {
      setError("Failed to generate QR code");
      console.error("QR Code generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code when contact info changes
  useEffect(() => {
    generateQRCode();
  }, [contactName, email, phoneNo, companyName, size]);

  return (
    <>
      {qrCodeDataURL && !loading && !error && (
        <Image
          src={qrCodeDataURL}
          alt={`QR Code for ${contactName}`}
          width={size}
          height={size}
          className="block"
        />
      )}
    </>
  );
};

export default ContactQRCode;
