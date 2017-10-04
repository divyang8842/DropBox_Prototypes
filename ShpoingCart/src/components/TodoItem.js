import React, {Component} from 'react';
import {connect} from 'react-redux';

import {doneTodo} from "../actions/index";
import {removeTodo} from "../actions/index";

var flr={float:'right'};
var mr80={marginRight:100};
var bgcolor={backgroundColor:'lightgrey'};

var pt15={paddingTop:15};
class TodoItem extends Component {

    render() {

        const {item} = this.props;
        var flag = this.props.value;
        console.log(flag);
        console.log(JSON.stringify(this.props));

        const todoClass = `alert `;



        return (
            <div className="row justify-content-md-center">
                <div className="col-md-12">
                    <div className={todoClass} style={bgcolor} role="alert">
            <div style={mr80}> { item.todo } <span style={flr}>Price : $ {item.price} </span></div>
            <div> {flag!='true' ? (<span style={pt15}>Qty: {item.quantity}</span>) :"-" }

                        { flag==='true' ? (
                            <button
                                className="btn btn-primary btn-sm" style={flr}
                                onClick={() => {
                                    this.props.doneTodo(item);
                                }}
                            ><span aria-hidden={true}>Add</span></button>) : ''}
                        { flag!='true' ? (


                            <button
                                className="btn btn-danger btn-sm" style={flr}
                                onClick={() => {
                                    this.props.removeTodo(item);
                                }}
                            ><span aria-hidden={true}>Remove</span></button>) : ''}
    </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        doneTodo : (data) => dispatch(doneTodo(data)),
        removeTodo : (data) => dispatch(removeTodo(data))
    };
}

export default connect(null, mapDispatchToProps)(TodoItem);    // Learn 'Currying' in functional programming
