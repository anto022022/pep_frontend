import { useState } from 'react';
import Typography from '../Base/Typography';
import { LinkCopyIcon } from '../Icons/SVGIcons';

const CopyLink = ({ textToCopy, copiedText = "Link Copied!", timeout = 5000 }) => {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), timeout);
            })
            .catch(err => {
                console.error("Failed to copy:", err);
            });
    };

    return (
        <div className='link-copy-block' onClick={handleCopy}>
            {!copied &&
                <div className='l-c-b-txt-block'>
                    <LinkCopyIcon />
                    <Typography variant='span' className='l-c-b-txt'>Copy Link</Typography>
                </div>
            }
            {copied && (
                <Typography variant='span' className='l-c-b-copied-txt'>{copiedText}</Typography>
            )}
        </div>
    )
}

export default CopyLink;