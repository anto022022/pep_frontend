'use client'
import TextArea from '@/app/[locale]/_components/StoreFront/Forms/TextArea';
import { Dialog } from 'primereact/dialog';
import { FC, useState } from 'react';
import Typography from '../Base/Typography';
import Buttons from '../Buttons/Buttons';
import RatingStar from '../Common/RatingStar';

interface ReviewProps {
    title: string;
    isShow: boolean;
    onClose: () => void;
    productId: string;
    handleSubmit: (rating: number, text: string) => void;
}
const AddReviewDialog: FC<ReviewProps> = ({ title, isShow, onClose, handleSubmit }) => {
   
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);

    return (
        <div>
            <Dialog
                visible={isShow}
                modal
                className='modal-comp add-review-modal'
                closable={true}
                onHide={onClose}
                content={() => (
                    <>
                        <div className='m-c-head title-center'>
                            <Typography variant='h6' className='modal-title'>{title}</Typography>
                        </div>
                        <div className='m-c-body'>
                            <div className='rate-product-block'>
                                <div className='forms-group'>
                                    <label className='f-g-label'>Rate Product</label>
                                    <RatingStar
                                        value={rating}
                                        onChange={(val) => setRating(val)}
                                        cancel={false}
                                        stars={5}
                                        className='add-review'
                                    />
                                </div>
                                <div className='forms-group'>
                                    <label className='f-g-label'>
                                        Add Your Review
                                    </label>
                                    <TextArea placeholder='Enter Text' name='Review' isActive value={text} onChange={(e) => setText(e)} />
                                </div>
                            </div>
                        </div>
                        <div className='m-c-footer'>
                            <Buttons className={'btn-outline bg-outline-grey'} text={'Cancel'} onClick={onClose} />
                            <Buttons className={'btn-c-primary'} text={'Submit'} onClick={() => {
                                if (rating === 0 || text.trim() === "") {
                                    alert("Please enter a rating and comment");
                                    return;
                                }
                                handleSubmit(rating, text);
                            }} />
                        </div>
                    </>
                )}
            >
            </Dialog>

            {/* Modal */}

        </div>
    )
}

export default AddReviewDialog