import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Info extends Component {
    static propTypes = {
        onItem: PropTypes.func,
    };

    static defaultProps = {
        onItem: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            info: '',
            prev: -1,
        };
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleScroll);
    }

    handleScroll() {
        const x = window.innerWidth / 2;
        const el = document.elementFromPoint(x, 0);

        if (el === undefined || el.nodeName !== 'IMG') {
            return;
        }

        const n = el.getAttribute('n');
        if (n === this.state.prev) {
            return;
        }

        this.setState({
            info: el.getAttribute('header'),
            prev: n,
        });

        const { onItem } = this.props;
        if (onItem) {
            onItem(n);
        }
    }

    render() {
        const { info } = this.state;
        return (
            <div className="raku-info">
                {info}
            </div>
        );
    }
}

export default Info;
