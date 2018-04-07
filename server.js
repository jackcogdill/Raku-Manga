const express = require('express');
const path = require('path');
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));
const sort = require('./sort');

const app = express();
const port = process.env.PORT || 5000;

// Serve images from specified directory
app.use('/images', express.static(argv.dir));

function findImages() {
    const formats = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp'];
    const pattern = `${argv.dir}/*@(${formats.join('|')})`;

    glob(pattern, {}, (err, files) => { // Options is optional
        files.sort(sort.numCompare);
        global.files = files.map(f => path.basename(f));
    });
}

findImages();

app.get('/api/manga', (req, res) => {
    const { n } = req.query;
    const image = global.files[n];
    res.send({
        data: encodeURIComponent(image),
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
