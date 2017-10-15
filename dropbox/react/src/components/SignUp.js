import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import FormErrors from "./FormErrors";
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import logo from '../images/dropbox_logo740.png';


import { FormControl, Checkbox } from 'react-bootstrap';

var formstyle= {marginTop: 10, marginLeft:250};
var buttonstyle={marginRight:400};


class SignUp extends  Component{

    static propTypes = {
        handleSignUp: PropTypes.func.isRequired,
    };


    state = {
        firstname: '',
        lastname: '',
        email:'',
        password:'',
        confirmPassword:'',
        formErrors: {firstname: '',lastname: '',email: '', password: '',confirmPassword: ''},
        firstNameValid:false,
        lastNameValid:false,
        emailValid: false,
        passwordValid: false,
        confirmPasswordValid:false,
        formValid: false,
        type:false
    };


    componentWillMount(){
        this.setState({
            firstname: '',
            lastname: '',
            email:'',
            password:'',
            formErrors: {firstname: '',lastname: '',email: '', password: '',confirmPassword: ''},
            firstNameValid:false,
            lastNameValid:false,
            emailValid: false,
            passwordValid: false,
            confirmPasswordValid:false,
            formValid: false,
            type:false
        });
    }

    validateField(fieldName, value) {


        let fieldValidationErrors = this.state.formErrors;
        let firstNameValid=this.state.firstNameValid;
        let lastNameValid=this.state.lastNameValid;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        let confirmPasswordValid=this.state.confirmPasswordValid;

        switch(fieldName) {

            case 'firstname':
                firstNameValid = value.length != 0;
                fieldValidationErrors.firstname = firstNameValid ? '': ' is required';
                break;

            case 'lastname':
                lastNameValid = value.length != 0 ;
                fieldValidationErrors.lastname = lastNameValid ? '': ' is required';
                break;

            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': ' is too short';
                break;
            case 'confirmPassword':
                confirmPasswordValid = value==this.state.password;
                fieldValidationErrors.confirmPassword = confirmPasswordValid ? '': ' does not match';
                break;

            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
            firstNameValid:firstNameValid,
            lastNameValid:lastNameValid,
            emailValid: emailValid,
            passwordValid: passwordValid,
            confirmPasswordValid:confirmPasswordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.passwordValid && this.state.confirmPasswordValid});
    }

    errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }


    render(){
        var bgcolor = {backgroundColor:'dodgerblue'};
        var panelBg = {backgroundColor:'lightblue'};
        var color = {color:'blue'};
        return(
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
                <Panel header={<h3 >Please Sign Up</h3>} style={panelBg} className="login-panel">

                    <form  >
                        <fieldset>
                            <div className="form-group" controlId="formHorizontalPassword">
                            <FormControl className={`form-group ${this.errorClass(this.state.formErrors.firstname)}`}
                                             controlId="firstname"
                                             placeholder="First Name"
                                             type="text"
                                             value={this.state.firstname}
                                             onChange={(event)=>{
                                                 const name="firstname"
                                                 const value=event.target.value
                                                 this.setState({
                                                     firstname:event.target.value,
                                                     type:true
                                                 }, () => { this.validateField(name, value) });
                                             }}
                                             required
                                             autoFocus
                                />
                            </div>

                            <div className="form-group" controlId="formHorizontalPassword">
                                <FormControl className={`form-group ${this.errorClass(this.state.formErrors.lastname)}`}
                                             type="text"
                                             placeholder="Last Name"
                                             value={this.state.lastname}
                                             onChange={(event)=>{
                                                 const name="lastname"
                                                 const value=event.target.value
                                                 this.setState({
                                                     lastname:event.target.value,
                                                     type:true
                                                 }, () => { this.validateField(name, value) });
                                             }}
                                             required
                                />
                            </div>

                            <div className="form-group" controlId="formHorizontalPassword">
                                <FormControl className={`form-group ${this.errorClass(this.state.formErrors.email)}`} controlId="email"
                                             type="email"
                                             name="lastName"
                                             placeholder="Email"
                                             value={this.state.email}
                                             onChange={(event)=>{
                                                 const name="email"
                                                 const value=event.target.value
                                                 this.setState({
                                                     email:event.target.value,
                                                     type:true
                                                 }, () => { this.validateField(name, value) });
                                             }}
                                             required
                                />
                            </div>

                            <div className="form-group" controlId="formHorizontalPassword">
                                <FormControl className={`form-group ${this.errorClass(this.state.formErrors.password)}`} controlId="password"
                                             type="password"
                                             name="password"
                                             placeholder="Password"
                                             value={this.state.password}
                                             onChange={(event)=>{
                                                 const name="password"
                                                 const value=event.target.value
                                                 this.setState({
                                                     password:event.target.value,
                                                     type:true
                                                 }, () => { this.validateField(name, value) });
                                             }}
                                             required
                                />
                            </div>
                            <div className="form-group" controlId="formHorizontalPassword">
                                <FormControl className={`form-group ${this.errorClass(this.state.formErrors.confirmPassword)}`}  controlId="confirmPassword"
                                             type="password"
                                             placeholder="Confirm Password"
                                             name="confirmPassword"
                                             value={this.state.confirmPassword}
                                             onChange={(event)=>{
                                                 const name="confirmPassword"
                                                 const value=event.target.value
                                                 this.setState({
                                                     confirmPassword:event.target.value,
                                                     type:true
                                                 }, () => { this.validateField(name, value) });
                                             }}
                                             required
                                />
                            </div>
                            <Button style={bgcolor} disabled={!this.state.formValid} onClick={() => this.props.handleSignUp(this.state)} bsSize="large" bsStyle="success" block>Signup</Button>
                            <Button style={bgcolor}  onClick={() => { this.props.history.push("/login");}} bsSize="large" bsStyle="success" block>SignIn</Button>

                        </fieldset>
                    </form>

                </Panel>

            </div>


        )
    }
}

export default withRouter(SignUp);
