import React, { useEffect, useState } from 'react';
import './signuppage.css';
import { Link } from 'react-router-dom';
import FormHeader from '../../components/formHeader/FormHeader';
import FormButton from '../../components/formButtons/FormButton';




const SignupPage = () => {

  const [timeLeft, setTimeLeft] = useState(0); 

  const formatTime = (seconds) => {
    const minute=Math.floor(seconds/60).toString().padStart(2, '0');
    const second=Math.floor(seconds%60).toString().padStart(2, '0');
    return `${minute}:${second}`;
  }


  return (
    <div className='container'>
         
        <div className="signup">

           <FormHeader/>

          <form className='form'>

            <div className='form-field'>
              <input type='email' autoComplete='off' required/>
              <label htmlFor=''>Email</label>
            </div>

            <div className='form-field'>
              <input type='password' autoComplete='off' required/>
              <label htmlFor=''>Password</label>
            </div>

            <FormButton value="Sign up" timeLeft={timeLeft} setTimeLeft={setTimeLeft}/>

            <div className='form-field otp-verify'>
              <input type='text' autoComplete='off' required/>
              <label htmlFor=''>Enter your otp:{formatTime(timeLeft)}</label>
            </div>

          </form>

          

          <p>Already have an account? <Link to='/login'>Log in</Link></p>
        </div>
      
    </div>
  )
}

export default SignupPage
