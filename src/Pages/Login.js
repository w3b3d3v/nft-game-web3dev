import React, { useContext, useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useHistory } from 'react-router-dom';
import LoadingIndicator from '../Components/LoadingIndicator';
import bagContext from '../context/Context';
import './Login.css';

const MIN_LENGHT_PASS = 6;

function Login() {
  const {isLoading, setIsLoading} = useContext(bagContext);
  
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const history = useHistory();

  const isValidEmail = (emailAddress) => /\S+@\S+\.\S+/.test(emailAddress);


  const loginSubmit = () => {
    history.push('/dashboard')
    
  };

  useEffect(() => {
    if (isValidEmail(email) && password.length > MIN_LENGHT_PASS) {
      setIsButtonDisable(false);
    } else {
      setIsButtonDisable(true);
    }
  }, [email, password]);

 
  return (

<main>
<div className="login-page">
  <h1>Sign In</h1>
  <div>
    <label htmlFor="email-input">
      <input
        className="email-input"
        type="email"
        placeholder="Email"
        onChange={ ({ target }) => setEmail(target.value) }
      />
    </label>
    <br/>
    <br/>
    <fieldset className="password-container">
      <input
        className="password-input"
        data-testid="password-input"
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        onChange={ ({ target }) => setPassword(target.value) }
      />
      {showPassword ? (<FaEyeSlash 
      className="showpassword"
      onClick={() => setShowPassword(!showPassword)}
      />) : (<FaEye 
      className="showpassword"
      onClick={() => setShowPassword(!showPassword)}
      />)}
      
    </fieldset>
    <br></br>
    <fieldset className='remember-container'>
    <label htmlFor="remember" className='remember-input'>
      <input
        type="checkbox"
        name="remember"
        id="remember"
      />Remember me
    </label>
    <a href='/dashboard'>Forgot password?</a>
    </fieldset>
  <br/>
  {isLoading ? <LoadingIndicator /> : 
  <div class="col-12">
    <button type="button" class="btn btn-primary"
    disabled={ isButtonDisable }
    onClick={ loginSubmit }        
    >Login</button>
  </div>
  }
</div>
</div>
</main>
  );
}

export default Login;
