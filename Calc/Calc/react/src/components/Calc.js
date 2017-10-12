import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Calc extends Component {

    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    };

    state = {
        num1: '',
        num2: '',
        operation:'',
        message:''
    };

    componentWillMount(){
        this.setState({
            num1: '',
            num2: '',
            operation:'',
            message:''
        });
    }

    render() {

        var mr30 = {marginLeft:'30px'};
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-2">
                    <form>
                        <div className="form-group">
                            <h1>Calculator</h1>
                        </div>
                        <div className="form-group"> Number 1
                            <input
                                className="form-control"
                                type="number"
                                label="InputNumber1"
                                placeholder="Enter Number"
                                value={this.state.num1}
                                onChange={(event) => {
                                    this.setState({
                                        num1: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="form-group">
                            Number 2
                            <input
                                className="form-control"
                                type="number"
                                label="InputNumber2"
                                placeholder="Enter Number"
                                value={this.state.num2}
                                onChange={(event) => {
                                    this.setState({
                                        num2: event.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-primary"
                                type="button"

                                onClick={() => this.setState({operation: '+'},function(){this.props.handleSubmit(this.state)})}
                            >
                                +
                            </button>
                            <button
                                className="btn btn-primary"
                                type="button"
                                style={mr30}
                                onClick={() => this.setState({operation: '-'},function(){this.props.handleSubmit(this.state)})}>
                                -
                            </button>
                            <button
                                className="btn btn-primary"
                                type="button"
                                style={mr30}
                                onClick={() => this.setState({operation: '*'},function(){this.props.handleSubmit(this.state)})}>
                                *
                            </button>
                            <button
                                className="btn btn-primary"
                                type="button"
                                style={mr30}
                                onClick={() => this.setState({operation: '/'},function(){this.props.handleSubmit(this.state)})}>
                                /
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Calc;