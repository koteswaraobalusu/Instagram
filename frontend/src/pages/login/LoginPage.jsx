import React from 'react'
import './loginpage.css';
import FormHeader from '../../components/formHeader/FormHeader';
import FormButton from '../../components/formButtons/FormButton';
import { Link } from 'react-router-dom';


const LoginPage = () => {
  return (
    <div className='container'>
         
        <div className="login">

           <FormHeader/>

          <form className='form'>

            <div className='form-field'>
              <input type='email' required/>
              <label htmlFor=''>Email</label>
            </div>

            <div className='form-field'>
              <input type='password' required/>
              <label htmlFor=''>Password</label>
            </div>

            <FormButton value="Log in"/>
          </form>

          <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
        </div>
      
    </div>
  )
}

export default LoginPage
