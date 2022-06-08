import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import PageNotFound from './components/PageNotFound/PageNotFound';
import LoginForm from './components/LoginForm/LoginForm';
import UserPage from './components/UserPage/UserPage';
import LandingPage from './components/LandingPage/LandingPage';
import { useEffect, useState } from 'react';
import API from './API';
import PlanForm from './components/LandingPage/PlanForm/PlanForm';


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
  const [courses, setCourses] = useState([]);
  const [plan, setPlan] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  useEffect(() => {
      setCoursesLoading(true);
      API.getAllCourses().then(
          courses => {
              setCourses(courses);
              setCoursesLoading(false);
          }
      );
  }, [])


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

  const addCourseToPlan = (course) => {
    setPlan(oldPlan => [...oldPlan, course]);
  }

  const cancelPlan = () => {
    setPlan([]);
  }
 
  return (
    <Routes>
      <Route path="/" element={<LandingPage user={user} courses={courses} plan={plan}/>} >
        <Route path="addPlan" element={!loggedIn ? <Navigate to='/login'/> : <PlanForm plan={plan} courses={courses} addCourseToPlan={addCourseToPlan} cancelPlan={cancelPlan}/>} />
      </Route>
      <Route path="/userPage" element={!loggedIn ? <Navigate to="/login" /> : <UserPage user={user} logout={doLogOut}/>} />
      <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <LoginForm login={doLogIn} />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default App;
