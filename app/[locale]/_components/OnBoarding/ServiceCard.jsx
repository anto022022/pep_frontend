'use client'

import Image from 'next/image';
import '../../dev_styles.css';
import Typography from '../Base/Typography';

const ServiceCard = ({ htmlFor, icon, title, subtitle, defaultChecked, onChange }) => {

  const checkStyle = title === 'Sell Products' ? "service-card-group-height-align" : "";
  return (
    <label htmlFor={htmlFor} className='service-card-comp check-radio'>
      <div className='icon-input'>
        <Image src={icon} alt='card' width={25} height={25} />
        <input
          type='radio'
          id={htmlFor}
          className='forms-radio'
          name='chooseService'
          checked={defaultChecked}
          onChange={onChange} // Add this line
        />
      </div>
      <div className='s-c-c-txt-wrap'>
        <Typography variant='span' className='title'>{title}</Typography>
        <Typography variant='span' className={`subtitle ${checkStyle}`}>{subtitle}</Typography>
      </div>
    </label>
  )
}

export default ServiceCard
