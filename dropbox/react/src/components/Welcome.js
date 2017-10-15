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

var list={marginTop:20, paddingLeft:40, paddingRight:270}

var del={float:'right',color:'white',marginRight:'10px'}
var fll ={float:'left'};
var flr =  {float:'right'};
var star = {float:'right',marginRight:'50px'}
var mr30 = {marginRight:'30px'}

var backButton={position:'relative',marginLeft:40}
class Welcome extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired,
        uploadFile: PropTypes.func.isRequired

    };
    state = {

        filelist:[],
        staredList:[],
        sharedList:{},
        pathTrack:[],
        root:'',
        userId:'',
        rootDir:'',
        message:'',
        fileToShare:''

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


    getHome =() =>{
        this.props.goToPath('/welcome');
       // this.props.history.push('/welcome');
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
                    this.signout();
                }else{
                   this.getChildDir(pathToUpload);
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
                    this.signout();
                }
            });
    };

    shareFile = (emails) =>{
        API.validateEmails({'emails':emails})
            .then((res) =>{
            var proceed = false;
                if(res.status=='201'){
                    if(res.linkShare=='true'){
                        if(window.confirm("Some of the email provided are not registered with DropBox.\n The file will be shared as a link?")){
                            proceed=true;
                        }
                    }else{
                        proceed = true;
                    }
                   if(proceed){
                       var data  = {'fileToShare':this.state.fileToShare,'emails':emails};
                       API.doShareFile(data).then((res)=>{

                       });
                   }
                   this.setState({
                       fileToShare:''
                   });
                }else if(res.status=='501'){
                    this.signout();
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
                    this.signout();
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
                        sharedList: res.shared,
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

                    FileDownload(res.data, filename);

            })
    };

    getUserProfile =()=>{
        this.props.goToPath('/userprofile');
        // this.props.history.push('/userprofile');
    }

    getUserLogs =() =>{
        this.props.goToPath('/useractivity');
    }

    signout = () => {
        this.props.signout();
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

    shareFileData = (path,filename) =>{
        this.setState({
            fileToShare:path

        });
    }



    render(){

        var filelist1 = [];
        var staredList =[];
        var sharedList = [];
        if(this.state.filelist && this.state.filelist!=''){
            filelist1 = this.state.filelist;

            staredList = this.state.staredList;
            sharedList = this.state.sharedList;
        }
        var username = this.state.userid;

        return(<div style={fullscreen}>
                <NavBar fileToShare={this.state.fileToShare} shareFile={this.shareFile} createDir = {this.createDir} getHome={this.getHome} getUserLogs={this.getUserLogs} getUserProfile={this.getUserProfile}  signout= {this.signout}  ></NavBar>
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

                    <div> <Button style={backButton} onClick={() => this.getBack()}>
                        Back
                    </Button></div>



                    <div style={list}>
                        Stared files
                    </div>
                    <ListGroup style={list}> {staredList.map((file, i) =>
                        <ListGroupItem style={fileListItems}  key={i}>{ file.isFolder ?
                            (   <div>
                                    <Avatar  className="file-opt" icon={<FileFolder />}
                                             color={orange200}
                                             backgroundColor={blue300}
                                             size={30}
                                             style={style}/>
                                    <a onClick={() => this.getChildDir(file.path)}> {file.name} </a>
                                    <Button style={del}  onClick={()=>this.deleteDir(file.name)} bsStyle="danger">Delete</Button>
                                    <Button style={del}  onClick={()=>this.getChildDir(file.path)}   bsStyle="danger">Lookup--> </Button>
                                    <Button style={del}  onClick={()=>this.shareFileData(file.path,file.name)}   bsStyle="danger">Share</Button>
                                    <Checkbox  checked={true} style={star} value={file.path} onChange={(e) => this.handleChange(e,file.path)} >Star</Checkbox>

                                </div>

                            ):
                            (<div><Avatar  className="file-opt" icon={<FileFolder />}
                                           color={orange200}
                                           backgroundColor={purple500}
                                           size={30}
                                           style={style}/>
                                    <a  onClick={()=>this.download(file.path,file.name)} >{file.name}</a>

                                    <Button style={del} onClick={()=>this.deleteDir(file.name)}  bsStyle="danger">Delete</Button>
                                <Button style={del}  onClick={()=>this.download(file.path,file.name)}   bsStyle="danger">Download</Button>
                                <Button style={del}  onClick={()=>this.shareFileData(file.path,file.name)}   bsStyle="danger">Share</Button>
                                <Checkbox  checked={true} style={star}  value={file.path} onChange={(e) => this.handleChange(e,file.path)} >Star</Checkbox>
                            </div> )}</ListGroupItem>
                    )}
                    </ListGroup>

                    <div style={list}>
                        Shared files
                    </div>
                    <ListGroup style={list}> {sharedList.map((file, i) =>
                        <ListGroupItem style={fileListItems}  key={i}>{ file.isFolder ?
                            (   <div>
                                    <Avatar  className="file-opt" icon={<FileFolder />}
                                             color={orange200}
                                             backgroundColor={blue300}
                                             size={30}
                                             style={style}/>
                                    <a onClick={() => this.getChildDir(file.path)}> {file.name} </a>
                                    <Button style={del}  onClick={()=>this.deleteDir(file.name)} bsStyle="danger">Delete</Button>
                                    <Button style={del}  onClick={()=>this.getChildDir(file.path)}   bsStyle="danger">Lookup--></Button>
                                    <Button style={del}  onClick={()=>this.shareFileData(file.path,file.name)}   bsStyle="danger">Share</Button>
                                    <Checkbox  checked={true} style={star} value={file.path} onChange={(e) => this.handleChange(e,file.path)} >Star</Checkbox>

                                </div>

                            ):
                            (<div><Avatar  className="file-opt" icon={<FileFolder />}
                                           color={orange200}
                                           backgroundColor={purple500}
                                           size={30}
                                           style={style}/>
                                <a  onClick={()=>this.download(file.path,file.name)} >{file.name}</a>

                                <Button style={del} onClick={()=>this.deleteDir(file.name)}  bsStyle="danger">Delete</Button>
                                <Button style={del}  onClick={()=>this.download(file.path,file.name)}   bsStyle="danger">Download</Button>
                                <Button style={del}  onClick={()=>this.shareFileData(file.path,file.name)}   bsStyle="danger">Share</Button>
                                <Checkbox  checked={true} style={star}  value={file.path} onChange={(e) => this.handleChange(e,file.path)} >Star</Checkbox>
                            </div> )}</ListGroupItem>
                    )}
                    </ListGroup>

                    <div style={list}>
                        Your files
                    </div>
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
                                    <Button style={del}  onClick={()=>this.getChildDir(file.path)}   bsStyle="danger">Lookup-->  </Button>
                                    <Button style={del}  onClick={()=>this.shareFileData(file.path,file.name)}   bsStyle="danger">Share</Button>
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
                                <Button style={del}  onClick={()=>this.shareFileData(file.path,file.name)}   bsStyle="danger">Share</Button>
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