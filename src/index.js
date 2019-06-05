import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
    apiKey: "AIzaSyA_fQVKTHcb2NyhjhKaHEDw83gRfgIB-sg",
    authDomain: "im-tutorial-df519.firebaseapp.com",
    databaseURL: "https://im-tutorial-df519.firebaseio.com",
    projectId: "im-tutorial-df519",
    storageBucket: "im-tutorial-df519.appspot.com",
    messagingSenderId: "331456086232",
    appId: "1:331456086232:web:48e4fb25ea4293de"
});
// In a production app, the API information will not be shown here.
// It will be taken from a databse over an encrypted line such as https

ReactDOM.render(<div>Hello World</div>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
