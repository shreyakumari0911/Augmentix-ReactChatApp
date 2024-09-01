import React, { useRef, useState } from 'react';
import { Favorite } from '@material-ui/icons';
import './register.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Visibility, VisibilityOff} from '@material-ui/icons';
import { Link } from 'react-router-dom/cjs/react-router-dom';

export default function Register() {
    const username=useRef();
    const email= useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const history=useHistory();
    const [showPassword, setShowPassword] = useState(false);

    const handleClick= async (e)=>{

        e.preventDefault();
        //console.log(password.current.value);
        //console.log(passwordAgain.current.value);
        if(passwordAgain.current.value !== password.current.value){
            
            passwordAgain.current.setCustomValidity("Password don't match");
        }else{
            const user={
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };
            try{
                const res = await axios.post("/auth/register", user);
                history.push("/login");
            }
            catch(err){
                console.log(err);
            }
        }
    }

    return (
        <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">Facebook <Favorite className="loginLogoheart"/></h3>
                <span className="loginDesc"> Connect to your loved ones</span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleClick}>
                <div className="loginInput"><input placeholder="username" ref={username} className='input-password' minLength="3" maxLength="20" required/></div>
                    <div className="loginInput"><input placeholder="email" type="email" className='input-password' ref={email} required/></div>
                    <div className="loginInput"><input placeholder="password" type={showPassword?"text":"password"} className='input-password' ref={password} minLength="6" required/>
                    {showPassword ? <div className='icon-eye' onClick={()=>setShowPassword(false)}><VisibilityOff/></div> : <div className='icon-eye' onClick={()=>setShowPassword(true)}><Visibility/></div>}</div>
                    <div className="loginInput"><input placeholder="Re-type password" type="password" ref={passwordAgain} minLength="6"  className="input-password" required/></div>
                    <button className="loginButton">Sign Up</button>
                    <Link to="/login"><button className="loginRegisterButton"> Log into your Account </button></Link>
                </form>
            </div>
        </div>
            
        </div>
    )
}
