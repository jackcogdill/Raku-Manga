# Raku Manga

## Usage

Install server and client dependencies

```
yarn
cd client
yarn
```

To start the server and client at the same time (from the root of the project)

```
yarn dev --dir /path/to/manga
```

## How this works

The key to use an Express backend with a project created with `create-react-app` is on using a **proxy**. We have a _proxy_ entry in `client/package.json`

```
"proxy": "http://localhost:5000/"
```

This tells Webpack development server to proxy our API requests to our API server, given that our Express server is running on **localhost:5000**

## Todo

- [x] Handle out of range (first and last image in directory)
    - [ ] Update UI (no prev/next: gray out and use [/] cursor symbol)
- [ ] Preload surrounding images so UI image change is instant
- [ ] Figure out how to make production version with `yarn build`
- [ ] Save progress (maybe in `~/.rakumanga`?)
- [x] Add keyboard shortcuts (left, right, `h`, `l`) for next/prev
- [ ] Add screenshots to readme
- [ ] Detect volume and chapter number and display at the top of the page

