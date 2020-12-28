import '../css/dashboard.css';
import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios';
import Application from './Application';
import AddApplication from './AddApplication';

export default function Dashboard(props) {

    const [applicationLoaded, setApplicationLoaded] = useState(false);
    const [applications, setApplications] = useState([]);
    const [isAddingApplication, setIsAddingApplication] = useState(false);
    const [applicationIndex, setApplicationIndex] = useState(0);

    const getApplications = () => {
        axios({
          method: "POST",
          url: "http://localhost:5000/user/applications",
          data: {token: sessionStorage.getItem('loginToken')}
      }).then(res => {
        setApplications([]);
        let newApplications = [...applications];
        let updateIndex = applicationIndex;
        while(newApplications.length < res.data[0].applications.length){
            newApplications.push(res.data[0].applications[updateIndex++]);
        }
        setApplicationIndex(updateIndex);
        setApplications(newApplications);
        setApplicationLoaded(true);
      });
      }

      const toggleAddingApplication = () => {
        setIsAddingApplication(!isAddingApplication);
      }

      // eslint-disable-next-line
      useEffect(getApplications, []);

    return (
        <div className="dashboard">
        {isAddingApplication ? <AddApplication getApplications={getApplications} toggleAdding={toggleAddingApplication} /> : null}
            <div className="dashboardBody">
            <header>
                <h1 className="title" style={{float:'left', display:'inline-block'}}>AppTracker</h1> <h2 className="settingsTitle" style={{float: 'right', display:'inline-block'}}>Settings</h2>
            </header>
                <div className="dashboardFilter"><h1>Filter: </h1></div>
                <div className="dashboardApplications">
                    <h1 style={{display: 'inline-block'}}>Applications ({applications.length})</h1><button onClick={toggleAddingApplication} className="btn_addApplication" style={{display:'inline-block'}}>+</button>
                    {applicationLoaded ? applications.map((application) => {
                        return <Application key={application._id} companyName={application.companyName} appliedDate={application.appliedDate} position={application.position} interviewer={application.interviewer} status={application.status} followUp={application.followUp} documentsSubmitted={application.documentsSubmitted} notes={application.documentsSubmitted} interviewTime={application.interviewTime}/>
                    }) : <p style={{color: 'black'}}>Not logged in.</p>}
                </div>
            </div>
        </div>
    )
}
