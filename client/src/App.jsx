/* eslint arrow-parens: 0 */
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import InfiniteScroll from 'react-infinite-scroller';
import Cookies from 'universal-cookie';

import Info from './Info';
import './App.css';

const cookies = new Cookies();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            header: '',
            hasPrev: false,
            hasNext: false,
            n: 0,
        };
    }

    componentDidMount() {
        // Prevent Chrome from remembering scroll position
        // See https://stackoverflow.com/a/38270059/1313757
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const progress = Number(cookies.get('Progress')) || 0;
        this.update(progress);
    }

    callApi = async (n) => {
        const response = await fetch(`/api/manga?n=${n}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);
        if (body.error) throw Error(body.error);

        return body;
    };

    update = async (diff) => {
        const { n } = this.state;
        const newN = n + diff;

        let res;
        try {
            res = await this.callApi(newN);
        }
        catch (err) {
            console.log(err);
            return;
        }

        const { data, title, header, hasPrev, hasNext } = res;
        const image = (
            <img
                className="strip-img"
                alt={title}
                title={title}
                src={`/images/${data}`}
                key={newN}
                n={newN}
            />
        );

        this.setState(prevState => ({
            images: [...prevState.images, image],
            header,
            hasPrev,
            hasNext,
            n: newN,
        }));

        // cookies.set('Progress', newN, { path: '/' });
    }

    next = () => this.update(1);

    prev = () => this.update(-1);

    render() {
        const { images, hasPrev, hasNext, info } = this.state;
        return (
            <div className="App">
                <Info />
                <div className="strip-wrap">
                    <InfiniteScroll
                        hasMore={hasNext}
                        loadMore={this.next}
                        threshold={window.innerHeight}
                    >
                        {images}
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}

export default App;
