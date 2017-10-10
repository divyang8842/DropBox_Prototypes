import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
import SignUp from "./SignUp";


class NewerHomePage extends Component {

    state = {
        isLoggedIn: false,
        message: '',
        username: '',
        filelist:[],
        root:'',
        userId:'',
        rootDir:''
    };

    render() {
        return (
            <div className="container-fluid">
                <Route exact path="/" render={() => (
                    <div>
                        <Message message="Welcome to my App !!"/>
                        <button className="btn btn-success" onClick={() => {
                            this.props.history.push("/login");
                        }}>
                            Click to Login
                        </button>
                    </div>
                )}/>

                <Route exact path="/login" render={() => (
                    <div>
                        <Login handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/welcome" render={() => (
                    <Welcome data={this.state}/>
                )}/>

                <Route exact path="/signUp" render={() => (
                    <div>
                    <SignUp handleSignUp={this.handleSignUp} />
                    <Message message={this.state.message}/>
                    </div>

                    )}/>
            </div>
        );
    }

    handleSubmit = (userdata) => {
        //alert(JSON.stringify(userdata));
        API.doLogin(userdata)
            .then((status) => {
            console.log(JSON.stringify(status));
                if (status.status == 200) {
                    alert(JSON.stringify(status));
                    localStorage.setItem("token", status.userid);
                    localStorage.setItem("root", status.root);
                    this.setState({
                        isLoggedIn: true,
                        message: "Welcome to Dropbox..!!",
                        username: status.username,
                        filelist:status.filelist,
                        root:status.root,
                        userId:status.userid
                    });
                    this.props.history.push("/welcome");
                } else if (status.status == 401) {
                    localStorage.setItem("token", null);
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };

    handleSignUp = (userdata) => {
        //alert(JSON.stringify(userdata));
        API.doSignUp(userdata)
            .then((status) => {
            alert(JSON.stringify(status));
                if (status === 200) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Signup Successfull..!!",
                    });
                    this.props.history.push("/login");
                } else if (status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        message: "SignUp Failed"
                    });
                }
            });
    };

}

export default withRouter(NewerHomePage);