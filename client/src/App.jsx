import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            n: 0,
        };
    }

    get = (n) => {
        this.callApi(n)
            .then(res => this.setState({ response: res.data }))
            .catch(err => console.log(err));
    }

    next = () => {
        const { n } = this.state;
        this.setState({ n: n + 1 })
        this.get(n + 1);
    }

    prev = () => {
        const { n } = this.state;
        this.setState({ n: n - 1 })
        this.get(n - 1);
    }

    componentDidMount() {
        const { n } = this.state;
        this.get(n);
    }

    callApi = async (n) => {
        const response = await fetch(`/api/manga?n=${n}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <div className="App">
                <button onClick={this.prev}>Prev</button>
                <img style={{'width': '50%'}} src={`/images/${this.state.response}`} alt="test" />
                <button onClick={this.next}>Next</button>
            </div>
        );
    }
}

export default App;
