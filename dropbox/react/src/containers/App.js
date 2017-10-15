
import React, { Component } from 'react';
import '../styles/App.css';
import '../styles/main.css';

import injectTapEventPlugin from 'react-tap-event-plugin';
import NewerHomePage from "../components/NewerHomePage";
import {BrowserRouter} from 'react-router-dom';

export default class App extends Component{
    constructor(){
        super();

        // Needed for onTouchTap
        // http://stackoverflow.com/a/34015469/988941
        injectTapEventPlugin();
    }


    render(){
        return(

        <BrowserRouter >
            {/*<section>
            <NavBar />
            <hr id="divider"></hr>
            </section>*/}
          <NewerHomePage/>
        </BrowserRouter>
        )
    }
}

