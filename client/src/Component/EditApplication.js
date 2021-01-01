import React from 'react';
import '../css/dashboard.css';
import '../css/addApplicationStyles.css'
import axios from 'axios';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import {useState, useEffect} from 'react'

export default function EditApplication(props) {

    const moment = require('moment');

    const [appliedDate, setAppliedDate] = useState(moment(props.appliedDate).toDate());
    const [interviewTime, setInterviewTime] = useState(moment(props.interviewTime).toDate());
    const [documentsSubmitted, setDocumentsSubmitted] = useState([]);
    const [notes, setNotes] = useState([]);

    useEffect( () => {
        let documentsSubmittedCopy = [];
        let notesCopy = [];
        for(let i = 0; i < props.documentsSubmitted.length; i++)
            documentsSubmittedCopy.push(props.documentsSubmitted[i]);
        for(let i = 0; i < props.notes.length; i++)
            notesCopy.push(props.notes[i]);
        setDocumentsSubmitted(documentsSubmittedCopy);
        setNotes(notesCopy);
        checkInterviewScheduled();
    }, [props.documentsSubmitted, props.notes])

    const addSubmittedDocument = () => {
        let documentsSubmittedCopy = [...documentsSubmitted];
        if(!documentsSubmittedCopy.includes(document.getElementById('submittedDocument').value)){
            documentsSubmittedCopy.push(document.getElementById('submittedDocument').value);
            setDocumentsSubmitted(documentsSubmittedCopy);
        }
    }

    const addNote = () => {
        let notesCopy = [...notes];
        if(!notesCopy.includes(document.getElementById('note').value)){
            notesCopy.push(document.getElementById('note').value);
            setNotes(notesCopy);
        }
    }

    const checkInterviewScheduled = () => {
        if(document.getElementById('status').value === "Interview Scheduled"){
            document.getElementsByClassName('interviewSchedule')[0].style.display = "block";
            document.getElementsByClassName('notesDocsContainer')[0].style.height = "15em";
        } else {
            document.getElementsByClassName('interviewSchedule')[0].style.display = "none";
            document.getElementsByClassName('notesDocsContainer')[0].style.height = "10.3em";
        }
    }

    const removeNoteElement = (e, note) => {
        let notesCopy = [...notes];
        if(notesCopy.includes(note)){
            let index = notesCopy.findIndex(element => element === note);
            notesCopy.splice(index, 1);
            setNotes(notesCopy);
        } else {
            console.error("There was a problem removing the note.")
        }
    }

    const removeDocumentElement = (e, document) => {
        let documentsSubmittedCopy = [...documentsSubmitted];
        if(documentsSubmittedCopy.includes(document)){
            let index = documentsSubmittedCopy.findIndex(element => element === document);
            documentsSubmittedCopy.splice(index, 1);
            setDocumentsSubmitted(documentsSubmittedCopy);
        } else {
            console.error("There was a problem removing the document.")
        }
    }

    const updateApplication = (event) => {
        event.preventDefault();
        axios({
          method: "POST",
          url: "http://localhost:5000/user/updateApplication",
          data: {token: sessionStorage.getItem('loginToken'), 
          appData: 
            {
            _id: props.applicationId,
            companyName: document.getElementById('companyName').value,
            position: document.getElementById('position').value,
            appliedDate: appliedDate,
            status: document.getElementById('status').value,
            interviewTime: interviewTime,
            interviewer: document.getElementById('interviewer').value,
            followUp: document.getElementById('followUp').value,
            documentsSubmitted: documentsSubmitted,
            notes: notes
            }
        }
      }).then(res => {
          if(res.data.access !== "denied"){
            props.updateEditedApplication(props.applicationId, appliedDate, document.getElementById('companyName').value, document.getElementById('position').value, document.getElementById('interviewer').value, document.getElementById('status').value, interviewTime, document.getElementById('followUp').value, documentsSubmitted, notes);
            props.toggleEditing();
        }
          
      });
    }

    return (
        <div className="addApplication">
            <div className="addApplicationContainer">
                <div className="addApplicationHeader"><h2>Update Application</h2><button className="blueButton" onClick={props.toggleEditing}>&#10006;</button></div>
                    <form className="addApplicationForm" onSubmit={updateApplication}>
                        <div className="formContainer">
                            {/* Right side of form */ }
                            <div className="leftSideForm">
                                <h3 className="addApplicationTitle">Company Name <span style={{color: '#fb2424', fontSize:'0.6em'}}>(REQUIRED)</span></h3><input required type="text" name="companyName" id="companyName" defaultValue={props.companyName}></input><br />
                                <h3 className="addApplicationTitle">Position <span style={{color: '#fb2424', fontSize:'0.6em'}}>(REQUIRED)</span></h3><input required type="text" name="position" id="position" defaultValue={props.position}></input><br />
                                <h3 className="addApplicationTitle">Applied <span style={{color: '#fb2424', fontSize:'0.6em'}}>(REQUIRED)</span></h3><div style={{width: '100%'}}><DatePicker required selected={appliedDate} onChange={date => setAppliedDate(date)} /></div>
                                
                                <h3 className="addApplicationTitle">Status <span style={{color: '#fb2424', fontSize:'0.6em'}}>(REQUIRED)</span></h3>
                                    <div className="addApplicationSelect"><select required className="addApplicationSelect" onChange={checkInterviewScheduled} name="status" id="status" defaultValue={props.status}>
                                        <option value="Application Sent">Application Sent</option>
                                        <option value="In Communication">In Communication</option>
                                        <option value="Interview Scheduled">Interview Scheduled</option>
                                        <option value="Pending Response">Pending Response</option>
                                        <option value="Job Offer">Job Offered</option>
                                        <option value="Job Accepted">Job Accepted</option>
                                        <option value="Rejected">Rejected</option>
                                    </select></div>

                                <div className="interviewSchedule">
                                    <h3 className="addApplicationTitle">Interview Date/Time</h3>
                                    <div style={{width: '100%'}}><DatePicker selected={interviewTime} onChange={date => setInterviewTime(date)} showTimeSelect dateFormat="Pp" timeFormat="p" /></div></div>
                                <h3 className="addApplicationTitle">Interviewer: </h3><input type="text" name="interviewer" id="interviewer" defaultValue={props.interviewer}></input>
                                <h3 className="addApplicationTitle">Follow-Up: </h3>
                                <div className="addApplicationSelect"><select required name="followUp" id="followUp" defaultValue={props.followUp}>
                                    <option value="false">Incomplete</option>
                                    <option value="true">Complete</option>
                                </select></div>
                                <br />
                            </div>

                            {/* Left side of form */ }
                            <div className="rightSideForm">
                                <h3 className="addApplicationTitle">Documents Submitted: </h3>
                                <div className="addApplicationSelect"><select required name="submittedDocument" id="submittedDocument">
                                    <option value="Resume">Resume</option>
                                    <option value="Cover Letter">Cover Letter</option>
                                    <option value="Transcript">Transcript</option>
                                    <option value="Portfolio">Portfolio</option>
                                    <option value="Letters of Recommendation">Letters of Recommendation</option>
                                    <option value="References List">References List</option>
                                    <option value="Other">Other</option>
                                </select> </div>
                                <button type="button" className="blueButton" onClick={addSubmittedDocument}>Add Document</button> <br />
                                
                                <h3 className="addApplicationTitle">Notes: </h3><textarea type="text" name="note" id="note"></textarea><br />
                                <button type="button" className="blueButton" onClick= { addNote } >Add Note</button>

                                <div className="notesDocsContainer">
                                    {documentsSubmitted.length > 0 ? <h4>Submitted Documents</h4> : null }
                                    { documentsSubmitted.map((doc, index) => {
                                    return <div key = {"doc" + index}><li>{index + 1}) {doc} <button type="button" onClick={(e) => { removeDocumentElement(e, doc) }}>&#10006;</button></li></div>
                                }) }
                                    {notes.length > 0 && documentsSubmitted.length > 0 ? <div style={{marginBottom: '10px'}}></div> : null}
                                    {notes.length > 0 ? <h4>Notes</h4> : null }
                                    { notes.map((note, index) => {
                                    return <div key = {"note" + index}><li>{index + 1}) {note} <button type="button" onClick={(e) => { removeNoteElement(e, note) }}>&#10006;</button></li></div>
                                }) }
                                </div>
                            </div>
                            
                            <br />
                        </div>
                        <input type="submit" name="Submit" value="Update Application"/>
                    </form>
            </div>
        </div>
    )
}
