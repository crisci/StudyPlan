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
            setCrediti(plan ? plan.map(p => p.crediti).reduce(((accumulator, value) => accumulator + value), 0) : 0);
            setCurrentType(user.available);
            setDirty(false);
          } else {
            setPlan(); // = undefinded
            setCrediti(0);
            setCurrentType(null);
            setDirty(false);
          }
        } 
      )
    }    
    
  }, [loggedIn, user.available, dirty]);

  //if edit or add
  //ogni volta che devo aggiungere o modifico passo tutto a current plan
  //che contiene una copia dei dati persistenti sul db
  useEffect(() => {
    if (add || edit) {
      setCurrentPlan(plan ? plan : []);
      setCurrentCrediti(crediti);
    }
  }, [plan, crediti, setCurrentPlan, add, edit])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        console.error(err.error);
      }
    };

    checkAuth();
  }, []);

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
    setCurrentCrediti(oldCrediti => oldCrediti + course.crediti);
  }

  const deleteCourseFromPlan = (codice, crediti) => {
    setCurrentPlan(currentPlan.filter(p => p.codice !== codice));
    setCurrentCrediti(oldCrediti => oldCrediti - crediti);
  }

  const cancelCurrentPlan = () => {
    setCurrentPlan([]);
    setCurrentCrediti(0);
    // navigate('/'); // TODO: Remember to delete the function handleCancel in PlanForm
  }

  const saveCurrentPlan = async (type) => {
    try {
      if(add) {
        await API.addPlan(currentPlan, type);
      } else {
        await API.updateCurrentPlan(currentPlan, type);
      }
      setUser({...user, available: type});
      setDirty(true);
      navigate('/');
    } catch (error) {
      
    }
    // API.addPlan(currentPlan, type).then(() => {
    //   cancelCurrentPlan();
    //   setUser({ ...user, available: type });
    //   setDirty(true);
    //   navigate('/');
    // }).catch(err => console.error(err.errMessage));
  }


  const deletePlan = () => {
    API.deletePlan().then(() => {
      cancelCurrentPlan();
      setUser({ ...user, available: null });
      setDirty(true);
    })
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage user={user} courses={courses} currentPlan={currentPlan} plan={plan} crediti={crediti} add={add} setAdd={setAdd} edit={edit} setEdit={setEdit} deletePlan={deletePlan} coursesLoading={coursesLoading}/>} >
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
