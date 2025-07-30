import React, { useEffect, useState } from 'react';
import './formbutton.css'


const FormButton = ({value,timeLeft,setTimeLeft}) => {

  const [isActive,setIsActive]=useState(false);

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

  const handleClick = () => {
    setTimeLeft(5*60);
    setIsActive(true);
  }
  

  return (
    <>

        <button type='button' className='btn' onClick={handleClick}>{value}</button>
      
    </>
  )
}

export default FormButton;
