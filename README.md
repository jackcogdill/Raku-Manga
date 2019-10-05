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

- [ ] Show portal with different manga options
    - [ ] Save manga-specific progress on server
- [ ] Add screenshots to readme
- [ ] Check aspect ratio of image and make wide images span the whole page

## Ideas

- [ ] `yarn pro -M dir`
    - [ ] `dir` contains all manga subdirs
- [ ] Use `Router` for home page, and each specific manga

- [ ] (very subtle) top bar with: back button, current comic info, nav buttons (jump to specific chapter, comic, etc)
    - [ ] Front end logic for jumping: should reload and preload 10+- the current comic

### Styling

- [ ] Set max-width for content width
- [ ] Set (mobile) max-width: content full width

- [ ] Add login
    - [ ] Use stateless JWT

## Completed

- [x] Handle out of range (first and last image in directory)
- [x] Preload surrounding images so UI image change is instant
- [x] Infinite scroll?
- [x] Detect volume and chapter number and display at the top of the page
    - [x] Use subfolders
- [x] Put correct image alt text
- [x] Use css vendor prefixes
- [x] Add loading logo
- [x] Figure out how to make production version with `yarn build`
