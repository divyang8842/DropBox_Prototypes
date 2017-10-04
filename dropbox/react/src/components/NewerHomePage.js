import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
/*import ListDir from "./ListDirectory";*/
import SignUp from "./SignUp";

class NewerHomePage extends Component {

    state = {
        isLoggedIn: false,
        message: '',
        username: ''
    };

    handleLogin = (userdata) => {
        API.doLogin(userdata)
            .then((status) => {
            console.log(JSON.stringify(status));
                if (status.status === '201') {
                    this.setState({
                        isLoggedIn: true,
                        message: "Welcome to DropBox..!!",
                        username: userdata.username
                    });
                  //  this.props.history.push("/ListDir");
                } else if (status === '401') {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };

    handleSignup = (userdata) => {
        API.doSignup(userdata)
            .then((status) => {
                console.log(JSON.stringify(status));
                if (status.status === '201') {
                    this.setState({
                        isLoggedIn: false,
                        message: status.message
                    });
                    this.props.history.push("/Login");
                } else if (status === '401') {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };


    render() {
        return (
            <div className="container-fluid">
                <Route exact path="/" render={() => (
                    <div>
                        <Message message="You have landed on my App !!"/>
                        <button className="btn btn-success" onClick={() => {
                            this.props.history.push("/login");
                        }}>
                            Login
                        </button>
                    </div>
                )}/>

                <Route exact path="/login" render={() => (
                    <div>
                        <Login handleSubmit={this.handleLogin}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>

                <Route exact path="/SignUp" render={() => (
                    <div>
                        <SignUp handleSubmit={this.handleSignup}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>

                <Route exact path="/welcome" render={() => (
                    <Welcome username={this.state.username}/>
                )}/>

               {/* <Route exact path="/listdir" render={() => (
                    <ListDir username={this.state.username}/>
                )}/>*/}
            </div>
        );
    }
}

export default withRouter(NewerHomePage);