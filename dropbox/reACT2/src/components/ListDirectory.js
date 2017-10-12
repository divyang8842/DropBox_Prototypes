import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FileView from "./FileView";

class ListDirectory extends Component {

    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    };

    state = {
        username: '',
        password: ''
    };

    componentWillMount(){
        this.setState({
            username: '',
            password: ''
        });
    }

    render() {


        var totStyle={float:'right',fontSize:25};
        var totStyle1={float:'left', fontSize:25};
        var borderStyle={borderStyle: 'inset', backgroundColor:'lightBlue'};


        return (
            <div className="container-fluid" >
                <div className="row justify-content-md-center">
                    <div className="col-md-6">
                        <h2 className="text-center">Food Ordering App</h2>
                    </div>

                </div>
                <hr/>

                <hr/>
                <div className="row justify-content-md-center" >

                    <div className="card col-sm-4"  >
                        <div className="card-body">
                            <h4>Order</h4>
                            {
                                this.props.todoArr.map((todo,index) => {
                                    if (todo.quantity > 0) {
                                        return (
                                            <FileView
                                                key={index}
                                                item={todo}
                                                value={'false'}
                                            />
                                        );
                                    }
                                })
                            }
                        </div>
                       {/* <div className="row justify-content-md-center" style={borderStyle}>
                            <div className="col-md-12">
                                <span aria-hidden={true} style={totStyle}>$ {tot(this.props.todoArr)}.00</span>
                                <span aria-hidden={true} style={totStyle1}><b>Total :</b></span>

                            </div>
                        </div>
*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default ListDirectory;