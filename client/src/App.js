import './index.css';
import Dashboard from './Component/Dashboard'
import Unauthorized from './Component/Unauthorized'
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Link} from 'react-router-dom';
import React from 'react';
import Login from './Component/Login';
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {

  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");

  const loginTrue = (state) => {
    setLogin(state);
  }

  useEffect(() => {
    if(sessionStorage.getItem('loginToken') == null){
      setLogin(false);
  } else {

    axios({
      method: "POST",
      url: "http://localhost:5000/user/verify",
      data: {token: sessionStorage.getItem('loginToken')}
  }).then(res => {
      if(res.data.access === 'granted'){
        setName(res.data.name);
        setLogin(true);
      } else {
        console.log("User not logged in.")
        setLogin(false);
      }
  });
  }
  }, [])

  useEffect( () => {
    if(sessionStorage.getItem('loginToken') != null){
    axios({
      method: "POST",
      url: "http://localhost:5000/user/verify",
      data: {token: sessionStorage.getItem('loginToken')}
  }).then(res => {
      if(res.data.access === 'granted'){
        setName(res.data.name);
      }
  });
  }
  }, [login])

  return (
    <Router>
      <Route exact={true} path="/">
        <div className="homeCenter">
            <div className="centerContent">
              {login ? <h1 style={{paddingBottom: '20px'}}>Welcome to AppTracker, {name}</h1> : <h1 style={{paddingBottom: '20px'}}>Welcome to AppTracker</h1>}
              <div>{login ? <Link to="./dashboard"><button className="btn_dashboard">Dashboard</button></Link> : <Login loginFunc={loginTrue}/>}</div>
            </div>
        </div>
      </Route>
      <Route exact={true} path="/dashboard">
        {login ? <Dashboard /> : <Unauthorized />}
      </Route>
    </Router>
  );
}

export default App;
