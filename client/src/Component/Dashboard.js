import '../css/dashboard.css';
import '../css/filterStyles.css';
import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios';
import Application from './Application';
import AddApplication from './AddApplication';
import EditApplication from './EditApplication';
import {Link} from 'react-router-dom';

const moment = require('moment');

export default function Dashboard(props) {

    const [applicationLoaded, setApplicationLoaded] = useState(false);
    const [applications, setApplications] = useState([]);
    const [isAddingApplication, setIsAddingApplication] = useState(false);
    const [isUpdatingApplication, setIsUpdatingApplication] = useState(false);
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
    const [editMode, setEditMode] = useState(false);
    const [updateApplicationDetails, setUpdateApplicationDetails] = useState({});
    const [showFilterScreen, setShowFilterScreen] = useState(false);

    
    const checkWidth = (e) => {
        if(window.innerWidth >= 874){
            if(!showFilterScreen) {
                showFilters();
            }
        }

        if(window.innerWidth < 874){
            if(showFilterScreen) {
                showFilters();
            }
        }
    }
    window.addEventListener('resize', checkWidth);
    
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
            if((application.companyName.toLowerCase().includes(filterText.toLowerCase()) || application.position.toLowerCase().includes(filterText.toLowerCase()) || filterText.toLowerCase().includes(application.companyName.toLowerCase()) || filterText.toLowerCase().includes(application.position.toLowerCase()))){
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
            }
        });

        if(!filtersCopy.applicationSent && !filtersCopy.inCommunication && !filtersCopy.interviewScheduled && !filtersCopy.pendingResponse && !filtersCopy.jobOffered && !filtersCopy.jobRejected && !filtersCopy.jobAccepted){
           if(filterText.length === 0){
                filteredApplicationsArr = [...applications];
           }
            applications.forEach((application) => {
                if(filterText.length > 0 && (application.companyName.toLowerCase().includes(filterText.toLowerCase()) || application.position.toLowerCase().includes(filterText.toLowerCase()) || filterText.toLowerCase().includes(application.companyName.toLowerCase()) || filterText.toLowerCase().includes(application.position.toLowerCase())))
                    filteredApplicationsArr.push(application);
            });
        }

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
        if(filters.applicationSent !== filtersCopy.applicationSent ||
            filters.inCommunication !== filtersCopy.inCommunication ||
            filters.interviewScheduled !== filtersCopy.interviewScheduled ||
            filters.jobAccepted !== filtersCopy.jobAccepted ||
            filters.jobOffered !== filtersCopy.jobOffered ||
            filters.jobRejected !== filtersCopy.jobRejected ||
            filters.pendingResponse !== filtersCopy.pendingResponse){
            setFilters(filtersCopy);
        }
    }

    const getApplications = () => {
        axios({
          method: "POST",
          url: "https://www.apptracker.app/user/applications",
          data: {token: localStorage.getItem('loginToken')}
      }).then(res => {
        setApplications([]);
        let newApplications = [...applications];
        let updateIndex = applicationIndex;
        while(newApplications.length < res.data[0].applications.length){
            newApplications.push(res.data[0].applications[updateIndex++]);
        }
        setApplicationIndex(updateIndex);
        setApplications(newApplications);
        setFilteredApplications(newApplications);
        setApplicationLoaded(true);
    });
}

const removeApplication = (e, id) => {
    axios({
        method: "POST",
        url: "https://www.apptracker.app/user/applications/remove",
        data: {
            token: localStorage.getItem('loginToken'),
            removeId: id
            }
    }).then(res => {
        if(res.data.status === "Success"){
            let applicationsCopy = [...applications];
            let updatedApplications = [...filteredApplications];
            for(let i = 0; i < updatedApplications.length; i++){
                if(updatedApplications[i]._id === id)
                    updatedApplications.splice(i, 1);
            }
            for(let i = 0; i < applicationsCopy.length; i++){
                if(applicationsCopy[i]._id === id)
                    applicationsCopy.splice(i, 1);
            }
            setApplicationIndex(applicationIndex - 1);
            setApplications(applicationsCopy);
            updateFilters();
            setFilteredApplications(updatedApplications);
        } else {
            console.error("There was an error removing the application.")
        }
    })
}

const toggleAddingApplication = () => {
    setIsAddingApplication(!isAddingApplication);
}

const toggleEditingApplication = () => {
    setIsUpdatingApplication(!isUpdatingApplication);
}

const startUpdatingApplication = (e, applicationId, appliedDate, companyName, position, location, contacts, status, interviewTime, followUp, documentsSubmitted, notes) => {
    setUpdateApplicationDetails({
        applicationId,
        appliedDate,
        companyName,
        position,
        location,
        contacts,
        status,
        interviewTime,
        followUp,
        documentsSubmitted,
        notes
    });
    toggleEditingApplication();
}

const toggleEditMode = () => {
    if(!editMode === true)
        document.getElementsByClassName("btn_editMode")[0].style.borderBottom = "3px solid green";
    else
        document.getElementsByClassName("btn_editMode")[0].style.borderBottom = "3px solid red";
    setEditMode(!editMode);
}

const showFilters = () => {
    if(window.innerWidth < 875 && !showFilterScreen){
        document.getElementsByClassName("showFilters")[0].style.backgroundColor = "#ddd"
        document.getElementsByClassName("dashboardFilter")[0].style.paddingTop = "1em";
        document.getElementsByClassName("dashboardFilter")[0].style.height = "100%";
        setShowFilterScreen(true);
    } else if(window.innerWidth < 875 && showFilterScreen) {
        document.getElementsByClassName("showFilters")[0].style.backgroundColor = "#f0f0f0"
        document.getElementsByClassName("dashboardFilter")[0].style.height = "0%";
        document.getElementsByClassName("dashboardFilter")[0].style.paddingTop = "0em";
        setShowFilterScreen(false);
    }
}

const updateEditedApplications = 
    (applicationId, 
    appliedDate, 
    companyName, 
    position, 
    location, 
    contacts,
    status, 
    interviewTime, 
    followUp, 
    documentsSubmitted, 
    notes) => {
    let applicationsCopy = [...applications];
    for(let i = 0; i < applicationsCopy.length; i++){
        if(applicationsCopy[i]._id === applicationId){
            applicationsCopy[i].appliedDate = appliedDate;
            applicationsCopy[i].companyName = companyName;
            applicationsCopy[i].position = position;
            applicationsCopy[i].location = location;
            applicationsCopy[i].contacts = contacts;
            applicationsCopy[i].status = status;
            applicationsCopy[i].interviewTime = interviewTime;
            applicationsCopy[i].followUp = followUp;
            applicationsCopy[i].documentsSubmitted = documentsSubmitted;
            applicationsCopy[i].notes = notes;
        }
    }
    setApplications(applicationsCopy);
    updateFilters();
}

// eslint-disable-next-line
useEffect(() => { getApplications(); checkWidth();}, []);
useEffect(updateFilters, [filterText, filters, applications]);

    return (
        <div className="dashboard">
        {isAddingApplication ? 
        <AddApplication 
        getApplications={getApplications} toggleAdding={toggleAddingApplication} /> : null}
        {isUpdatingApplication ? 
        <EditApplication 
        applicationId={ updateApplicationDetails.applicationId } 
        getApplications={getApplications} 
        toggleEditing={toggleEditingApplication} 
        appliedDate={updateApplicationDetails.appliedDate} 
        companyName={updateApplicationDetails.companyName} 
        position={updateApplicationDetails.position} 
        location={updateApplicationDetails.location}
        contacts={updateApplicationDetails.contacts} 
        status={updateApplicationDetails.status} 
        interviewTime={updateApplicationDetails.interviewTime} 
        followUp={updateApplicationDetails.followUp} 
        documentsSubmitted={updateApplicationDetails.documentsSubmitted} 
        notes={updateApplicationDetails.notes} 
        updateEditedApplication={updateEditedApplications}/> : null}
            <div className="dashboardBody">
            <header >
                <h1 className="title">AppTracker</h1><h5 onClick={props.logout} ><Link to="/">Logout</Link></h5>
            </header>
            <button onClick={showFilters} className="showFilters">{showFilterScreen ? 'Hide Filters' : 'Set Filters'}</button>
                <div className="dashboardFilter">
                    <h1>Filter: </h1>
                        <input className="FilterTextBox" name="filter" id="filter" placeholder="Company Name/Position" onChange={()=>{setFilterText(document.getElementsByClassName("FilterTextBox")[0].value);}}></input> <br />
                        <div className="statusFilters">
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
                        </div>
                        <label>Sort: </label>
                        <div className="filterSelect"><select id="sortSelect" name="sortSelect" onChange={updateFilters}>
                            <option>Date (Descending)</option>
                            <option>Date (Ascending)</option>
                        </select></div>
                    </div>
                <div className="dashboardApplications">
                    <div className="applicationsHeader"><h1 style={{display: 'inline-block'}}>Applications ({filteredApplications.length})</h1><button onClick={toggleAddingApplication} className="btn_addApplication" style={{display:'inline-block'}}>+</button><button onClick={toggleEditMode} className="btn_editMode" style={{display:'inline-block'}}>Edit Mode</button></div>
                    {applicationLoaded ? filteredApplications.map((application => {
                                if(!editMode)
                                    return <div key={application._id} style={{marginTop:'30px'}}><Application   companyName={application.companyName}
                                                                                                                appliedDate={application.appliedDate} 
                                                                                                                position={application.position} 
                                                                                                                location={application.location}
                                                                                                                contacts={application.contacts} 
                                                                                                                status={application.status} 
                                                                                                                followUp={application.followUp} 
                                                                                                                documentsSubmitted={application.documentsSubmitted} 
                                                                                                                notes={application.notes} 
                                                                                                                interviewTime={application.interviewTime}/>
                                            </div>
                                else
                                    return <div key={application._id} style={{marginTop:'30px'}}>
                                                <div className="editModeButtons">
                                                    <button onClick={(e) => { startUpdatingApplication(e, application._id, application.appliedDate, application.companyName, application.position, application.location, application.contacts, application.status, application.interviewTime, application.followUp, application.documentsSubmitted, application.notes) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                                        </svg>
                                                    </button>
                                                    <span className="delete"><button onClick={(e) => removeApplication(e, application._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                        </svg>
                                                    </button>
                                                    </span>
                                                </div>
                                                <Application    companyName={application.companyName}
                                                                appliedDate={application.appliedDate}
                                                                position={application.position}
                                                                location={application.location}
                                                                contacts={application.contacts}
                                                                status={application.status}
                                                                followUp={application.followUp}
                                                                documentsSubmitted={application.documentsSubmitted}
                                                                notes={application.notes}
                                                                interviewTime={application.interviewTime}/>
                                            </div>
                    })) : <p style={{color: 'black'}}>Not logged in.</p>}
                </div>
            </div>
        </div>
    )
}