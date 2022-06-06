import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import PageNotFound from './components/PageNotFound/PageNotFound';
import LoginForm from './components/LoginForm/LoginForm';
import UserPage from './components/UserPage/UserPage';
import LandingPage from './components/LandingPage/LandingPage';
import { useEffect, useState } from 'react';
import API from './API';


function App() {
  return (
    <>
      <Router>
        <MainApp />
      </Router>
    </>
  );
}

function MainApp() {

  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
          //GET http://localhost:3001/api/sessions/current
          //[HTTP/1.1 401 Unauthorized]
      }
    };

    checkAuth();
  }, [])

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      }
      )
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    navigate('/');
  }

  return (
    <Routes>
      <Route path='/' element={<LandingPage user={user} />} />
      <Route path='/login' element={<LoginForm login={doLogIn}/>} />
      <Route path='/user' element={<UserPage user={user} logout={doLogOut}/>} />
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  )
}

export default App;
