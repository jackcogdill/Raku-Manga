const express = require('express');
const path = require('path');
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));
const sort = require('./sort');

const app = express();
const port = process.env.PORT || 5000;

const rootDir = argv.dir || argv.R;
if (rootDir !== undefined) {
  // Serve files from specified root directory
  app.use('/', express.static(rootDir));
}

const mangaDir = argv['manga-dir'] || argv.M;
if (mangaDir === undefined) {
  console.log('No manga directory specified.');
  process.exit(1);
}

// Serve images from specified directory
app.use('/images', express.static(mangaDir));
const global = {};
global.images = {};

const options = {
  cwd: mangaDir,
};
glob('*', options, (err, files) => {
  global.mangas = files;
});

const findImages = dir => {
  const formats = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp'];
  const pattern = `*@(${formats.join('|')})`;
  const options = {
    cwd: dir,
    matchBase: true,
  };
  // matchBase is equivalent to **/patt

  glob(pattern, options, (err, files) => {
    files.sort(sort.numCompare);
    global.images[dir] = files;
  });
};

app.get('/api/list-manga', (req, res) => {
  res.send({
    mangas: global.mangas,
  });
});

app.get('/api/select-manga', (req, res) => {
  const { manga } = req.query;

  findImages(manga);
});

app.get('/api/manga', (req, res) => {
  const { manga, n: strN } = req.query;
  const n = Number(strN);

  const inbounds = n => n >= 0 && n < global.images[manga].length;
  if (!inbounds(n)) {
    res.send({
      error: `No such file index: ${n}`,
    });
    return;
  }

  const image = global.images[manga][n];
  const p = path.parse(image);
  const header = p.dir ? `${p.dir}/${p.name}` : p.name;

  res.send({
    file: encodeURIComponent(image),
    title: p.name,
    header,
    hasPrev: inbounds(n - 1),
    hasNext: inbounds(n + 1),
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
