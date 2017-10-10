import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as API from '../api/API';


import Files from 'react-files'

import { Button, Form, FormControl, FormGroup, Col, ControlLabel, Checkbox } from 'react-bootstrap';

class Welcome extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired,
        uploadFile: PropTypes.func.isRequired

    };
    state = {
        fileName:'',
        lastModifiedDate:'',
        size:'',
        type:'',
        data_uri:'',
        filelist:[],
        pathTrack:[],
        isSelfCall:false,
        root:'',
        userId:'',
        rootDir:''

    };


    componentWillMount(){
        debugger;

        var userid = localStorage.getItem("token");
        var root = localStorage.getItem("root");

            this.setState({
                root:root,
                userId:userid

            });

        this.getChildDir(root);

            document.title = `Welcome, ${userid} !!`;

    }

    getBack = () =>{
        console.log('aya kaka');
        debugger;
        if(this.state.pathTrack.length>1){
            this.getChildDir(this.state.pathTrack[this.state.pathTrack.length-2]);
            this.state.pathTrack.splice(this.state.pathTrack.length-2, 2);
        }else{
            this.getChildDir(this.state.root);
            this.state.pathTrack.splice(this.state.pathTrack.length-1, 1);
        }

    };


    handleFile= (event) =>{

        const payload = new FormData();

        payload.append('myFile', this.ref.myFile);

        API.doUpload(payload)
            .then((status) => {
                if (status === 204) {

                }
            });
        };


    getChildDir= (filepath) =>{
        console.log('data = '+filepath);
        var data = {'dir':filepath};
        API.getChildDirs(data)
            .then((res) => {
                this.state.pathTrack.push(filepath);
                this.setState({
                    filelist: res,
                    isSelfCall:true
                });
            })
    };


    render(){

        debugger;
        var filelist1 = [];
        if(this.state.filelist && this.state.filelist!=''){
            filelist1 = this.state.filelist;
        }
        var username = this.state.userid;

        return(
            <div >
                <span className="alert alert-warning" role="alert"> {username}, Welcome to Dropbox..!!</span>
                        <div>
                        <input type="file"
                               ref="myFile"
                           name="myFile"
                           />
                            <Button  onClick={() => this.handleFile} bsSize="Small" bsStyle="success" block>Signup</Button>
                         </div>
                <Button onClick={() => this.getBack()}>
                   back
                </Button>

                <ul>
                    <ul>


                        {filelist1.map((file, i) =>
                            <li key={i} >
                                {file.isFolder==true ?
                                    (<button onClick={() => this.getChildDir(file.path)}>
                                        {file.name}
                                    </button>)
                                    :
                                    (<span>
                                        {file.name}
                                    </span>)}

                            </li>
                        )}
                    </ul>
                </ul>


            </div>
        )
    }
}

export default withRouter(Welcome);