import React, { useEffect, useState } from 'react';
import './formbutton.css'


const FormButton = ({value,timeLeft,setTimeLeft,isActive,setIsActive}) => {

  

  useEffect(() => {
    let timer=null;
    if(isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }
    else if (timeLeft === 0) {
      setIsActive(false);
    }
    return ()=>clearInterval(timer);
  },[isActive,timeLeft,setTimeLeft]
)


  

  return (
    <>

        <button type='submit' className='btn'>{value}</button>
      
    </>
  )
}

export default FormButton;
