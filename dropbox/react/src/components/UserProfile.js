import React, {Component} from 'react';
import PropTypes from 'prop-types';

import * as API from '../api/API';
import NavBar from "../components/Navbar";


var fullscreen={position: 'fixed',
    top: '0',
    left: '0',
    bottom: '0',
    right:'0',
    overflow: 'auto',
    background: 'white'}

class UserProfile extends Component {

    static propTypes = {
        userid: PropTypes.string.isRequired,
        logs: PropTypes.string.isRequired
    };

    state = {
        userid: '',
        logs: []
    };


    getHome =() =>{

        this.props.getToHome();
    }

    getUserLogs =() =>{
        this.props.history.push('/userprofile');
    }

    signout = () => {
        this.props.history.push("/login");
    };

    componentWillMount(){
        var userid = localStorage.getItem('token');
        var data = {'userid':userid};
        API.getUserLogs(data).then((resData) => {
            debugger;
            if (resData.status == 201) {
                this.setState({
                    logs: resData.logs
                });
            }else if(resData.status==501){
                localStorage.removeItem("token");
                localStorage.removeItem("root");
                this.props.history.push('/login');
            }
        });

    }

    render() {

        console.log(JSON.stringify(this.state.logs));

        var totStyle={float:'right',fontSize:25};
        var totStyle1={float:'left', fontSize:25};
        var borderStyle={borderStyle: 'inset', backgroundColor:'lightBlue'};
        var flr={float:'right'};
        var mr80={marginRight:100};
        var bgcolor={backgroundColor:'lightgrey'};

        var pt15={paddingTop:15};
        const todoClass = `alert `;


        return (
            <div style={fullscreen}>
                <NavBar page = {"userprofile"} getUserLogs={this.getUserLogs}  getHome={this.getHome}   signout= {this.signout}></NavBar>

            <div className="container-fluid" >
                <div className="row justify-content-md-center">
                    <div className="col-md-6">
                        <h2 className="text-center">User Profile</h2>
                    </div>

                </div>
                <hr/>

                <hr/>
                <div className="row justify-content-md-center" >

                    <div className="card col-sm-4"  >
                        <div className="card-body">
                            <h4>User Logs</h4>
                            {
                                this.state.logs.map((log,index) => {
                                        return (
                                            <div className="row justify-content-md-center">
                                                <div className="col-md-12">
                                                    <div className={todoClass} style={bgcolor} role="alert">
                                                        <div style={mr80}>File Name : { log.name } </div>
                                                        <div style={mr80}>File Path : { log.path } </div>
                                                        <div>  <span>Operation : {log.operation}</span></div>
                                                        <div>
                                                                <span aria-hidden={true}>Date Time : {log.operationtime}</span>
                                                        </div>
                                                    </div>
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

export default UserProfile;