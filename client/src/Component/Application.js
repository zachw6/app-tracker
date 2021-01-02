import React from 'react'
import {useState, useEffect} from 'react';
import '../css/dashboard.css'

const moment = require('moment');

export default function Application(props) {

    const [droppedDown, setDroppedDown] = useState(false);

    const toggleDropDown = () => {
        setDroppedDown(!droppedDown);
    }

    if(droppedDown){
        return (        
        <div className="applicationContainer">
        <div className="applicationHeader"><div className="companyPosition"><span style={{fontWeight: 'bold'}}>{props.companyName}</span> - {props.position}</div><div className="appliedDate">Applied: {moment(props.appliedDate).format('MM/DD/YYYY')}</div></div>
        <div className="applicationBody">
            <div><span style={{fontWeight: 'bold'}}>Status: </span> {props.status} {props.status === "Interview Scheduled" ? "(" + moment(props.interviewTime).format('MM/DD/YYYY h:mm A') + ")" : null}</div>
            <div><span style={{fontWeight: 'bold'}}>Location: </span> {props.location}</div>
            <div><span style={{fontWeight: 'bold'}}>Interviewer: </span> {props.interviewer}</div>
            <div><span style={{fontWeight: 'bold'}}>Follow-Up: </span> {props.followUp ? "True" : "False"}</div>
            <div><span style={{fontWeight: 'bold'}}>Documents Submitted: </span> {props.documentsSubmitted.map( (doc) => { return <li key={doc}>{doc}</li> })}</div>
            <div><span style={{fontWeight: 'bold'}}>Additional Notes: </span> {props.notes.map ( (note) => { return <li key={note}>{note}</li>})}</div>
        </div>
        <button onClick={toggleDropDown} className="applicationFooter">LESS DETAILS</button>
    </div>)
    } else {
        return (        
        <div className="applicationContainer">
        <div className="applicationHeader"><div className="companyPosition"><span style={{fontWeight: 'bold'}}>{props.companyName}</span> - {props.position}</div><div className="appliedDate">Applied: {moment(props.appliedDate).format('MM/DD/YYYY')}</div></div>        <div className="applicationBody">
            <div><span style={{fontWeight: 'bold'}}>Status: </span> {props.status} {props.status === "Interview Scheduled" ? "(" + moment(props.interviewTime).format('MM/DD/YYYY h:mm A') + ")" : null}</div>
            <div><span style={{fontWeight: 'bold'}}>Location: </span> {props.location}</div>
        </div>
        <button onClick={toggleDropDown} className="applicationFooter">MORE DETAILS</button>
    </div>)
    }
}
