import React, {Component} from 'react';
import './App.css';


import {BrowserRouter} from 'react-router-dom';
import CalcHome from "./components/CalcHome";



    class App extends Component {
        render() {
            return (
                <div className="App">
                    <BrowserRouter>
                        <CalcHome/>
                    </BrowserRouter>
                </div>
            );
        }
    }

    export default App;
