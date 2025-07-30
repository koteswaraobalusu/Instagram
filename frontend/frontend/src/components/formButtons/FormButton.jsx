import React from 'react';
import './formbutton.css'


const FormButton = ({value}) => {
  return (
    <>

        <button type='submit' className='btn'>{value}</button>
      
    </>
  )
}

export default FormButton;
