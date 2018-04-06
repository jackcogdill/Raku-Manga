const express = require('express');
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));
const sort = require('./sort');

const app = express();
const port = process.env.PORT || 5000;

const formats = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp'];
const pattern = `${argv.dir}/*@(${formats.join('|')})`;

console.dir(argv);

app.get('/api/manga', (req, res) => {
    glob(pattern, {}, (err, files) => { // Options is optional
        files.sort(sort.numCompare);
        res.send({
            data: JSON.stringify(files, null, 4),
        });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
