import React from 'react';
import ChatListComponent from '../chatList/chatList';
import styles from './styles';
import { Button, withStyles } from '@material-ui/core';
import ChatViewComponent from '../chatview/chatView';
import ChatTextBoxComponent from '../chattextbox/chatTextBox';
import NewChatComponent from '../newchat/newChat';
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
                    <ChatTextBoxComponent messageReadFn={this.messageRead} submitMessageFn={this.submitMessage}></ChatTextBoxComponent>
                    : null
                }
                {
                    this.state.newChatFormVisible ? <NewChatComponent goToChatFn={this.goToChat} newChatSubmitFn={this.newChatSubmit}></NewChatComponent> : null
                }
                <Button className={classes.signOutBtn} onClick={this.signOut}>Sign Out</Button>
            </div>
        );
    }

    goToChat = async (docKey, msg) => {
        const usersInChat = docKey.split(':');
        const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
        this.setState({ newChatFormVisible: false });
        await this.selectChat(this.state.chats.indexOf(chat));
        this.submitMessage(msg);
    }

    newChatSubmit = async (chatObj) => {
        const docKey = this.buildDocKey(chatObj.sendTo);
        await firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .set({
                receiverHasRead: false,
                users: [this.state.email, chatObj.sendTo],
                messages: [{
                    message: chatObj.message,
                    sender: this.state.email
                }]
            })
        this.setState({ newChatFormVisible: false });
        this.selectChat(this.state.chats.length - 1);
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

    selectChat = async (chatIndex) => {
        await this.setState({selectedChat: chatIndex, newChatFormVisible: false}); // Finishes before calling next function
        this.messageRead();

    }

    newChatBtnClicked = () => {
        this.setState({
            newChatFormVisible: true,
            selectedChat: null
        });
    }

    messageRead = () => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
        if(this.clickedChatWhereNotSender(this.state.selectedChat)) {
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .update({ receiverHasRead: true })
        } else {
            console.log('Clicked message where the user was the sender');
        }
    }

    // Notifications of messages for receiver, no notification for sender
    clickedChatWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;

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