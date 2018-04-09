/* eslint arrow-parens: 0 */
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import SideButton from './SideButton';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: '',
            title: '',
            header: '',
            hasPrev: false,
            hasNext: false,
            n: 0,
        };
    }

    componentDidMount() {
        this.update(0);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    callApi = async (n) => {
        const response = await fetch(`/api/manga?n=${n}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);
        if (body.error) throw Error(body.error);

        return body;
    };

    update = (diff) => {
        const { n } = this.state;
        this.callApi(n + diff)
            .then(res => {
                this.setState({
                    image: res.data,
                    title: res.title,
                    header: res.header,
                    hasPrev: res.hasPrev,
                    hasNext: res.hasNext,
                    n: n + diff,
                });
                window.scrollTo(0, 0);
            })
            .catch(err => console.log(err));
    }

    next = () => {
        this.update(1);
    }

    prev = () => {
        this.update(-1);
    }

    handleKeyDown = (e) => {
        switch (e.keyCode) {
            case 37: // Left arrow
            case 72: // h
                this.prev();
                break;
            case 39: // Right arrow
            case 76: // l
                this.next();
                break;
            default:
                break;
        }
    }

    render() {
        const { state, prev, next } = this;
        const { image, title, header, hasPrev, hasNext } = state;

        return (
            <div className="App">
                <div className="strip-wrap">
                    <SideButton dir="prev" onClick={prev} disabled={!hasPrev} />
                    <div className="strip-header">{header}</div>
                    {image
                        ? <img className="strip-img" alt={title} title={title} src={`/images/${image}`} />
                        : <div>Loading...</div>
                    }
                    <SideButton dir="next" onClick={next} disabled={!hasNext} />
                </div>
            </div>
        );
    }
}

export default App;
