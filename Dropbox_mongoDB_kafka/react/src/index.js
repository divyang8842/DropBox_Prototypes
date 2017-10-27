import React from 'react';
import { render } from 'react-dom';
import App from './containers/App';
import './styles/index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const AppMaterial = () => (
    <MuiThemeProvider>
        <App/>
    </MuiThemeProvider>
);

render(
  <AppMaterial />,
  document.getElementById('root')
);