/* eslint arrow-parens: 0 */
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import InfiniteScroll from 'react-infinite-scroller';
import Cookies from 'universal-cookie';

import Info from './Info';
import './App.css';

const cookies = new Cookies();

class Images extends Component {
    static defaultProps = {
        isReverse: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            hasMore: true,
            n: props.first,
        };
        this.update = this.update.bind(this);
    }

    async update() {
        const { n } = this.state;
        const { getItem, isReverse } = this.props;

        const item = await getItem(n);
        if (item === null) {
            this.setState({
                hasMore: false,
            });
        }
        else {
            const { hasPrev, hasNext, image } = item;
            this.setState(prevState => ({
                images: isReverse ? [image, ...prevState.images] : [...prevState.images, image],
                hasMore: isReverse ? hasPrev : hasNext,
                n: n + (isReverse ? -1 : 1),
            }));
        }
    }

    fixScroll() {
        const doc = document.documentElement || document.body.parentNode || document.body;
        const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : doc.scrollTop;

        if (scrollTop === 0) {
            window.scrollTo(0, 1);
        }
    }

    render() {
        const { state, props, update } = this;
        const { images, hasMore } = state;
        const { isReverse } = props;

        if (isReverse) {
            // Do not load previous images infinitely
            this.fixScroll();
        }

        return (
            <InfiniteScroll
                isReverse={isReverse}
                hasMore={hasMore}
                loadMore={update}
                threshold={window.innerHeight}
            >
                {images}
            </InfiniteScroll>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        const progress = Number(cookies.get('Progress')) || 0;
        this.firstPrev = progress;
        this.firstNext = progress + 1;
    }

    async componentDidMount() {
        // Prevent Chrome from remembering scroll position
        // See https://stackoverflow.com/a/38270059/1313757
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }

    callApi = async (n) => {
        const response = await fetch(`/api/manga?n=${n}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);
        if (body.error) throw Error(body.error);

        return body;
    };

    getItem = async (n) => {
        let res;
        try {
            res = await this.callApi(n);
        }
        catch (err) {
            console.log(err);
            return null;
        }

        const { file, title, header, hasPrev, hasNext } = res;
        const image = (
            <img
                className="raku-img"
                key={n}
                alt={title}
                title={title}
                header={header}
                src={`/images/${file}`}
                n={n}
            />
        );

        return {
            hasPrev,
            hasNext,
            image,
        };
    }

    onItem(n) {
        cookies.set('Progress', n, { path: '/' });
    }

    render() {
        return (
            <div className="App">
                <Info onItem={this.onItem} />
                <div className="raku-wrap">
                    <Images getItem={this.getItem} first={this.firstPrev} isReverse={true} />
                    <Images getItem={this.getItem} first={this.firstNext} />
                </div>
            </div>
        );
    }
}

export default App;
