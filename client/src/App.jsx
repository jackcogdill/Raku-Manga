/* eslint arrow-parens: 0 */
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';

import Info from './Info';
import Images from './Images';
import './App.css';

const cookies = new Cookies();

class App extends Component {
    static callApi = async (n) => {
        const response = await fetch(`/api/manga?n=${n}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);
        if (body.error) throw Error(body.error);

        return body;
    };

    static getItem = async (n) => {
        let res;
        try {
            res = await App.callApi(n);
        } catch (err) {
            console.log(err);
            return null;
        }

        const { file, title, header, hasPrev, hasNext } = res;
        const image = (
            <img
                className="raku-img"
                alt={title}
                title={title}
                header={header}
                src={`/images/${file}`}
                n={n}
                key={n}
            />
        );

        return {
            hasPrev,
            hasNext,
            image,
        };
    }

    static onItem(n) {
        cookies.set('Progress', n, { path: '/' });
    }

    constructor(props) {
        super(props);

        const progress = Number(cookies.get('Progress')) || 0;
        this.initPrev = progress;
        this.initNext = progress + 1;
    }

    componentDidMount() {
        // Prevent Chrome from remembering scroll position
        // See https://stackoverflow.com/a/38270059/1313757
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }

    render() {
        const { onItem, getItem } = App;
        const { initPrev, initNext } = this;

        return (
            <div className="App">
                <div className="raku-wrap">
                    <Info onItem={onItem} />
                    <Images getItem={getItem} init={initPrev} isReverse />
                    <Images getItem={getItem} init={initNext} />
                </div>
            </div>
        );
    }
}

export default App;
