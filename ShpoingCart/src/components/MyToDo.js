import React, {Component} from 'react';
import {connect} from 'react-redux';

import {addTodo, removeAll} from "../actions/index";

import TodoItem from "./TodoItem";

import {removeTodo} from "../actions/index";


var totStyle={float:'right',fontSize:25};
var totStyle1={float:'left', fontSize:25};
var borderStyle={borderStyle: 'inset', backgroundColor:'lightBlue'};
var backgroundYellow={backgroundColor:'lightYellow'};
var backgroundimage = {backgroundImage:'../../public/images/blank-restaurant-menu-template.jpg'};
class MyToDo extends Component {

    render() {
        console.log(this.props);
        return (
            <div className="container-fluid" style={backgroundimage}>
                <div className="row justify-content-md-center">
                    <div className="col-md-6">
                        <h2 className="text-center">Food Ordering App</h2>
                    </div>

                </div>
                <hr/>

                <hr/>
               <div className="row justify-content-md-center" >
                    <div className="card col-sm-4" style={backgroundYellow}>
                        <div className="card-body">
                            <h4>Menu</h4>
                            {
                                this.props.todoArr.map((todo,index) => {

                                        return (
                                            <TodoItem
                                                key={index}
                                                item={todo}
                                                value={'true'}
                                            />
                                        );

                                })
                            }
                        </div>
                    </div>



                    <div className="card col-sm-4"  style={backgroundYellow}>
                        <div className="card-body">
                            <h4>Order</h4>
                            {
                                this.props.todoArr.map((todo,index) => {
                                    if (todo.quantity > 0) {
                                        return (
                                            <TodoItem
                                                key={index}
                                                item={todo}
                                                value={'false'}
                                            />
                                        );
                                    }
                                })
                            }

                        </div>




                        <div className="row justify-content-md-center" style={borderStyle}>
                            <div className="col-md-12">
                                <span aria-hidden={true} style={totStyle}>$ {tot(this.props.todoArr)}.00</span>
                                <span aria-hidden={true} style={totStyle1}><b>Total :</b></span>

                            </div>
                        </div>

                        </div>
                </div>
            </div>
        );
    }
}
function tot(arr){

    var total = 0;
    for(var count=0;count<arr.length;count++){
        total +=((arr[count].price) * (arr[count].quantity));

    }
    return total;
}


function mapStateToProps(todos) {
    const todoArr = Object.keys(todos).map((item) => (
        {
            'todo' : item,
            'price' : todos[item].price,
            'quantity':todos[item].quantity,
            'status' : todos[item].status,
        }
    ));
    return {todoArr};
}

function mapDispatchToProps(dispatch) {
    return {
        addTodo : (data) => dispatch(addTodo(data)),
        removeTodo : (data) => dispatch(removeTodo(data))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyToDo);    // Learn 'Currying' in functional programming
