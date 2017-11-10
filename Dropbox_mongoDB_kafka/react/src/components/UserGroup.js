import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import * as API from '../api/API';
import NavBar from "../components/Navbar";
import { FormControl, Checkbox } from 'react-bootstrap';

var fullscreen={position: 'fixed',
    top: '0',
    left: '0',
    bottom: '0',
    right:'0',
    overflow: 'auto',
    background: 'white'};

class UserGroup extends  Component{
    state = {
        groupInfo :[],
        groupMembers : [],
        groupName:''
    };

    getHome =() =>{
        this.props.getToHome();
    };
    getUserProfile =()=>{
        this.props.goToPath('/userprofile');
    };


    goToPath = (path) =>{
        this.props.goToPath(path);
    };
    getUserLogs =() =>{
        this.props.goToPath('/useractivity');
    };
    signout = () => {
        this.props.signout();
    };

    setUserGroup = (groupData) => {
        API.setUserGroup(groupData)
            .then((status) => {
                if (status === 200) {
                    alert("Group saved successfully.");
                } else if (status === 401) {
                    alert("Error while saving user group.");
                }
            });
    };

    componentWillMount(){
        var userid = localStorage.getItem('token');
        var data = {'userid':userid};
        API.getUserGrpups(data).then((resData) => {
           // alert("data is "+JSON.stringify(resData));
            if (resData.status == 201) {
                this.setState({
                    groupInfo :resData.groups,
                    groupName : '',
                    groupMembers : []
                })
            }else if(resData.status==501){
                localStorage.removeItem("token");
                localStorage.removeItem("root");
                this.getHome();
            }
        });
    };

    render() {
        console.log(JSON.stringify(this.state.groupInfo));
        var totStyle={float:'right',fontSize:25};
        var totStyle1={float:'left', fontSize:25};
        var borderStyle={borderStyle: 'inset', backgroundColor:'lightBlue'};
        var flr={float:'right'};
        var mr80={marginRight:100};
        var bgcolor={backgroundColor:'lightblue'};

        var pt15={paddingTop:15};
        const todoClass = `alert `;


        return (
            <div style={fullscreen}>
                <NavBar goToPath={this.goToPath} page = {"usergroup"} getUserLogs={this.getUserLogs} getUserProfile={this.getUserProfile}  getHome={this.getHome} shareFile={this.getHome}   signout= {this.signout}></NavBar>

                <div className="container-fluid" >
                    <div className="row justify-content-md-center">
                        <div className="col-md-6">
                            <h2 className="text-center">User Groups</h2>
                        </div>

                    </div>
                    <hr/>

                    <hr/>
                    <div className="row justify-content-md-center" >

                        <div className="card col-sm-8">
                            <div className="card-body">
                                <h4>User Logs</h4>
                                {
                                    this.state.groupInfo.map((log,index) => {
                                        return (
                                            <div className="row justify-content-md-center">
                                                <div className="col-md-12">
                                                    {<div className={todoClass} style={bgcolor} role="alert">
                                                        <div style={mr80}>Group Name : { log.groupname } </div>
                                                        <div style={mr80}>Created By : { log.createdBy } </div>
                                                        {/*<div>  <span>Operation : {log.operation}</span></div>
                                                        <div>
                                                            <span aria-hidden={true}>Date Time : {log.operationtime}</span>
                                                        </div>*/}
                                                    </div>}
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UserGroup);