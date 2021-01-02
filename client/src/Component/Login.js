import React from 'react'
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

const clientId = '428799205209-2njsnee31fvi9mhv5nrqah05iffvhm8g.apps.googleusercontent.com';

export default function Login(props) {

    const onSuccess = (res) => {
        axios({
            method: "POST",
            url: "https://www.apptracker.app/login/googlelogin",
            data: {tokenId: res.tokenId}
        }).then(res => {
            if(sessionStorage.getItem('loginToken') == null){
                sessionStorage.setItem('loginToken', res.data.token);
            } else {
                sessionStorage.removeItem('loginToken');
                sessionStorage.setItem('loginToken', res.data.token);
            }
            props.loginFunc(1);
        });
    };

    const onFailure = (res) => {
        props.loginFunc(0);
    }

    return (
        <div>
            Login with Google
            <GoogleLogin 
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}
