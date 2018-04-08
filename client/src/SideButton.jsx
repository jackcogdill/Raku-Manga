import React, { Component } from 'react';

import './App.css';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import faAngleLeft from '@fortawesome/fontawesome-free-solid/faAngleLeft';

class SideButton extends Component {
    render() {
        const { dir, onClick, disabled } = this.props;
        const next = (dir === 'next');
        const classDir = next ? 'side-next' : 'side-prev';
        const icon = next ? faAngleRight : faAngleLeft;

        return (
            <div
                className={`side-button ${classDir}`}
                onClick={onClick}
                disabled={disabled}
                role="button"
            >
                <FontAwesomeIcon icon={icon} color="#2E37FE" />
            </div>
        );
    }
};

export default SideButton;
