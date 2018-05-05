import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Info extends Component {
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
            info: el.title,
            prev: n,
        });

        cookies.set('Progress', n, { path: '/' });
    }

    render() {
        const { initialInfo } = this.props;
        const { info } = this.state;

        return (
            <div className="strip-info">
                {info || initialInfo}
            </div>
        );
    }
}

export default Info;
