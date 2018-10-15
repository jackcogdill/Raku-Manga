/* eslint arrow-parens: 0 */
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';

import Info from './Info';
import Images from './Images';
import Portal from './Portal';
import './App.css';

const cookies = new Cookies();

class App extends Component {
  static callApi = async (path) => {
    const response = await fetch(path);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    if (body.error) throw Error(body.error);

    return body;
  };

  static getItem = async (n) => {
    let res;
    try {
      res = await App.callApi(`/api/manga?n=${n}`);
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

  static getMangas = async () => {
    let res;
    try {
      res = await App.callApi('/api/list-mangas');
    } catch (err) {
      console.log(err);
      return null;
    }
    return res.mangas;
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

    //    <Info onItem={onItem} />
    //    <Images getItem={getItem} init={initPrev} isReverse />
    //    <Images getItem={getItem} init={initNext} />

    return (
      <div className="App">
        <div className="raku-wrap">
          <Portal getMangas={this.getMangas} />
        </div>
      </div>
    );
  }
}

export default App;
