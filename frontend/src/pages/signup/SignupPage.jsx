import React from 'react';
import './signuppage.css';
import { Link } from 'react-router-dom';
import FormHeader from '../../components/formHeader/FormHeader';
import FormButton from '../../components/formButtons/FormButton';



const SignupPage = () => {
  
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

            <FormButton value="Sign up"/>

            <div className="user-verify">

              <div className='form-field'>
                <input type='text' autoComplete='off' required/>
                <label htmlFor=''>OTP</label>
              </div>
              <FormButton value="User verification"/>
            </div>
          </form>

          

          <p>Already have an account? <Link to='/login'>Log in</Link></p>
        </div>
      
    </div>
  )
}

export default SignupPage
