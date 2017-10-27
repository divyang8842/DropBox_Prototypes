import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter } from 'react-router-dom';
import FormErrors from "./FormErrors";
import logo from '../images/dropbox_logo740.png'

import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import { FormControl, Checkbox } from 'react-bootstrap';


class Login extends Component {

    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    };

    state = {
        email: '',
        username:'',
        password: '',
        formErrors: {email: '', password: ''},
        emailValid: false,
        passwordValid: false,
        formValid: false,
        type:false
    };

    componentWillMount(){
        this.setState({
            email: '',
            password: '',
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            formValid: false,
            type:false

        });
    }

    validateField(fieldName, value) {


        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch(fieldName) {

            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 3;
                fieldValidationErrors.password = passwordValid ? '': ' is too short';
                break;

            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid,
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }

    errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }



    render() {
        var bgcolor = {backgroundColor:'dodgerblue'};
        var panelBg = {backgroundColor:'lightblue'};
        var color = {color:'blue'};
        return (
            <div className="col-md-4 col-md-offset-4">
                <div className="text-center"><img src={logo}  height="100" width="200"/>

                </div>
                <div className="row justify-content-md-center">
                    <Panel>
                        { this.state.type && this.state.formErrors &&(
                            <div className="alert alert-danger" role="alert">
                                <FormErrors formErrors={this.state.formErrors} />
                            </div>)
                        }
                    </Panel>
                </div>
                <Panel header={<h3 >Please Sign In</h3>} style={panelBg} className="login-panel">

                    <form  >
                        <fieldset>
                            <div className="form-group" controlId="formHorizontalEmail">
                                <FormControl className={`form-group ${this.errorClass(this.state.formErrors.email)}`}
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={(event) => {
                                        const name="email"
                                        const value=event.target.value
                                        this.setState({
                                            email: event.target.value,
                                            username:event.target.value,
                                            type:true

                                        }, () => { this.validateField(name, value) });
                                    }} required autofocus
                                />
                            </div>

                            <div className="form-group" controlId="formHorizontalPassword">
                                <FormControl className={`form-group ${this.errorClass(this.state.formErrors.password)}`}
                                    type="password"
                                    name="password"
                                             value={this.state.password}
                                    placeholder="Password"
                                    onChange={(event) => {
                                        const name="password"
                                        const value=event.target.value
                                        this.setState({
                                            password: event.target.value,
                                            type:true
                                        }, () => { this.validateField(name, value) });
                                    }} required
                                />
                            </div>

                            <Button style={bgcolor} disabled={!this.state.formValid} onClick={() => this.props.handleSubmit(this.state)} bsSize="large" bsStyle="success" block>Login</Button>
                            <Button style={bgcolor} onClick={() => { this.props.history.push("/signUp");}} bsSize="large" bsStyle="success" block>Sign Up</Button>
                        </fieldset>
                    </form>
                </Panel>
            </div>
        );


    }


}

export default withRouter (Login);