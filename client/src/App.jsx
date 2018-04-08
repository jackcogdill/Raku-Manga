import React, { Component } from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight'
import faAngleLeft from '@fortawesome/fontawesome-free-solid/faAngleLeft'

import './App.css';

class SideButton extends Component {
    render() {
        const { dir } = this.props;
        const next = (dir === 'next');
        const className = next ? 'side-next' : 'side-prev';
        const icon = next ? faAngleRight : faAngleLeft;

        return (
            <div className={className} onClick={this.props.onClick} >
                <FontAwesomeIcon icon={icon} color='#2E37FE' />
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: '',
            n: 0,
        };
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

    componentDidMount() {
        this.update(0);
    }

    render() {
        const { image } = this.state;
        return (
            <div className='App'>
                <div className='strip-wrap'>
                    <SideButton dir='prev' onClick={this.prev} />
                    {image
                        ? <img className='strip-img' alt={'test'} src={`/images/${image}`} />
                        : <div>Loading...</div>
                    }
                    <SideButton dir='next' onClick={this.next} />
                </div>
            </div>
        );
    }
}

export default App;
