const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            console.log("login dispatch", action);
            return {
                user: action.payload,
                isFetching: false, // Updated to false since login is successful
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                  user: null,
                  isFetching: false,
                  error: false,
            };
        case "FOLLOW":
            console.log("AuthReducer follow",state, action);
            if (!state.user) return state; // Check if user is null
            console.log("Current state:", state);
            console.log("Action payload:", action);
            return {
                ...state,
                user: {
                    ...state.user,
                    following: [...(state.user.following || []), action.payload], // Ensure following is an array
                },
            };
        case "UNFOLLOW":
            console.log("AuthReducer Unfollow",state, action);
            if (!state.user) return state; // Check if user is null
            return {
                ...state,
                user: {
                    ...state.user,
                    following: (state.user.following || []).filter(
                        (followin) => followin !== action.payload
                    ),
                },
            };
        default:
            return state;
    }
};

export default AuthReducer;
