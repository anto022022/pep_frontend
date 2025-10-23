import { OverlayPanel } from 'primereact/overlaypanel';
import React, { FC, useRef } from 'react'
import ButtonIconLeftOutline from '../Buttons/ButtonIconLeftOutline';
import { PlusIcon } from '../Icons/SVGIcons';

interface OverLaySelector {
    title: string;
    options: any[];
    optionLable?: string;
    onSelect: (value: any) => void;
    footerLable?: string;
    footerFunc?: () => void;
}

const OverLaySelector: FC<OverLaySelector> = ({ title, options, optionLable, onSelect, footerLable, footerFunc }) => {
    const op = useRef<OverlayPanel>(null);

    return (
        <div className='add-option-block'>
            <ButtonIconLeftOutline name={title} className={'bg-outline-grey btn-attributes'} onClick={(e) => op.current?.toggle(e)}>
                <PlusIcon />
            </ButtonIconLeftOutline>

            <OverlayPanel ref={op}  className='a-o-b-overlay' appendTo={"self"}>
                <ul className='a-o-p-ul'>
                    {options.map((opt, index) => (
                        <li
                            key={index}
                            className=""
                            onClick={() => {
                                onSelect(opt)
                                op.current?.hide();
                            }}
                        >
                            {optionLable ? opt[optionLable] ?? opt : opt}
                        </li>
                    ))}
                </ul>
                {
                    footerLable &&
                    <ButtonIconLeftOutline
                        name={footerLable}
                        className={'bg-outline-grey btn-attributes'}
                        onClick={() => {
                            if (footerFunc) footerFunc()
                            op.current?.hide();
                        }}
                    >
                        <PlusIcon />
                    </ButtonIconLeftOutline>
                }
            </OverlayPanel>
        </div>
    )
}

export default OverLaySelector