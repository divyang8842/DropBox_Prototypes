import React, { Component, PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import '../styles/sidebar.css'

/**
 * Sidebar for the drop box site
 * */
export default class Sidebar extends Component{

    render(){
        let article = [
            {cName:"fa fa-file", menuName:"Files"},
            {cName:"fa fa-picture-o", menuName:"Photos"},
            {cName:"fa fa-share-square-o", menuName:"Sharing"},
            {cName:"fa fa-link", menuName:"Links"},
            {cName:"fa fa-calender", menuName:"Events"},
        ];

        let items = article.map((item, index) => {
            return (
                <article key={index} className="menu-item">
                    <MenuItem onTouchTap={(open) => this.props.onToggleDrawer(open)}>
                        <i className={item.cName}></i>
                        <p className="menu-name">{item.menuName}</p>
                    </MenuItem>
                </article>
            )
        });

        return(
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
        )
    }
}

Sidebar.propTypes = {
    onToggleDrawer : PropTypes.func,
    open: PropTypes.bool.isRequired
};
