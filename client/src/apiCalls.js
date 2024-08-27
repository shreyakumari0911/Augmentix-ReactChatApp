import axios from "axios";
import { LoginStart, LoginFailure, LoginSuccess, Logout } from "./context/AuthActions";

export const loginCall = async (userCredential, dispatch)=>{
    dispatch(LoginStart(userCredential));
    try{
        const res = await axios.post("/auth/login", userCredential);
        //const token=res.data.token;
        //const _id=res.data._id;
        //const user=res.data.user;
        //localStorage.setItem("token", token);
        //localStorage.setItem("_id", _id);
        //localStorage.setItem("user", JSON.stringify(user));
        console.log(res.data.user);
        dispatch(LoginSuccess(res.data));
    }catch(err){
        dispatch(LoginFailure(err));
    }
};
export const logoutCall = async  (userCredential, dispatch)=>{
    localStorage.clear();
    dispatch(Logout(userCredential));
}   