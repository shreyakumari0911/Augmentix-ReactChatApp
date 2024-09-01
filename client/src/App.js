import './App.css';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Profile from './pages/profile/profile';
import Register from './pages/register/register';
import Messenger from './pages/messenger/messenger';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"; // Ensure you're using the correct version of react-router-dom
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  // const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);

  // Ensure localStorage is updated whenever 'user' changes
  useEffect(() => {
    if(localStorage.getItem("user")){
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
      console.log(currentUser,JSON.parse(localStorage.getItem("user")));
    }
  }, [localStorage.getItem("user")]);
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            {currentUser ? <Home user={currentUser} /> : <Register />}
          </Route>
          <Route path="/login">
             <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/messenger">
            {currentUser ?  <Messenger />: <Register/>}
          </Route>
          <Route path="/profile/:username">
          <Profile/>
          </Route>
          <Route path="/video">
            <Home user={currentUser} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
