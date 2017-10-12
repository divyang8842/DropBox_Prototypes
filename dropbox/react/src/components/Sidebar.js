import React, { Component, PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import '../styles/sidebar.css'
import Profile from "./Profile";
import { Route, withRouter } from 'react-router-dom';


/**
 * Sidebar for the drop box site
 * */
export default class Sidebar extends Component{

    handleClick= (name) =>{
        alert(name);
        if(name="Edit Profile")
        {
        }


    };

    render(){

        let article = [
           {cName:"fa fa-calender", menuName:"Edit Profile"},
            {cName:"fa fa-file", menuName:"Files"},
            {cName:"fa fa-picture-o", menuName:"About"},
            {cName:"fa fa-share-square-o", menuName:"Interests"},
            {cName:"fa fa-link", menuName:"Links"}

        ];

        let items = article.map((item, index) => {
            return (
                <article key={index} className="menu-item">
                    <MenuItem onTouchTap={(open) => this.props.onToggleDrawer(open)}>
                        <i className={item.cName}></i>
                        <p className="menu-name" onClick={() => {
                            this.props.history.push("/profile");
                        }}>{item.menuName}</p>
                    </MenuItem>
                </article>
            )
        });

        return(<div>
            <Drawer
                docked={false}
                width={300}
                open={this.props.open}
                onRequestChange={(open) => this.props.onToggleDrawer(open)}>

                <div className="logo">
                    <i id="drop-box-logo" className="fa fa-dropbox fa-3x"></i>
                </div>

                {items}

                <article className="storage-item">
                    <p id="storage-space">50 GB / 100GB
                        <i id="plus-icon" className="fa fa-plus-circle"></i>
                    </p>

                    <div id="storage-bar">
                        <hr id="blue"/>
                        <hr id="navy"/>
                    </div>
                </article>

                <article className="upgrade-btn">
                    <p id="up-ac-btn">
                        <i className="fa fa-arrow-up"></i>
                        Upgrade account
                    </p>
                </article>
            </Drawer>
                <Route exact path="/profile" render={() => (
                    <div>
                        <Profile />

                    </div>
                )}/>
            </div>
        )
    }
}

Sidebar.propTypes = {
    onToggleDrawer : PropTypes.func,
    open: PropTypes.bool.isRequired
};
