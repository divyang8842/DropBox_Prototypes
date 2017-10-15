import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
import SignUp from "./SignUp";
import UserProfile from "./UserProfile";
import logo from '../images/dropbox_logo740.png';
import ErrorBoundary from "./ErrorHandler"

var link={
    marginRight:-100,
paddingTop:'-80',
outline: 'none',
background: 'none',
color: 'rgb(105, 11, 224)',
fontSize: '18px',
fontWeight: '800',
border: 'none',

}
var pqr={display:'inline-block',textAlign:'left',width:'50%'}

var list={listStyleType:'none',float:'right'}



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
            <div className="mast-head__container container">

                <Route exact path="/" render={() => (
                    <div className="text-center">
                        <img src={logo}  height="100" width="200"/>
                        <nav>
                            <ul style={list} className="nav-list">
                                <li  style={link}  onClick={() => {
                                    this.props.history.push("/login");
                                }}>
                                    Login
                                </li></ul>
                        </nav>
                    </div>
                )}/>


                <Route exact path="/login" render={() => (
                    <div>
                        <Login handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/welcome" render={() => (
                    <ErrorBoundary>
                    <Welcome data={this.state}/>
                    </ErrorBoundary>
                )}/>

                <Route exact path="/signUp" render={() => (
                    <div>
                    <SignUp handleSignUp={this.handleSignUp} />
                    <Message message={this.state.message}/>
                    </div>

                    )}/>

                <Route exact path="/userprofile" render={() => (
                    <ErrorBoundary>
                        <UserProfile getToHome={this.getToHome} data={this.state} />
                    </ErrorBoundary>

                )}/>
            </div>
        );
    }

    handleSubmit = (userdata) => {
        API.doLogin(userdata)
            .then((status) => {
            console.log(JSON.stringify(status));
                if (status.status == 200) {

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

    getToHome = () =>{
        this.props.history.push('/welcome');
    }

    handleSignUp = (userdata) => {
        API.doSignUp(userdata)
            .then((status) => {

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