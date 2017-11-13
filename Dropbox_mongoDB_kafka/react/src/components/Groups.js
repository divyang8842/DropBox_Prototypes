import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class Groups extends Component {

    render() {

        const {item} = this.props;
        // alert(this.props);

        const todoClass = `alert alert-${item.status === 'done' ?  "success" : "success"}`;

        return (
            <div className="row justify-content-md-center">
                <div className="col-md-6">
                    <div className={todoClass} role="alert">
                        { item.groupname }

                        <button
                            className="edit"
                            onClick={() => {
                                this.props.updateGroup(item);
                            }}
                        ><span aria-hidden={true}>Edit</span></button>

                        <button
                            className="delete"

                        ><span aria-hidden={true}>Delete</span></button>
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(Groups);