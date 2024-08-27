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
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(user);

  // Ensure localStorage is updated whenever 'user' changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth-user", JSON.stringify(user));
    }
    setCurrentUser(JSON.parse(localStorage.getItem("auth-user")));
    console.log(user);
  }, [user]);

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            {user ? <Home user={currentUser} /> : <Register />}
          </Route>
          <Route path="/login">
            {user ? <Redirect to="/" /> : <Login />}
          </Route>
          <Route path="/register">
            {user ? <Redirect to="/" /> : <Register />}
          </Route>
          <Route path="/messenger">
            {!user ? <Redirect to="/" /> : <Messenger />}
          </Route>
          <Route path="/profile/:username">
            <Profile user={currentUser}/>
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
