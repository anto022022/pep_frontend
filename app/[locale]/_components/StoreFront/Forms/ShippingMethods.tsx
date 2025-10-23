import { useLocalizedOptions } from '@/app/[locale]/_hooks/useLocalizedOptions';
import { shippingMethodsData } from '@/app/[locale]/_models/StoreFront';
import { FC } from 'react';
export interface shippingInterface {
    value: string[];
    onChange: (value: string) => void;
}
const ShippingMethods: FC<shippingInterface> = ({value, onChange }) => {

    const localizedShippingMethodsData=useLocalizedOptions("salesProduct",shippingMethodsData,"label","label")
    return (
        <>
            <div className='payment-option-group'>
                {localizedShippingMethodsData.map(({ id, label, icon }, index) => (
                    <label className='payment-option-card-comp forms-checkbox' htmlFor={id} key={index}>
                        <div className='p-o-c-c-icon-txt'>
                            {icon}
                            <span className='p-o-c-c-txt'>{label}</span>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                value={id}
                                id={id}
                                checked={value.includes(id)}
                                onChange={() => onChange(id)}
                                tabIndex={-1}
                            />
                            <span className="custom-checkbox"></span>
                        </div>
                    </label>
                ))}
            </div>
        </>
    )
}

export default ShippingMethods