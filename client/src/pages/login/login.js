import React, { useContext, useRef, useState } from 'react'
import './login.css';
import { Favorite } from '@material-ui/icons';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import {CircularProgress} from "@material-ui/core";
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { Visibility, VisibilityOff} from '@material-ui/icons';

export default function Login() {
    const email= useRef();
    const password = useRef();
    const {user, isFetching, error, dispatch } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin=(e)=>{
        e.preventDefault();
        loginCall({email: email.current.value, password: password.current.value}, dispatch);
        console.log(user);
    }

    return (
        <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">Facebook <Favorite className="loginLogoheart"/></h3>
                <span className="loginDesc"> Connect to your loved ones</span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleLogin}>
                    <div className='loginInput'>
                        <input placeholder="email" type="email"  className="input-password" ref={email} required/>
                    </div>
                    <div className='loginInput'>
                    <input placeholder="password" type={showPassword? "text" :"password"} className="input-password" ref={password} minLength="6" required/>
                    {showPassword ? <div className='icon-eye' onClick={()=>setShowPassword(false)}><VisibilityOff /></div> : <div className='icon-eye' onClick={()=>setShowPassword(true)}><Visibility/></div>}</div>
                    <button className="loginButton" disabled={isFetching}>{isFetching ? <CircularProgress  size='20px'/> : "Log In"}</button>
                    <span className="loginForgot"> Forgot Password ?</span>
                    <Link to="/"><button className="loginRegisterButton"> {isFetching ? (<CircularProgress  size='20px'/>) :( "Create a New Account")} </button></Link>
                </form>
            </div>
        </div>
            
        </div>
    )
}
