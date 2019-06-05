import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, BrowseRouter as Router } from 'react-router-dom';
import LoginComponent from './login/login';
import SignupComponent from './signup/signup';
import DashboardComponent from './dashboard/dashboard';

// firebase
const firebase = require("firebase");
require("firebase/firestore");
// In a production app, the API information will not be shown here.
// It will be taken from a databse over an encrypted line such as https
firebase.initializeApp({
    apiKey: "AIzaSyA_fQVKTHcb2NyhjhKaHEDw83gRfgIB-sg",
    authDomain: "im-tutorial-df519.firebaseapp.com",
    databaseURL: "https://im-tutorial-df519.firebaseio.com",
    projectId: "im-tutorial-df519",
    storageBucket: "im-tutorial-df519.appspot.com",
    messagingSenderId: "331456086232",
    appId: "1:331456086232:web:48e4fb25ea4293de"
});

const routing = (
    <Router>
        <div id='routing-container'>
            <Route path='/login' component={LoginComponent}></Route>
            <Route path='/login' component={SignupComponent}></Route>
            <Route path='/login' component={DashboardComponent}></Route>
        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
