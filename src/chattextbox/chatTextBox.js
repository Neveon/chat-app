import React from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';

class ChatTextBoxComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            chatText: ''
        };
    }

    render() {

        const { classes } = this.props;

        return(
            <div className={classes.chatTextBoxContainer}>
                <TextField placeholder='Type your message'
                    onKeyUp={(e) => this.userTyping(e)}
                    id='chattextbox'
                    className={classes.chatTextBox}
                    onFocus={this.userClickedInput}></TextField>
                <Send onClick={this.submitMessage}
                    className={classes.Btn}></Send>
            </div>
        );
    }

    submitMessage = () => {
        if(this.messageValid(this.state.chatText)) {
            // call parent function
            this.props.submitMessageFn(this.state.chatText);
            document.getElementById('chattextbox').value = '';
        }
    }

    userClickedInput = () => {
        console.log('clicked input');
    }

    userTyping = (e) => {
        e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });
        
    }
    // Checking empty spaces
    messageValid = (txt) =>  txt && txt.replace(/\s/g,'').length; 
}

export default withStyles(styles)(ChatTextBoxComponent);