import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as API from '../api/API';
import logo from '../images/dropbox_logo740.png'
import NavBar from "../components/Navbar"
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import FileDownload from 'react-file-download';

import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    purple500
} from 'material-ui/styles/colors';



import { Button, ListGroup,ListGroupItem,ProgressBar, Form, FormControl, FormGroup, Col, ControlLabel, Checkbox } from 'react-bootstrap';

const style = {margin: 5};


var fullscreen={position: 'fixed',
top: '0',
left: '0',
bottom: '0',
right:'0',
overflow: 'auto',
background: 'white'}

var uploadButton={
    lineHeight: '1',
padding: '0 16',
fontWeight :'500',
border: 'none',
color: '#FFF',
backgroundColor: '#0070E0',

    float:'right',
}

var uploadButton1={
    lineHeight: '1',
    padding: '0 16',
    fontWeight :'500',
    border: 'none',
    color: '#FFF',
    backgroundColor: 'grey',

    float:'right',
}


var choose={position:'relative',top:-5,right:220}
var uploadDiv={ position:'relative',top:20,right:100}

var fileListItems={color:'#0070E0'}

var list={marginTop:80, paddingLeft:40, paddingRight:270}

var del={float:'right',color:'white',marginRight:'10px'}
var fll ={float:'left'};
var flr =  {float:'right'};
var star = {float:'right',marginRight:'50px'}
var mr30 = {marginRight:'30px'}

var backButton={position:'relative',top:70,left:45}
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
        staredList:[],
        pathTrack:[],
        isSelfCall:false,
        root:'',
        userId:'',
        rootDir:'',
        message:''

    };


    componentWillMount(){

        var userid = localStorage.getItem("token");
        var root = localStorage.getItem("root");

            this.setState({
                root:root,
                userId:userid

            });
        this.getChildDir(root);

            document.title = `DropBox !!`;

    }
    getUserProfile =()=>{
        this.props.history.push('/userprofile');
    }

    getUserLogs =() =>{
        this.props.history.push('/useractivity');
    }

    getHome =() =>{
        this.props.history.push('/welcome');
    }
    getBack = () =>{

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
        var pathToUpload = "";
        if(this.state.pathTrack.length>0){
            pathToUpload = (this.state.pathTrack[this.state.pathTrack.length-1]);
        }else{
            pathToUpload = (this.state.root);
        }
        payload.append('myFile', this.refs.myFile.files[0]);
        payload.append('path',pathToUpload);
        API.doUpload(payload)
            .then((res) => {


               if(res.status=='501'){
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');
                }else{
                   this.getChildDir(pathToUpload);
               }
            });
    };

    shareFile= (emailId) =>{

        var data = {'emailId':emailId};
        API.doShareFile(data)
            .then((status) => {
                if (status === 201) {

                }else if(status==501){
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');
                }
            });
    };

    createDir= (dirname) =>{
        var pathToUpload = "";
        if(this.state.pathTrack.length>0){
            pathToUpload = (this.state.pathTrack[this.state.pathTrack.length-1]);
        }else{
            pathToUpload = (this.state.root);
        }
        var data = {'dirName':dirname, 'path': pathToUpload};
        API.doMkdir(data)
            .then((status) => {
                if (status === 201) {
                    this.getChildDir(pathToUpload);
                }else if(status==501){
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');
                }
            });
    };

    shareFile = (emails) =>{
        API.validateEmails({'emails':emails})
            .then((res) =>{
                if(res.status=='201'){
                    if(res.linkShare=='true'){


                        alert("Some of the email provided are not registered with DropBox.\n <br> The file will be shared as a link?");


                }
            }
    });
}
    deleteDir= (filename) =>{
        var pathToUpload = "";
        if(this.state.pathTrack.length>0){
            pathToUpload = (this.state.pathTrack[this.state.pathTrack.length-1]);
        }else{
            pathToUpload = (this.state.root);
        }
        var data = {'dirName':filename, 'path': pathToUpload};
        API.deleteDir(data)
            .then((status) => {

                if (status === 201) {
                    this.getChildDir(pathToUpload);
                }else if(status==501){
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');
                }
            });
    };




    getChildDir= (filepath) =>{



        var data = {'dir':filepath};
        API.getChildDirs(data)
            .then((res) => {

                if (res.status === '201') {
                    if(filepath!=this.state.pathTrack[this.state.pathTrack.length-1]){
                        this.state.pathTrack.push(filepath);
                    }

                    this.setState({
                        filelist: res.fileLst,
                        staredList : res.stared,
                        isSelfCall: true
                    });
                }else if(res.status==='501'){
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.signout();
                }
            })
    };

   download= (filepath,filename) =>{

        var data = {'path':filepath,'name':filename};
        API.doDownload(data)
            .then((res) => {
               /* res.data.pipe(fs.createWriteStream(filename))*/
                    /*debugger;*/
                    FileDownload(res.data, filename);

            })
    };

    signout = () => {
        this.props.history.push("/login");
    };

    handleChange(evt,filePath) {
        var pathToUpload = "";
        if(this.state.pathTrack.length>0){
            pathToUpload = (this.state.pathTrack[this.state.pathTrack.length-1]);
        }else{
            pathToUpload = (this.state.root);
        }

        var checked = evt.target.checked;
        var data = {'filepath':filePath};
        if(checked){
            API.doStar(data) .then((res) => {
                this.getChildDir(pathToUpload);

            });
        }else{
            API.doUnStar(data) .then((res) => {
                this.getChildDir(pathToUpload);
            });
        }};




    render(){

        var filelist1 = [];
        var staredList =[];
        if(this.state.filelist && this.state.filelist!=''){
            filelist1 = this.state.filelist;

            staredList = this.state.staredList;
        }
        var username = this.state.userid;

        return(<div style={fullscreen}>
                <NavBar createDir = {this.createDir} getHome={this.getHome} getUserLogs={this.getUserLogs} getUserProfile={this.getUserProfile}  signout= {this.signout}  ></NavBar>
                <hr id="divider"></hr>
                <div >

                        <div style={choose}>
                        <input
                            style={uploadButton1}
                                type="file"
                               ref="myFile"
                               name="myFile"
                                bsStyle="primary" bsSize="large"
                        /></div>
                        <div style={uploadDiv}>
                            <Button style={uploadButton} bsStyle="primary" bsSize="large" active onClick={() => this.handleFile()}>
                                    <span >Upload files</span>
                            </Button>
                        </div>

                    <Button style={backButton} onClick={() => this.getBack()}>
                        Back
                    </Button>



                    <ListGroup style={list}> {staredList.map((file, i) =>
                        <ListGroupItem style={fileListItems}  key={i}>{ file.isFolder ?
                            (   <div>
                                    <Avatar  className="file-opt" icon={<FileFolder />}
                                             color={orange200}
                                             backgroundColor={blue300}
                                             size={30}
                                             style={style}/>
                                    <a onClick={() => this.getChildDir(file.path)}> {file.name} </a>
                                    <Checkbox  checked={true} style={star} value={file.path} onChange={(e) => this.handleChange(e,file.path)} >Star</Checkbox>
                                    <Button style={del}  onClick={()=>this.deleteDir(file.name)} bsStyle="danger">Delete</Button>
                                </div>

                            ):
                            (<div><Avatar  className="file-opt" icon={<FileFolder />}
                                           color={orange200}
                                           backgroundColor={purple500}
                                           size={30}
                                           style={style}/>
                                    <a  onClick={()=>this.download(file.path,file.name)} >{file.name}</a>

                                    <Button style={del} onClick={()=>this.deleteDir(file.name)}  bsStyle="danger">Delete</Button>
                                <Checkbox  checked={true} style={star}  value={file.path} onChange={(e) => this.handleChange(e,file.path)} >Star</Checkbox>
                            </div> )}</ListGroupItem>
                    )}
                    </ListGroup>


                    <ListGroup style={list}> {filelist1.map((file, i) =>
                        <ListGroupItem style={fileListItems}  key={i}>{ file.isFolder ?
                            (   <div>
                                    <Avatar  className="file-opt" icon={<FileFolder />}
                                             color={orange200}
                                             backgroundColor={blue300}
                                             size={30}
                                             style={style}/>
                                    <a onClick={() => this.getChildDir(file.path)}> {file.name} </a>
                                    <Button style={del} onClick={()=>this.deleteDir(file.name)}  bsStyle="danger">Delete</Button>
                                    <Checkbox  style={star}   checked={file.isStared} value={file.path} onChange={(e) => this.handleChange(e,file.path)} >Star</Checkbox>

                                </div>

                            ):
                            (<div><Avatar  className="file-opt" icon={<FileFolder />}
                                           color={orange200}
                                           backgroundColor={purple500}
                                           size={30}
                                           style={style}/>
                                <a  >{file.name}</a>
                                <Button style={del} onClick={()=>this.deleteDir(file.name)}  bsStyle="danger">Delete</Button>
                                <Button style={del}  onClick={()=>this.download(file.path,file.name)}   bsStyle="danger">Download</Button>
                                <Checkbox  style={star} checked={file.isStared} value={file.path} onChange={(e) => this.handleChange(e,file.path)} >Star</Checkbox>
                            </div>)
                        }</ListGroupItem>
                    )}
                    </ListGroup>







                </div>
            </div>

        )
    }
}

export default withRouter(Welcome);