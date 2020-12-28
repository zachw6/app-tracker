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
            document.getElementsByClassName('interviewSchedule')[0].style.display = "inline-block";
        } else {
            document.getElementsByClassName('interviewSchedule')[0].style.display = "none";
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
        <div className="addApplication" style={{width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display:'flex', justifyContent: 'center', alignItems: 'center', position:'absolute'}}>
            <div style={{width: '80%', height: '80%', backgroundColor: '#f0f0f0', borderRadius: '15px', position: 'relative'}}>
                <button onClick={props.toggleAdding} style={{position: 'absolute', top: '10px', right: '20px', border: 'none', outline: 'none', fontSize: '36px', color: '#e33b32'}}>&#10006;</button>
                <div style={{margin: '20px'}}>
                    <h2 style={{color: '#101010', fontSize: '30px'}}>Add Application</h2>
                    <form onSubmit={createApplication}>
                        <h3 className="addApplicationTitle">Company Name*: </h3> <input required type="text" name="companyName" id="companyName"></input><br />
                        <h3 className="addApplicationTitle">Position*: </h3><input required type="text" name="position" id="position"></input><br />
                        <h3 className="addApplicationTitle">Applied*: </h3><DatePicker required selected={appliedDate} onChange={date => setAppliedDate(date)} /><br />
                        
                        <h3 className="addApplicationTitle">Status*: </h3>
                        <select required onChange={checkInterviewScheduled} name="status" id="status">
                        <option value="Application Sent">Application Sent</option>
                        <option value="In Communication">In Communication</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Pending Response">Pending Response</option>
                        <option value="Job Offer">Job Offered</option>
                        <option value="Job Accepted">Job Accepted</option>
                        <option value="Rejected">Rejected</option>
                        </select><span className="interviewSchedule">Date/Time: <DatePicker selected={interviewTime} onChange={date => setInterviewTime(date)} showTimeSelect dateFormat="Pp" timeFormat="p" /></span><br />
                        <h3 className="addApplicationTitle">Interviewer: </h3><input type="text" name="interviewer" id="interviewer"></input><br />
                        <h3 className="addApplicationTitle">Follow-Up: </h3>
                        <select required name="followUp" id="followUp">
                        <option value="false">Incomplete</option>
                        <option value="true">Complete</option>
                        </select><br />

                        <h3 className="addApplicationTitle">Documents Submitted: </h3>
                        <select required name="submittedDocument" id="submittedDocument">
                        <option value="Resume">Resume</option>
                        <option value="Cover Letter">Cover Letter</option>
                        <option value="Transcript">Transcript</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Letters of Recommendation">Letters of Recommendation</option>
                        <option value="References List">References List</option>
                        <option value="Other">Other</option>
                        </select> <button type="button" onClick={addSubmittedDocument}>Add Document</button> <br />
                        { documentsSubmitted.map((doc, index) => {
                            return <div><li key = {index}>{doc}</li><button type="button" onClick={(e) => { removeDocumentElement(e, doc) }}>Remove Document</button></div>
                        }) }
                        <br />

                        <h3 className="addApplicationTitle">Notes: </h3><input type="text" name="note" id="note"></input><br />
                        <button type="button" onClick= { addNote } >Add Note</button>
                        { notes.map((note, index) => {
                            return <div><li key = {index}>{note}</li><button type="button" onClick={(e) => { removeNoteElement(e, note) }}>Remove Note</button></div>
                        }) }
                        <input type="submit" name="Submit" />
                    </form>
                </div>
            </div>
        </div>
    )
}
