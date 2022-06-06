import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageNotFound from './components/PageNotFound/PageNotFound';
import LoginForm from './components/LoginForm/LoginForm';
import UserPage from './components/UserPage/UserPage';
import LandingPage from './components/LandingPage/LandingPage';
import { useState } from 'react';


function App() {
  return (
    <>
      <Router>
        <MainApp/>
      </Router>
    </>
  );
}

function MainApp() {

  const [user, setUser] = useState({id: "1", nome: "Luigi", cognome: "Crisci", email: "test@polito.it"});

  return(
    <Routes>
      <Route path='/' element={<LandingPage user={user}/>}/>
       <Route path='/login' element={<LoginForm/>} />
       <Route path='/user' element={<UserPage user={user}/>}/>
       <Route path='*' element={<PageNotFound/>} />
    </Routes>
  )
}

export default App;
