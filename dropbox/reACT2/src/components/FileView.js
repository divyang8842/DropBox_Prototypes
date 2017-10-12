import React, {Component} from 'react';
import PropTypes from 'prop-types';

class FileView extends Component {
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
    return "";

    }

}

export default FileView;