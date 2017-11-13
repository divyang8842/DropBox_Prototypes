import React, {Component} from 'react';
import Group from "./Group";
import Groups from "./Groups";
import * as API from '../api/API';
import NavBar from "../components/Navbar";
import {withRouter} from 'react-router-dom';


var fullscreen={position: 'fixed',
    top: '0',
    left: '0',
    bottom: '0',
    right:'0',
    overflow: 'auto',
    background: 'white'}

class UserGroup extends Component {

    state = {
        groupInfo :[],
        groupMembers : [],
        groupName:'',
        groupMember :'',
        count :0
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

    updateGroup = (group) =>{
        //alert("group : "+ JSON.stringify(group) );
        this.setState({
            groupName :group.groupname,
            groupMembers : group.memberjson
        });
    }

    setUserGroup = (groupData) => {
        var data = {'data':groupData};
        API.setUserGroup(data)
            .then((result) => {
                if (result.status == 201) {
                    alert("Group saved successfully.");
                } else if (result.status == 401) {
                    alert("Error while saving user group.");
                }
            });
    };

    componentWillMount(){
        var userid = localStorage.getItem('token');
        var data = {'userid':userid};
        API.getUserGrpups(data).then((resData) => {
             //alert("data is "+JSON.stringify(resData));
            if (resData.status == 201) {
                this.setState({
                    groupInfo :resData.groups,
                    groupName : '',
                    groupMembers : [],
                    groupMember : '',
                    count : this.state.groupMembers.length
                })
            }else if(resData.status==501){
                localStorage.removeItem("token");
                localStorage.removeItem("root");
                this.getHome();
            }
        });
    };

    addItem(userEmail){
        var data = {'email':userEmail, 'index':this.state.count};
        var jsonArry = this.state.groupMembers;
        jsonArry.push(data);
        this.setState({
            count: this.state.count+1,
            groupMembers : jsonArry
        },alert("User added successfully"));

    }

    removeItem(index){

        var jsonArry = this.state.groupMembers;
        jsonArry.slice(index,1);
        this.setState({
            groupMembers : jsonArry
        },alert("User removed successfully"));
    }

    render() {
        //console.log(this.props);

        return (
            <div  style={fullscreen}>
                <NavBar goToPath={this.goToPath} page = {"usergroup"} getUserLogs={this.getUserLogs} getUserProfile={this.getUserProfile}  getHome={this.getHome} shareFile={this.getHome}   signout= {this.signout}></NavBar>

                <div className="row justify-content-md-center">
                    <div className="col-md-6">
                        <h2 className="text-center">User Groups</h2>
                    </div>
                </div>
                <hr/>

                <div className="row justify-content-md-center">
                    <div className="card col-md-6">
                        <div className="card-body">
                            {
                                this.state.groupInfo.map((group,index) => {
                                    return(
                                        <Groups updateGroup = {this.updateGroup}
                                               key={index}
                                               item={group}
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>


                <div className="row justify-content-md-center">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input
                                className="form-control"
                                value = {this.state.groupName}
                                type="text"
                                placeholder="Enter Group Name"
                                onChange={(event) => {
                                 //   const value=event.target.value
                                    this.setState({
                                        groupName: event.target.value
                                    });
                                }}
                            />

                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter user email address"
                                onChange={(event) => {
                                  //  const value=event.target.value
                                    this.setState({
                                        groupMember: event.target.value
                                    });
                                }}
                            />
                        </div>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                               // alert(this.state.groupMember);
                                this.addItem(this.state.groupMember)
                            }}
                        >Add</button>

                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                // alert(this.state.groupMember);
                                this.setUserGroup(this.state)
                            }}
                        >Save</button>
                    </div>
                </div>

                <hr/>
                <div className="row justify-content-md-center">
                    <div className="card col-md-6">
                        <div className="card-body">
                            {
                                this.state.groupMembers.map((member,index) => {
                                    return(
                                        <Group removeItem = {this.removeItem}
                                            key={index}
                                            item={member}
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UserGroup);
