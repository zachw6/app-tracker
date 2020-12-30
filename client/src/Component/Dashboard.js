import '../css/dashboard.css';
import '../css/filterStyles.css';
import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios';
import Application from './Application';
import AddApplication from './AddApplication';
import {Link} from 'react-router-dom';

const moment = require('moment');

export default function Dashboard(props) {

    const [applicationLoaded, setApplicationLoaded] = useState(false);
    const [applications, setApplications] = useState([]);
    const [isAddingApplication, setIsAddingApplication] = useState(false);
    const [applicationIndex, setApplicationIndex] = useState(0);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [filters, setFilters] = useState({
        applicationSent: false,
        inCommunication: false,
        interviewScheduled: false,
        pendingResponse: false,
        jobOffered: false,
        jobAccepted: false,
        jobRejected: false
    });

    const updateFilters = () => {
        let filtersCopy = Object.assign({}, filters);
        let filteredApplicationsArr = [];
        if(document.getElementById("applicationSent").checked){
            filtersCopy.applicationSent = true;
        } else {
            filtersCopy.applicationSent = false;
        }
        if(document.getElementById("inCommunication").checked){
            filtersCopy.inCommunication = true;
        } else {
            filtersCopy.inCommunication = false;
        }
        if(document.getElementById("interviewScheduled").checked){
            filtersCopy.interviewScheduled = true;
        } else {
            filtersCopy.interviewScheduled = false;
        }
        if(document.getElementById("pendingResponse").checked){
            filtersCopy.pendingResponse = true;
        } else {
            filtersCopy.pendingResponse = false;
        }
        if(document.getElementById("jobOffered").checked){
            filtersCopy.jobOffered = true;
        } else {
            filtersCopy.jobOffered = false;
        }
        if(document.getElementById("jobAccepted").checked){
            filtersCopy.jobAccepted = true;
        } else {
            filtersCopy.jobAccepted = false;
        }
        if(document.getElementById("jobRejected").checked){
            filtersCopy.jobRejected = true;
        } else {
            filtersCopy.jobRejected = false;
        }
        
        applications.forEach((application) => {
            if(filtersCopy.applicationSent && application.status === "Application Sent")
                filteredApplicationsArr.push(application);
            if(filtersCopy.inCommunication && application.status === "In Communication")
                filteredApplicationsArr.push(application);
            if(filtersCopy.interviewScheduled && application.status === "Interview Scheduled")
                filteredApplicationsArr.push(application);
            if(filtersCopy.pendingResponse && application.status === "Pending Response")
                filteredApplicationsArr.push(application);
            if(filtersCopy.jobOffered && application.status === "Job Offered")
                filteredApplicationsArr.push(application);
            if(filtersCopy.jobAccepted && application.status === "Job Accepted")
                filteredApplicationsArr.push(application);
            if(filtersCopy.jobRejected && application.status === "Job Rejected")
                filteredApplicationsArr.push(application);
        })

        // Sort the applications by date descending)
        switch(document.getElementById("sortSelect").value){
            case "Date (Descending)":
                filteredApplicationsArr.sort((a, b) => {
                    return moment(b.appliedDate).format("YYYYMMDD") - moment(a.appliedDate).format("YYYYMMDD")});
                    break;
            case "Date (Ascending)":
                filteredApplicationsArr.sort((a, b) => {
                    return moment(a.appliedDate).format("YYYYMMDD") - moment(b.appliedDate).format("YYYYMMDD")});
                    break;
            default:
                filteredApplicationsArr.sort((a, b) => {
                    return moment(a.appliedDate).format("YYYYMMDD") - moment(b.appliedDate).format("YYYYMMDD")});
                    break;
                }

        setFilteredApplications(filteredApplicationsArr);
        setFilters(filtersCopy);
    }

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
            <header >
                <h1 className="title" style={{justifySelf:'start'}}>AppTracker</h1><h5 onClick={props.logout} style={{justifySelf: 'end'}}><Link to="/">Logout</Link></h5>
            </header>
                <div className="dashboardFilter">
                    <h1>Filter: </h1>
                        <input className="FilterTextBox" name="filter" id="filter" placeholder="Company Name/Position" onChange={()=>{setFilterText(document.getElementsByClassName("FilterTextBox")[0].value);}}></input> <br />
                        <input type="checkbox" id="applicationSent" name="applicationSent" value="applicationSent" onChange={updateFilters}/>
                        <label>Application Sent</label>
                        <br />
                        <input type="checkbox" id="inCommunication" name="inCommunication" value="inCommunication" onChange={updateFilters}/>
                        <label>In Communication</label>
                        <br />
                        <input type="checkbox" id="interviewScheduled" name="interviewScheduled" value="interviewScheduled" onChange={updateFilters}/>
                        <label>Interview Scheduled</label>
                        <br />
                        <input type="checkbox" id="pendingResponse" name="pendingResponse" value="pendingResponse" onChange={updateFilters}/>
                        <label>Pending Response</label>
                        <br />
                        <input type="checkbox" id="jobOffered" name="jobOffered" value="jobOffered" onChange={updateFilters}/>
                        <label>Job Offered</label>
                        <br />
                        <input type="checkbox" id="jobAccepted" name="jobAccepted" value="jobAccepted" onChange={updateFilters}/>
                        <label>Job Accepted</label>
                        <br />
                        <input type="checkbox" id="jobRejected" name="jobRejected" value="jobRejected" onChange={updateFilters}/>
                        <label>Job Rejected</label>
                        <br />
                        <label>Sort: </label>
                        <select id="sortSelect" name="sortSelect" onChange={updateFilters}>
                            <option>Date (Descending)</option>
                            <option>Date (Ascending)</option>
                        </select>
                    </div>
                <div className="dashboardApplications">
                    <h1 style={{display: 'inline-block'}}>Applications ({(filters.applicationSent || filters.inCommunication || filters.interviewScheduled || filters.jobAccepted || filters.jobOffered || filters.jobRejected || filters.pendingResponse) ? filteredApplications.length : applications.length})</h1><button onClick={toggleAddingApplication} className="btn_addApplication" style={{display:'inline-block'}}>+</button>
                    {applicationLoaded ? 
                    (filters.applicationSent || filters.inCommunication || filters.interviewScheduled || filters.jobAccepted || filters.jobOffered || filters.jobRejected || filters.pendingResponse ? filteredApplications.map( (application) => {
                        if((application.companyName.toLowerCase().includes(filterText.toLowerCase()) || application.position.toLowerCase().includes(filterText.toLowerCase()) || filterText.toLowerCase().includes(application.companyName.toLowerCase()) || filterText.toLowerCase().includes(application.position.toLowerCase()))){
                            return <Application key={application._id} companyName={application.companyName} appliedDate={application.appliedDate} position={application.position} interviewer={application.interviewer} status={application.status} followUp={application.followUp} documentsSubmitted={application.documentsSubmitted} notes={application.documentsSubmitted} interviewTime={application.interviewTime}/>
                        } else { return null; }
                    }): applications.map((application => {
                            if((application.companyName.toLowerCase().includes(filterText.toLowerCase()) || application.position.toLowerCase().includes(filterText.toLowerCase()) || filterText.toLowerCase().includes(application.companyName.toLowerCase()) || filterText.toLowerCase().includes(application.position.toLowerCase()))){
                                return <Application key={application._id} companyName={application.companyName} appliedDate={application.appliedDate} position={application.position} interviewer={application.interviewer} status={application.status} followUp={application.followUp} documentsSubmitted={application.documentsSubmitted} notes={application.documentsSubmitted} interviewTime={application.interviewTime}/>
                            } else { return null; }
                    }))) : <p style={{color: 'black'}}>Not logged in.</p>}
                </div>
            </div>
        </div>
    )
}