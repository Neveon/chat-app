import React from 'react';
import ChatListComponent from '../chatList/chatList';
import styles from './styles';
import { Button, withStyles } from '@material-ui/core';
import ChatViewComponent from '../chatview/chatView';
import ChatTextBoxComponent from '../chattextbox/chatTextBox';
const firebase = require('firebase');

class DashboardComponent extends React.Component {
    
    constructor() {
        super();
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: []
        };
    }

    render() {

        const { classes } = this.props;

        return(
            <div>
                <ChatListComponent history={this.props.history}
                    newChatBtnFn={this.newChatBtnClicked}
                    selectChatFn={this.selectChat}
                    chats={this.state.chats}
                    userEmail={this.state.email}
                    selectedChatIndex={this.state.selectedChat}
                />
                {
                    this.state.newChatFormVisible ?
                    null :
                    <ChatViewComponent
                        user={this.state.email}
                        chat={this.state.chats[this.state.selectedChat]}/>
                }
                {
                    this.state.selectedChat !== null && !this.state.newChatFormVisible ?
                    <ChatTextBoxComponent submitMessageFn={this.submitMessage}></ChatTextBoxComponent>
                    : null
                }
                <Button className={classes.signOutBtn} onClick={this.signOut}>Sign Out</Button>
            </div>
        );
    }

    submitMessage = (msg) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_user => _user !== this.state.email)[0]);
        firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    // Add to array of messages in db
                    sender: this.state.email,
                    message: msg,
                    timestamp: Date.now()
                }),
                receiverHasRead: false
            });
    }

    // doc key was in alphabetical order as so - user1:user2
    buildDocKey = (friend) => [this.state.email, friend].sort().join(':');

    signOut = () => {
        firebase.auth().signOut();
    }

    selectChat = (chatIndex) => {
        console.log('index:', chatIndex);
        this.setState({selectedChat: chatIndex});
    }

    newChatBtnClicked = () => {
        this.setState({
            newChatFormVisible: true,
            selectedChat: null
        });
    }

    // Called automatically whenever the component is successfully mounted to the dom
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if(!_usr) {
                this.props.history.push('/login');
            } else { 
                await firebase // Go into collection chats into user array returning user email
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _usr.email)
                    .onSnapshot(async res => { // Realtime updates
                        const chats = res.docs.map(_doc => _doc.data());
                        await this.setState({ // setState is asynchronous
                            email: _usr.email,
                            chats: chats
                        });
                        console.log(this.state);
                    })
            }
        })
    }

}

export default withStyles(styles)(DashboardComponent);