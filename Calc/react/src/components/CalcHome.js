import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Calc from "./Calc";
import Message from "./Message";


class CalcHome extends Component {

    state = {
        output: ''
    };

    handleSubmit = (calcdata) => {
        console.log("Data"+JSON.stringify(calcdata));
        API.doCompute(calcdata)
            .then((data) => {

                    this.setState({
                        output:data.message
                    });

            });
    };

    render() {
        return (
            <div className="container-fluid">

                <Route exact path="/" render={() => (
                    <div>
                        <Calc handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.output}/>
                    </div>
                )}/>

            </div>
        );
    }
}

export default withRouter(CalcHome);