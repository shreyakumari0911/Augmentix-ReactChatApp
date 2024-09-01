import { createContext, useReducer, useEffect } from 'react';
import AuthReducer from './AuthReducer';

// Check if user is stored in localStorage
const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem('auth-user')) || null, // Load user from localStorage if available
  isFetching: false,
  error: false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Persist user state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auth-user', JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
