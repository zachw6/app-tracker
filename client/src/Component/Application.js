import React from 'react'
import {useState} from 'react';
import '../css/dashboard.css'

export default function Application(props) {

    const [droppedDown, setDroppedDown] = useState(false);

    const toggleDropDown = () => {
        setDroppedDown(!droppedDown);
    }

    if(droppedDown){
        return (        <div className="applicationContainer">
        <div className="applicationHeader"><span style={{fontWeight: 'bold'}}>{props.companyName}</span> - {props.position} (Applied: {props.appliedDate})</div>
        <div className="applicationBody">
            <div><span style={{fontWeight: 'bold'}}>Status: </span> {props.status}</div>
            <div><span style={{fontWeight: 'bold'}}>Interviewer: </span> {props.interviewer}</div>
            <div><span style={{fontWeight: 'bold'}}>Follow-Up: </span> {props.followUp}</div>
            <div><span style={{fontWeight: 'bold'}}>Documents Submitted: </span> {props.documentsSubmitted}</div>
            <div><span style={{fontWeight: 'bold'}}>Additional Notes: </span> {props.additionalNotes}</div>
        </div>
        <button onClick={toggleDropDown} className="applicationFooter">LESS DETAILS</button>
    </div>)
    } else {
        return (        <div className="applicationContainer">
        <div className="applicationHeader"><span style={{fontWeight: 'bold'}}>{props.companyName}</span> - {props.position} (Applied: {props.appliedDate})</div>
        <div className="applicationBody">
            <div><span style={{fontWeight: 'bold'}}>Status: </span> {props.status}</div>
            <div><span style={{fontWeight: 'bold'}}>Interviewer: </span> {props.interviewer}</div>
        </div>
        <button onClick={toggleDropDown} className="applicationFooter">MORE DETAILS</button>
    </div>)
    }
}
