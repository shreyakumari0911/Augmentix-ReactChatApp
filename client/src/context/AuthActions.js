export const LoginStart=(userCredentials)=>({
    type: "LOGIN_START",
});

export const LoginSuccess=(user)=>({
    type: "LOGIN_SUCCESS",
    payload : user
    
});

export const LoginFailure=(error)=>({
    type: "LOGIN_FAILURE",
    payload: error
});

export const Follow=(followingId)=>({
    type: "FOLLOW",
    payload: followingId
});

export const Unfollow=(followingId)=>({
    type: "UNFOLLOW",
    payload: followingId
});

export const Logout = ()=>({
    type: "LOGOUT",
    payload: null
})