import '../css/dashboard.css';
import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios';
import Application from './Application';
<<<<<<< HEAD
import AddApplication from './AddApplication';
=======
>>>>>>> 114cc46556c697b1e7d84d8b43397aa2fb2d7ba7

export default function Dashboard(props) {

    const [applicationLoaded, setApplicationLoaded] = useState(false);
    const [applications, setApplications] = useState([]);

    const getApplications = () => {
        setApplications([]);
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

      // eslint-disable-next-line
      useEffect(getApplications, []);

    return (
        <div className="dashboard">
        <AddApplication getApplications={getApplications}/>
            <div className="dashboardBody">
            <header>
                <h1 className="title" style={{float:'left', display:'inline-block'}}>AppTracker</h1> <h2 className="settingsTitle" style={{float: 'right', display:'inline-block'}}>Settings</h2>
            </header>
                <div className="dashboardFilter"><h1>Filter: </h1></div>
                <div className="dashboardApplications">
                    <h1 style={{display: 'inline-block'}}>Applications ({applications.length})</h1><button className="btn_addApplication" style={{display:'inline-block'}}>+</button>
                    {applicationLoaded ? applications.map((application) => {
                        return <Application companyName={application.companyName} appliedDate={application.appliedDate} position={application.position} interviewer={application.interviewer} status={application.status} followUp={application.followUp} documentsSubmitted={application.documentsSubmitted} notes={application.documentsSubmitted}/>
                    }) : <p style={{color: 'black'}}>Not logged in.</p>}
                </div>
            </div>
        </div>
    )
}
