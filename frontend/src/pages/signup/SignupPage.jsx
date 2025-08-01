import React, { use, useEffect, useReducer, useState } from 'react';
import './signuppage.css';
import { Link, useNavigate } from 'react-router-dom';
import FormHeader from '../../components/formHeader/FormHeader';
import FormButton from '../../components/formButtons/FormButton';
import { useUserSignupMutation,useUserSignupOtpVerifyMutation } from '../../api/userAuthenticationApi';




const SignupPage = () => {
  const initialState = {
    username:'',
    email: '',
    password: '',
  }
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_EMAIL':
        return { ...state, username:action.payload,email: action.payload };
      case 'SET_PASSWORD':
        return { ...state, password: action.payload };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  }
  const [formData,dispatch] = useReducer(reducer,initialState);
  const [errors, setErrors] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isActive,setIsActive]=useState(false);
  const [mailsent,setMailSent]=useState("");
  const [otpButton,setOtpButton]=useState(false);
  const[otpVerify,setOtpVerify]=useState("");
  const navigate = useNavigate();
  const[registerUser] = useUserSignupMutation();
  const [validateUserOtp]=useUserSignupOtpVerifyMutation();



  const ValidateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }    
    if(!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) { 
      newErrors.password = 'Password must be at least 8 characters';
    }else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    }else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';   
    }else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';  
    }else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character'; 
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      return true;
    } else {
      console.log('Form has errors:', newErrors);
      return false;
    }
  }  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid=ValidateForm() 
    if (isValid) {
      try{
        const res=await registerUser(formData).unwrap();
        if(res){

          setMailSent(res.msg)
          if(res.msg){
            navigate('/');
            setTimeLeft(5*60); // Set time left to 5 minutes
            setIsActive(true);
            setOtpButton(true);
            setErrors({});
            setOtpVerify("");
            

          }
          

        }
       
      }
      catch(error){
        setErrors(error.data)
      }      
  }
}

const validateOtp = async (e) => {
  e.preventDefault();
  if(otpVerify.length === 6){
    try{
      const res=await validateUserOtp({email:formData.email,otp:otpVerify}).unwrap();
      if(res){
        dispatch({type: 'RESET'});
        setOtpButton(false);
        setTimeLeft(0);
        setIsActive(false);
        setOtpVerify("");
        setMailSent("");
        setErrors({});

        console.log(res);
      }
    }
    
    catch(error){
      setErrors(error.data);
    }
  }else{
    setErrors({otp: 'Otp must be 6 digits long'});
  }
} 

  const formatTime = (seconds) => {
    const minute=Math.floor(seconds/60).toString().padStart(2, '0');
    const second=Math.floor(seconds%60).toString().padStart(2, '0');
    return `${minute}:${second}`;
  }


  return (
    <div className='container'>
         
        <div className="signup">
          

           <FormHeader/>

          <form onSubmit={handleSubmit} className='form'>
            {mailsent && <p className='error-mail'>{mailsent}</p>}

            <div className='form-field'>
              <input type='email' value={formData.email} onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })} autoComplete='off' required/>
              <label htmlFor=''>Email</label>
              {errors.email && <p className='error'>{errors.email}</p>}
            </div>
            

            <div className='form-field'>
              <input type='password' value={formData.password} onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}autoComplete='off' required/>
              <label htmlFor=''>Password</label>
              {errors.password && <p className='error'>{errors.password}</p>}
            </div>
            

            <FormButton value="Sign up" timeLeft={timeLeft} setTimeLeft={setTimeLeft} isActive={isActive} setIsActive={setIsActive}/>

          </form>
          
          <div className='form-field otp-verify' style={otpButton ? {display: 'flex'} : {display: 'none'}}>
              <input type='text'  value={otpVerify} onChange={(e)=>setOtpVerify(e.target.value)} autoComplete='off' required/>
              <label htmlFor=''>Enter your otp:  {formatTime(timeLeft)}</label>
          </div>

          <button type='button' className='btn otp-btn' style={otpButton ? {display: ''} : {display: 'none'}} onClick={validateOtp}>Verify Otp</button>
          
          

          <p className='link-to'>Already have an account? <Link to='/login'>Log in</Link></p>
        </div>
      
    </div>
  )
}

export default SignupPage;
