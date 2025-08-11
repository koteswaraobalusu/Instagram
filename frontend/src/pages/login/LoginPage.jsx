import React, { useReducer } from 'react'
import './loginpage.css';
import FormHeader from '../../components/formHeader/FormHeader';
import FormButton from '../../components/formButtons/FormButton';
import { Link, useNavigate } from 'react-router-dom';
import { useUserLoginMutation } from '../../api/userAuthenticationApi';




const LoginPage = () => {
  const initialState={
    email:'',
    password:'' 
  }

  const reducer=(state,action)=>{
    switch(action.type){
      case 'SET_EMAIL':
        return {...state,email:action.payload};
      case 'SET_PASSWORD':
        return {...state,password:action.payload};
        case 'RESET':
          return initialState;
        default:
          return state;

    }
  }
  const [formData,dispatch]=useReducer(reducer,initialState);
  const [errors,setErrors] = React.useState({});
  const navigate = useNavigate();
  const [loginUser] = useUserLoginMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData).unwrap();
      if (res) {
        console.log(res)
        navigate('/'); // Redirect to home page on successful login
        // Navigate to home or dashboard page
      }
    } catch (error) {
      setErrors(error.data || {});
    }
  }
  return (
    <div className='container'>
         
        <div className="login">

           <FormHeader/>

          <form onSubmit={handleSubmit} className='form'>
            {errors && errors.password && <p className='error-mail'>{errors.password}</p>}

            <div className='form-field'>
              <input type='email' value={FormData.email} onChange={(e)=>dispatch({type:'SET_EMAIL',payload:e.target.value})} required/>
              <label htmlFor=''>Email</label>
            </div>

            <div className='form-field'>
              <input type='password' value={FormData.password} onChange={(e)=>dispatch({type:'SET_PASSWORD',payload:e.target.value})}required/>
              <label htmlFor=''>Password</label>
            </div>

            <FormButton value="Log in"/>
          </form>

          <p className='link-to'>Don't have an account? <Link to='/signup'>Sign up</Link></p>
        </div>
      
    </div>
  )
}

export default LoginPage
