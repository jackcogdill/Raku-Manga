/* eslint arrow-parens: 0 */
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import InfiniteScroll from 'react-infinite-scroller';
import Cookies from 'universal-cookie';

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
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleScroll);

        // Prevent Chrome from remembering scroll position
        // See https://stackoverflow.com/a/38270059/1313757
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const progress = Number(cookies.get('Progress')) || 0;
        this.update(progress);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleScroll);
    }

    handleScroll() {
        const doc = document.documentElement || document.body.parentNode || document.body;
        const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : doc.scrollTop;
        console.log(scrollTop);
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
        const newN = n + diff;

        this.callApi(newN)
            .then(res => {
                const { data, title, header, hasPrev, hasNext } = res;
                const image = (
                    <img
                        className="strip-img"
                        alt={title}
                        title={title}
                        src={`/images/${data}`}
                        key={newN}
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
            })
            .catch(err => console.log(err));
    }

    next = () => this.update(1);

    prev = () => this.update(-1);

    render() {
        const { state, prev, next } = this;
        const { images, hasPrev, hasNext } = state;
        const height = window.innerHeight;

        return (
            <div className="App">
                <div className="strip-wrap">
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={next}
                        hasMore={hasNext}
                        threshold={height}
                    >
                        {images}
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}

export default App;
