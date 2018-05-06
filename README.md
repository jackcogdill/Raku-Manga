# Raku Manga

## Usage

Install server and client dependencies

```
yarn
cd client
yarn
```

To start the server and client at the same time (from the root of the project):

```
yarn dev -M /path/to/manga
```

To run the production version of the server:

```
yarn pro -M /path/to/manga
```

## How this works

The key to use an Express backend with a project created with `create-react-app` is on using a **proxy**. We have a _proxy_ entry in `client/package.json`

```
"proxy": "http://localhost:5000/"
```

This tells Webpack development server to proxy our API requests to our API server, given that our Express server is running on **localhost:5000**

## Todo

- [x] Handle out of range (first and last image in directory)
- [x] Preload surrounding images so UI image change is instant
- [x] Infinite scroll?
- [x] Detect volume and chapter number and display at the top of the page
    - [x] Use subfolders
- [x] Put correct image alt text
- [x] Use css vendor prefixes
- [x] Add loading logo
- [x] Figure out how to make production version with `yarn build`
- [ ] Show portal with different manga options
    - [ ] Save cookies specific to each manga
- [ ] Add login
    - [ ] Use stateless JWT
- [ ] Add screenshots to readme

