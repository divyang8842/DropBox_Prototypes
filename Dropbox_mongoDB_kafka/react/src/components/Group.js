import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class Group extends Component {

    render() {

        const {item} = this.props;
       // alert(this.props);

        const todoClass = `alert alert-${item.status === 'done' ?  "success" : "danger"}`;

        return (
            <div className="row justify-content-md-center">
                <div className="col-md-12">
                    <div className={todoClass} role="alert">
                        { item.email }

                            <button
                                className="close"
                                onClick={() => {
                                    this.props.removeItem(item.index);
                                }}
                            ><span aria-hidden={true}>&times;</span></button>
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(Group);