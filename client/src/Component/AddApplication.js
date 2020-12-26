import React from 'react';
import '../css/dashboard.css';
import axios from 'axios';

export default function AddApplication(props) {

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
            applied: document.getElementById('applied').value,
            status: document.getElementById('status').value,
            interviewer: document.getElementById('interviewer').value,
            followUp: document.getElementById('followUp').value,
            documentsSubmitted: document.getElementById('documentsSubmitted').value
            }
        }
      }).then(res => {
          if(res.data.access === "denied"){

          } else {
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
                        <h3 className="addApplicationTitle">Company Name: </h3> <input type="text" name="companyName" id="companyName"></input><br />
                        <h3 className="addApplicationTitle">Position: </h3><input type="text" name="position" id="position"></input><br />
                        <h3 className="addApplicationTitle">Applied: </h3><input type="text" name="applied" id="applied"></input><br />
                        <h3 className="addApplicationTitle">Status: </h3><input type="text" name="status" id="status"></input><br />
                        <h3 className="addApplicationTitle">Interviewer: </h3><input type="text" name="interviewer" id="interviewer"></input><br />
                        <h3 className="addApplicationTitle">Follow-Up: </h3><input type="text" name="followUp" id="followUp"></input><br />
                        <h3 className="addApplicationTitle">Documents Submitted: </h3><input type="text" name="documentsSubmitted" id="documentsSubmitted"></input><br />
                        <input type="submit" name="Submit" />
                    </form>
                </div>
            </div>
        </div>
    )
}
