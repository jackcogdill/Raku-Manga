import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import Spinner from 'react-spinkit';

class Images extends Component {
    static getScrollTop() {
        const doc = document.documentElement || document.body.parentNode || document.body;
        return (window.pageYOffset !== undefined) ? window.pageYOffset : doc.scrollTop;
    }

    static propTypes = {
        init: PropTypes.number.isRequired,
        isReverse: PropTypes.bool,
        getItem: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isReverse: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            hasMore: true,
            n: props.init,
            height: 0,
            top: 0,
        };

        this.update = this.update.bind(this);
        this.wrap = React.createRef();
        this.loaded = false;
    }

    componentDidUpdate() {
        if (this.props.isReverse) {
            const ref = this.wrap.current;
            const { height: oldH, top } = this.state;
            if (oldH === 0) {
                return;
            }

            const scroll = () => {
                const newH = ref.scrollHeight;
                if (top > 0) {
                    this.loaded = true;
                }
                window.scrollTo(0, (top + newH) - oldH);
            };

            if (this.loaded) {
                window.requestAnimationFrame(() =>
                    window.requestAnimationFrame(() =>
                        window.requestAnimationFrame(scroll)));
            } else {
                window.requestAnimationFrame(scroll);
            }
        }
    }

    async update() {
        const { n } = this.state;
        const { getItem, isReverse } = this.props;

        const item = await getItem(n);
        if (item === null) {
            this.setState({
                hasMore: false,
            });
            return;
        }

        const { hasPrev, hasNext, image } = item;
        if (isReverse) {
            const ref = this.wrap.current;
            this.setState(prevState => ({
                images: [image, ...prevState.images],
                hasMore: hasPrev,
                n: n - 1,
                height: ref.scrollHeight,
                top: Images.getScrollTop(),
            }));
        } else {
            this.setState(prevState => ({
                images: [...prevState.images, image],
                hasMore: hasNext,
                n: n + 1,
            }));
        }
    }

    render() {
        const { images, hasMore, height } = this.state;
        const { isReverse } = this.props;

        const loader = (
            <div className="raku-loader" key={0}>
                <Spinner name="folding-cube" color="white" />
            </div>
        );

        return (
            <div ref={this.wrap}>
                <InfiniteScroll
                    isReverse={isReverse}
                    hasMore={hasMore}
                    loadMore={this.update}
                    threshold={window.innerHeight}
                    loader={isReverse && height === 0 ? null : loader}
                >
                    {images}
                </InfiniteScroll>
            </div>
        );
    }
}

export default Images;
