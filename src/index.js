import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import LoginComponent from './login/login';
import SignupComponent from './signup/signup';
import DashboardComponent from './dashboard/dashboard';

// firebase
const firebase = require("firebase");
require("firebase/firestore");
// In a production app, the API information will not be shown here.
// It will be taken from a databse over an encrypted line such as https
firebase.initializeApp({
    apiKey: "TAKEN DOWN",
    authDomain: "TAKEN DOWN",
    databaseURL: "TAKEN DOWN",
    projectId: "TAKEN DOWN",
    storageBucket: "TAKEN DOWN",
    messagingSenderId: "TAKEN DOWN",
    appId: "TAKEN DOWN"
});

const routing = (
    <Router>
        <div id='routing-container'>
            <Route path='/login' component={LoginComponent}></Route>
            <Route path='/signup' component={SignupComponent}></Route>
            <Route path='/dashboard' component={DashboardComponent}></Route>
        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
