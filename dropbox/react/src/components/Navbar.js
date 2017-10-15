import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationOpen from 'material-ui/svg-icons/navigation/menu'
import '../styles/navbar.css';
import  Sidebar  from './Sidebar';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download';
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import TrashBin from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';
import * as API from '../api/API';


export default class NavBar extends Component{
    constructor(){
        super();
        this.state = {
            open: false,
            filename :'',
            emails:'',
            page:''
        };



        this._toggleDrawer = this._toggleDrawer.bind(this);
    }

    componentWillMount(){


        this.setState({
            page:this.props.page
        });
        document.title = `DropBox !!`;
    }


    getHome = () =>{

        this.props.getHome();
    }

    getUserLogs =()=>{
        this.props.getUserLogs();
    }

    getUserProfile =()=>{
        this.props.getUserProfile();
    }

    signout = () =>
    {

        API.doLogout()
            .then((status) => {
                if (status.status == 201) {
                    this.props.signout();
                }
            })
    }

    _toggleDrawer = (open) => this.setState({open: !this.state.open});




    render(){
        var ml30 = {marginLeft:'30px'};
        return(

            <section id="detailed-view">
                <AppBar
                    title={this.state.user}
                    iconElementLeft={<IconButton><NavigationOpen /></IconButton>}
                    iconElementRight={ <IconMenu
                        iconButtonElement={
                            <IconButton><MoreVertIcon /></IconButton>
                        }
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>

                        {(this.state.page=="userprofile" || this.state.page=="useractivity")?(
                            <MenuItem primaryText="Home" onClick={() =>  this.getHome()} />
                            ):''}

                        <MenuItem primaryText="UserLogs" onClick={() =>  this.getUserLogs()} />
                        <MenuItem primaryText="UserProfile" onClick={() =>  this.getUserProfile()} />
                        <MenuItem primaryText="Help" />
                        <MenuItem primaryText="Sign out" onClick={() =>  this.signout()} />

                    </IconMenu>}
                    onLeftIconButtonTouchTap={this._toggleDrawer}
                />

                {(this.state.page!="userprofile" && this.state.page!="useractivity" )?(
                <section id="options-section" className="row">
                    <section id="option-items" className="row">

                
                        <nav id="option-buttons" className="small-6 columns">
                            <input type='text' style={ml30} onChange={(event) => {
                                const value=event.target.value
                                this.setState({
                                    filename: event.target.value
                                });
                            }}/>

                            <RaisedButton className="option-btn" onClick={() =>this.props.createDir(this.state.filename)} label="New Directory"/>
                            <input type='email' onChange={(event) => {
                                const value=event.target.value
                                this.setState({
                                    emails: event.target.value
                                });
                            }}/>

                            <RaisedButton className="option-btn" onClick={() =>this.props.shareFile(this.state.emails)} secondary={true} label="Share"/>
                            {/*<RaisedButton className="option-btn" primary={true} label="Modified"/>*/}
                        </nav>
                    </section>
                </section>
                    ):""}
                <Sidebar
                    open={this.state.open}
                    onToggleDrawer={this._toggleDrawer}/>;

            </section>
        )
    }
}

