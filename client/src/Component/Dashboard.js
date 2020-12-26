import '../css/dashboard.css';
import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios';

export default function Dashboard(props) {

    const [applicationLoaded, setApplicationLoaded] = useState(false);
    const [applications, setApplications] = useState([]);
    const getApplications = () => {
        axios({
          method: "POST",
          url: "http://localhost:5000/user/applications",
          data: {token: sessionStorage.getItem('loginToken')}
      }).then(res => {
        for(let applicationIndex in res.data)
          applications.push(res.data[applicationIndex]);
        setApplications(applications);
        setApplicationLoaded(true);
      });
      }

      useEffect(() => {
        getApplications();
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboardBody">
            <header>
                <h1 className="title" style={{float:'left', display:'inline-block'}}>AppTracker</h1> <h2 className="settingsTitle" style={{float: 'right', display:'inline-block'}}>Settings</h2>
            </header>
                <div className="dashboardFilter"><h1>Filter: </h1></div>
                <div className="dashboardApplications">
                    <h1>Your Applications ({applications.length})</h1>
                    {applicationLoaded ? applications.map((application) => {
                        return <h1 style={{color: 'black'}}>{application}</h1>
                    }) : <p style={{color: 'black'}}>false</p>}
                </div>
            </div>
        </div>
    )
}
