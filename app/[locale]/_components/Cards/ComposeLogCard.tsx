import { useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import CustomButton from "../Buttons/Button";
import ReactionsBar from "../Common/ReactionsBar";
import Attachment from "../form/Attachment";
import { EmojiIcon, TrashIcon } from "../Icons/SVGIcons";
import TextArea from "../StoreFront/Forms/TextArea";

const ComposeLogCard = () => {
  const { handleSubmit, control, reset } = useForm(
    {
      defaultValues: {
        logNote: "",
        attachments: [],
        reactions: [],
      },
    }
  );
  const [isReactionActive, setIsReactionActive] = useState(false);

  const onSubmit = (data: any) => {
    reset();
  };

  return (
    <div className='compose-card-comp'>
      <div className='c-c-c-body'>
        <div className='compose-inputs-block'>
          <Controller
            control={control}
            name="logNote"
            render={({ field }) => (
              <TextArea placeholder={"Enter a log note..."} {...field} isActive={true} />
            )}
          />
        </div>

        <div className='compose-bottom-action-block'>
          <div className='c-b-c-b-left'>
            <CustomButton className={'btn-c-primary'} text={'Log'} onClick={handleSubmit(onSubmit)} />
            <Controller
              control={control}
              name="attachments"
              render={({ field }) => (
                <Attachment onFileSelect={field.onChange} />
              )}
            />
            <div className='emoji-icon-trigger btm-left'>
              <EmojiIcon onClick={() => setIsReactionActive(!isReactionActive)} />

              {isReactionActive && <Controller
                control={control}
                name="reactions"
                render={({ field }) => (
                  <ReactionsBar onReactionsChange={field.onChange} />
                )}
              />}
            </div>
          </div>
          <div className='c-b-c-b-right'>
            {/* <TrashIcon className={'remove-compose'} onClick={reset} /> */}
            <TrashIcon onClick={reset} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeLogCard;
