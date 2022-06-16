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
import 'react-toastify/dist/ReactToastify.css';


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
  const [plan, setPlan] = useState(); //used to store the database informations
  const [crediti, setCrediti] = useState();
  const [currentType, setCurrentType] = useState();  //0 full time, 1 part time
  const [currentPlan, setCurrentPlan] = useState([]); //used for the visualization in PlanForm
  const [currentCrediti, setCurrentCrediti] = useState(0); //keep trak of the added courses, if unde the edit, nothing change.
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setCoursesLoading(true);
    API.getAllCourses().then(
      courses => {
        setCourses(courses);
        setCoursesLoading(false);
      }
    );
  }, [dirty]);

  //prendo per la prima volta i dati relativi al piano di studi dopo essere loggato
  useEffect(() => {
    if (loggedIn) {
      API.getPlan().then(
        plan => {
          if (plan.length) {
            setPlan(plan); //if there is a plan saved it could be also empty => []
            setCurrentPlan(plan);
            setCrediti(plan ? plan.map(p => p.crediti).reduce(((accumulator, value) => accumulator + value), 0) : 0);
            setCurrentCrediti(plan ? plan.map(p => p.crediti).reduce(((accumulator, value) => accumulator + value), 0) : 0);
            setCurrentType(user.available);
            setDirty(false);
          } else {
            setPlan(); // = undefinded
            setCurrentPlan([]);
            setCurrentCrediti(0);
            setCrediti(0);
            setCurrentType(null);
            setDirty(false);
          }
        }
      )
    }

  }, [loggedIn, user.available, dirty]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        console.error(err.error);
      }
    };

    checkAuth();
  }, []);



  const doLogIn = async (credentials) => {
    return API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        navigate('/');
      })
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setCrediti(0);
    setPlan();
    setCurrentType();
    setCurrentPlan([]);
    setCurrentCrediti(0);
    setAdd(0);
    setEdit(0);
    navigate('/');
  }

  const addCourseToPlan = (course) => {
    setCurrentPlan(oldPlan => [...oldPlan, course]);
    setCourses(oldCourses => oldCourses.map(c => course.codice === c.codice ? { ...course, tot_studenti: course.tot_studenti + 1 } : c));
    setCurrentCrediti(oldCrediti => oldCrediti + course.crediti);
  }

  const deleteCourseFromPlan = (codice, crediti) => {
    setCurrentPlan(currentPlan.filter(p => p.codice !== codice));
    setCourses(oldCourses => oldCourses.map(course => course.codice === codice ? { ...course, tot_studenti: course.tot_studenti - 1 } : course));
    setCurrentCrediti(oldCrediti => oldCrediti - crediti);
  }

  const cancelCurrentPlan = () => {
    setCurrentPlan(plan ? plan : []);
    setDirty(true); //in the meantime something could change (n-clients problems).
    setCurrentCrediti(crediti);
    navigate('/');
  }

  const navigateToUserPage = () => {
    setCurrentPlan(plan ? plan : []);
    setCurrentCrediti(crediti);
    setAdd(false);
    setEdit(false);
    navigate('/userPage');
    navigate('/');
  }

  const saveCurrentPlan = async (type) => {
    try {
      if (add) {
        await API.addPlan(currentPlan, type);
        setAdd(false);
      } else {
        await API.updateCurrentPlan(currentPlan, type);
        setEdit(false);
      }
      setUser({ ...user, available: type });
      setDirty(true);
      navigate('/');
    } catch (error) {
      console.error(error.error);
      setAdd(false);
      setEdit(false);
      navigate('/');
    }
  }


  const deletePlan = () => {
    API.deletePlan().then(() => {
      setUser({ ...user, available: null });
      setDirty(true);
    }).catch((err) => {
      console.error(err.error);
      setAdd(false);
      setEdit(false);
    });
  }

  return (

    <Routes>
      <Route path="/" element={<LandingPage user={user} courses={courses} currentPlan={currentPlan} plan={plan} crediti={crediti} add={add} setAdd={setAdd} edit={edit} setEdit={setEdit} deletePlan={deletePlan} coursesLoading={coursesLoading} navigateToUserPage={navigateToUserPage}/>} >
        <Route path="editPlan" element={!loggedIn
          ? <Navigate to='/login' />
          : <PlanForm type={user.available} currentPlan={currentPlan} courses={courses} currentType={currentType}
            addCourseToPlan={addCourseToPlan} cancelCurrentPlan={cancelCurrentPlan} deleteCourseFromPlan={deleteCourseFromPlan}
            saveCurrentPlan={saveCurrentPlan} currentCrediti={currentCrediti} add={add} setAdd={setAdd} setEdit={setEdit} />} />
      </Route>
      <Route path="/userPage" element={!loggedIn ? <Navigate to="/login" /> : <UserPage user={user} logout={doLogOut} />} />
      <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <LoginForm login={doLogIn} />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default App;
