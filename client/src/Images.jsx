import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';

class Images extends Component {
    static fixScroll() {
        const doc = document.documentElement || document.body.parentNode || document.body;
        const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : doc.scrollTop;

        if (scrollTop === 0) {
            window.scrollTo(0, 1);
        }
    }

    static propTypes = {
        first: PropTypes.number.isRequired,
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
        } else {
            const { hasPrev, hasNext, image } = item;
            this.setState(prevState => ({
                images: isReverse ? [image, ...prevState.images] : [...prevState.images, image],
                hasMore: isReverse ? hasPrev : hasNext,
                n: n + (isReverse ? -1 : 1),
            }));
        }
    }

    render() {
        const { state, props, update } = this;
        const { images, hasMore } = state;
        const { isReverse } = props;

        if (isReverse) {
            // Do not load previous images infinitely
            Images.fixScroll();
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

export default Images;
