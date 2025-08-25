import React, {Component} from 'react';
import './ReportsTitle.css'

class ReportsTitle extends Component {

    state = {
        content: this.props.content
    };

    render() {

        return(
            <div>
                <p>{this.state.content}</p>
            </div>
        );

    }

}

export default ReportsTitle;