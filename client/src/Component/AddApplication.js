import React from 'react';
import '../css/dashboard.css';
import '../css/addApplicationStyles.css'
import axios from 'axios';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import {useState} from 'react'

export default function AddApplication(props) {

    const [appliedDate, setAppliedDate] = useState(new Date());
    const [interviewTime, setInterviewTime] = useState(new Date());
    const [documentsSubmitted, setDocumentsSubmitted] = useState([]);
    const [notes, setNotes] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [documentSelector, setDocumentSelector] = useState("Resume");

    const addSubmittedDocument = () => {
        let documentsSubmittedCopy = [...documentsSubmitted];
        if(documentSelector === "Other" && !documentsSubmittedCopy.includes(document.getElementById("otherDocument").value)){
            documentsSubmittedCopy.push(document.getElementById("otherDocument").value)
            setDocumentsSubmitted(documentsSubmittedCopy);
            return;
        }
        if(documentSelector === "Other" && documentsSubmittedCopy.includes(document.getElementById("otherDocument").value)){
            return;
        }
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

    const addContact = () => {
        // Disallow adding a contact without a company or email.
        if(document.getElementById('contactName').value === "" || document.getElementById('contactRole').value === ""){
            alert("Your contact must have a name and a role to be created.");
            return;
        }
        let contactsCopy = [...contacts];
        contactsCopy.push({
            contactName: document.getElementById('contactName').value,
            contactRole: document.getElementById('contactRole').value,
            contactEmail: document.getElementById('contactEmail').value
        });
        setContacts(contactsCopy);
        document.getElementById('contactName').value = "";
        document.getElementById('contactRole').value = "";
        document.getElementById('contactEmail').value = "";
        
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

    const updateDocumentSelector = () => {
        setDocumentSelector(document.getElementById("submittedDocument").value);
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

    const removeContactElement = (e, index) => {
        let contactsCopy = [...contacts];
        // Search each object in the array for the email.
        contactsCopy.splice(index, 1);
        setContacts(contactsCopy);
    }

    const createApplication = (event) => {
        event.preventDefault();
        axios({
          method: "POST",
          url: "https://www.apptracker.app/user/createApplication",
          data: {token: localStorage.getItem('loginToken'), 
          appData: 
            {
            companyName: document.getElementById('companyName').value,
            position: document.getElementById('position').value,
            appliedDate: appliedDate,
            status: document.getElementById('status').value,
            interviewTime: interviewTime,
            location: document.getElementById('location').value,
            contacts: contacts,
            followUp: document.getElementById('followUp').value,
            documentsSubmitted: documentsSubmitted,
            notes: notes
            }
        }
      }).then(res => {
          if(res.data.access !== "denied"){
              props.getApplications();
              props.toggleAdding();
          }
      });
    }

    return (
        <div className="addApplication">
            <div className="addApplicationContainer">
                <div className="addApplicationHeader"><h2>Add Application</h2><button className="blueButton" onClick={props.toggleAdding}>&#10006;</button></div>
                    <form className="addApplicationForm" onSubmit={createApplication}>
                        <div className="formContainer">
                            {/* Right side of form */ }
                            <div className="leftSideForm">
                                <h3 className="addApplicationTitle">Company Name <span style={{color: '#fb2424', fontSize:'0.6em'}}>(REQUIRED)</span></h3><input required type="text" name="companyName" id="companyName"></input><br />
                                <h3 className="addApplicationTitle">Position <span style={{color: '#fb2424', fontSize:'0.6em'}}>(REQUIRED)</span></h3><input required type="text" name="position" id="position"></input><br />
                                <h3 className="addApplicationTitle">Applied <span style={{color: '#fb2424', fontSize:'0.6em'}}>(REQUIRED)</span></h3><div style={{width: '100%'}}><DatePicker required selected={appliedDate} onChange={date => setAppliedDate(date)} /></div>
                                
                                <h3 className="addApplicationTitle">Status <span style={{color: '#fb2424', fontSize:'0.6em'}}>(REQUIRED)</span></h3>
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
                                <h3 className="addApplicationTitle">Location </h3><input type="text" name="location" id="location"></input>
                                <h3 className="addApplicationTitle">Contacts </h3>
                                    <input type="text" name="contactName" id="contactName" placeholder="Contact's Name"></input>
                                    <input style={{margin: "0.5em 0 0 0"}} type="text" name="contactRole" id="contactRole" placeholder="Contact's Role"></input>
                                    <input style={{margin: "0.5em 0 0 0"}} type="text" name="contactEmail" id="contactEmail" placeholder="Contact's Email"></input>
                                    <button type="button" className="blueButton" onClick={addContact}>Add Contact</button> <br />

                                <h3 className="addApplicationTitle">Follow-Up </h3>
                                <div className="addApplicationSelect"><select required name="followUp" id="followUp">
                                    <option value="false">Incomplete</option>
                                    <option value="true">Complete</option>
                                </select></div>
                                <br />
                            </div>

                            {/* Left side of form */ }
                            <div className="rightSideForm">
                                <h3 className="addApplicationTitle">Documents Submitted </h3>
                                <div className="addApplicationSelect"><select required name="submittedDocument" id="submittedDocument" onChange={updateDocumentSelector}>
                                    <option value="Resume">Resume</option>
                                    <option value="Cover Letter">Cover Letter</option>
                                    <option value="Transcript">Transcript</option>
                                    <option value="Portfolio">Portfolio</option>
                                    <option value="Letters of Recommendation">Letters of Recommendation</option>
                                    <option value="References List">References List</option>
                                    <option value="Other">Other</option>
                                </select> </div>
                                {documentSelector === "Other" ? 
                                    <div style={{margin: "0.5em 0 0 0"}}><input type="text" name="otherDocument" id="otherDocument" placeholder="Other Document Title"></input></div>
                                : null}
                                <button type="button" className="blueButton" onClick={addSubmittedDocument}>Add Document</button> <br />
                                
                                <h3 className="addApplicationTitle">Notes </h3><textarea type="text" name="note" id="note"></textarea><br />
                                <button type="button" className="blueButton" onClick= { () => { 
                                    addNote(); 
                                    document.getElementById('note').value = ""; 
                                    } }  >Add Note</button>

                                <div className="notesDocsContainer">
                                    
                                    {contacts.length > 0 ? <h4>Contacts </h4> : null }
                                    { contacts.map((contact, index) => {
                                    return <div key = {"contact" + index}><li>{index + 1}) {contact.contactRole + ": " + contact.contactName + (contact.contactEmail !== "" ? " (" + contact.contactEmail + ")": "")} <button type="button" onClick={(e) => { removeContactElement(e, index) }}>&#10006;</button></li></div>
                                }) }
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
                        <input type="submit" name="Submit" value="Create Application"/>
                    </form>
            </div>
        </div>
    )
}
