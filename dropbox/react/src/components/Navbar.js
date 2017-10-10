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

/**
 * Logged in component
 * for displaying overflow menu options
 * */
const Logged = (props) => (
    <IconMenu
        {...props}
        iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>

        <MenuItem primaryText="Refresh" />
        <MenuItem primaryText="Help" />
        <MenuItem primaryText="Sign out" />
    </IconMenu>
);

export default class NavBar extends Component{
    constructor(){
        super();
        this.state = {
            user : "DropBox",
            open: false
        };

        this._toggleDrawer = this._toggleDrawer.bind(this);
    }

    /**
     * Toggle the drawer */
    _toggleDrawer = (open) => this.setState({open: !this.state.open});

    render(){

        return(
            <section id="detailed-view">
                <AppBar
                    title={this.state.user}
                    iconElementLeft={<IconButton><NavigationOpen /></IconButton>}
                    iconElementRight={<Logged />}
                    onLeftIconButtonTouchTap={this._toggleDrawer}
                />
                
                <section id="options-section" className="row">
                    <section id="option-items" className="row">
                        <nav id="file-options" className="small-6 columns">
                            <Avatar className="file-opt" icon={<FileFolder />}/>
                            <Avatar className="file-opt" icon={<FileCloudDownload />} />
                            <Avatar className="file-opt" icon={<FileCloudUpload />} />
                            <Avatar className="file-opt" icon={<TrashBin />} />
                        </nav>
                
                        <nav id="option-buttons" className="small-6 columns">
                            <RaisedButton className="option-btn" label="Name"/>
                            <RaisedButton className="option-btn" secondary={true} label="Size"/>
                            <RaisedButton className="option-btn" primary={true} label="Modified"/>
                        </nav>
                    </section>
                </section>

                <Sidebar
                    open={this.state.open}
                    onToggleDrawer={this._toggleDrawer}/>;

            </section>
        )
    }
}

