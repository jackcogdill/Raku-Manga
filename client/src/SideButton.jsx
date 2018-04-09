/* eslint jsx-a11y/click-events-have-key-events: 0 */

import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import faAngleLeft from '@fortawesome/fontawesome-free-solid/faAngleLeft';

import './App.css';

const SideButton = ({ dir, onClick, disabled }) => {
    const next = (dir === 'next');
    const classDir = next ? 'side-next' : 'side-prev';
    const icon = next ? faAngleRight : faAngleLeft;

    return (
        <div
            className={`side-button ${classDir}`}
            onClick={onClick}
            disabled={disabled}
            role="button"
            tabIndex={0}
        >
            <FontAwesomeIcon icon={icon} color="#2E37FE" />
        </div>
    );
};

SideButton.propTypes = {
    dir: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default SideButton;
