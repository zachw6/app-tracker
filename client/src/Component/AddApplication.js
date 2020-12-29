import React from 'react';
import '../css/dashboard.css';
import axios from 'axios';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import {useState} from 'react'

export default function AddApplication(props) {

    const [appliedDate, setAppliedDate] = useState(new Date());
    const [interviewTime, setInterviewTime] = useState(new Date());
    const [documentsSubmitted, setDocumentsSubmitted] = useState([]);
    const [notes, setNotes] = useState([]);
    
    window.onscroll = function () { window.scrollTo(0, 0); };

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
            document.getElementsByClassName('notesDocsContainer')[0].style.height = "300px";
        } else {
            document.getElementsByClassName('interviewSchedule')[0].style.display = "none";
            document.getElementsByClassName('notesDocsContainer')[0].style.height = "210px";
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

    const createApplication = (event) => {
        event.preventDefault();
        console.log("Submitting.")
        axios({
          method: "POST",
          url: "http://localhost:5000/user/createApplication",
          data: {token: sessionStorage.getItem('loginToken'), 
          appData: 
            {
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
            props.getApplications();
          }
      });
    }

    return (
        <div className="addApplication" style={{width: '100%', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display:'flex', justifyContent: 'center', alignItems: 'center', position:'absolute'}}>
            <div style={{width: '1000px', height: '800px', backgroundColor: '#f0f0f0', position: 'relative'}}>
                <button onClick={props.toggleAdding} style={{position: 'absolute', right: '20px', border: 'none', outline: 'none', fontSize: '36px', color: '#e33b32', zIndex: '2', backgroundColor: 'rgba(0,0,0,0)', transform: 'translateY(-10px)'}}>&#10006;</button>
                <div className="addApplicationHeader"><h2 style={{color: 'white', fontSize: '30px', marginLeft: '20px', marginTop: '15px'}}>Add Application</h2></div>
                    <form className="addApplicationForm" onSubmit={createApplication}>
                        <div className="formContainer">
                            {/* Right side of form */ }
                            <div className="leftSideForm">
                                <h3 className="addApplicationTitle">Company Name <span style={{color: '#fb2424', fontSize:'12px'}}>(REQUIRED)</span></h3><input required type="text" name="companyName" id="companyName"></input><br />
                                <h3 className="addApplicationTitle">Position <span style={{color: '#fb2424', fontSize:'12px'}}>(REQUIRED)</span></h3><input required type="text" name="position" id="position"></input><br />
                                <h3 className="addApplicationTitle">Applied <span style={{color: '#fb2424', fontSize:'12px'}}>(REQUIRED)</span></h3><div style={{width: '100%'}}><DatePicker required selected={appliedDate} onChange={date => setAppliedDate(date)} /></div>
                                
                                <h3 className="addApplicationTitle">Status <span style={{color: '#fb2424', fontSize:'12px'}}>(REQUIRED)</span></h3>
                                    <div className="addApplicationSelect"><select required className="addApplicationSelect" onChange={checkInterviewScheduled} name="status" id="status">
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
                                <h3 className="addApplicationTitle">Interviewer: </h3><input type="text" name="interviewer" id="interviewer"></input>
                                <h3 className="addApplicationTitle">Follow-Up: </h3>
                                <div className="addApplicationSelect"><select required name="followUp" id="followUp">
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
                                <button type="button" onClick={addSubmittedDocument}>Add Document</button> <br />
                                
                                <h3 className="addApplicationTitle">Notes: </h3><textarea style={{}} type="text" name="note" id="note"></textarea><br />
                                <button type="button" onClick= { addNote } >Add Note</button>

                                <div className="notesDocsContainer">
                                    {documentsSubmitted.length > 0 ? <h4>Submitted Documents</h4> : null }
                                    { documentsSubmitted.map((doc, index) => {
                                    return <div><li key = {index}>{index + 1}) {doc} <button type="button" onClick={(e) => { removeDocumentElement(e, doc) }}>&#10006;</button></li></div>
                                }) }
                                    {notes.length > 0 && documentsSubmitted.length > 0 ? <div style={{marginBottom: '10px'}}></div> : null}
                                    {notes.length > 0 ? <h4>Notes</h4> : null }
                                    { notes.map((note, index) => {
                                    return <div><li key = {index}>{index + 1}) {note} <button type="button" onClick={(e) => { removeNoteElement(e, note) }}>&#10006;</button></li></div>
                                }) }
                                </div>
                            </div>
                            
                            <br />
                        </div>
                        <input type="submit" name="Submit" value="Create Application"/>
                    </form>
            </div>
        </div>
    )
}
