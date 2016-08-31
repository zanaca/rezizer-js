const crypto = require('crypto');


function buildPath(rawImageUrl, _operations) {
    if (!rawImageUrl) {
        throw new Error('The image url must be informed.');
    }

    const parts = [rawImageUrl];
    const operations = _operations;

    if (operations.tile) {
        parts.push('tile');
        return parts.reverse().join('/');
    }

    if (operations.map) {
        parts.push('map');
        return parts.reverse().join('/');
    }

    if (operations.palette) {
        let paletteStr = 'palette';
        if (!isNaN(parseInt(operations.palette, 10))) {
            paletteStr += ':' + operations.palette;
        }
        parts.push(paletteStr);
        return parts.reverse().join('/');
    }

    const concatenatedOperations = ['tint', 'background', 'blur', 'format', 'max-age', 'max-kb', 'overlay', 'quality', 'rotate'];

    Object.keys(operations).map(function m(operation) {
        if (operation === 'crop') {
            parts.push(this.crop.join(','));
        } else if (operation === 'resize') {
            let resizeStr = operations.resize.join(',');
            if (operations.retina) {
                resizeStr += '@' + operations.retina;
            }
            delete operations.retina;
            parts.push(resizeStr);
        } else if (concatenatedOperations.indexOf(operation) > -1) {
            parts.push(operation + ':' + operations[operation]);
        } else {
            parts.push(operation);
        }
        return true;
    });

    return parts.reverse().join('/');
}


function generateHash(secret, builtPath) {
    if (!secret) {
        return null;
    }
    return crypto.createHmac('sha1', secret)
                 .update(builtPath)
                 .digest('base64')
                 .replace(/\+/g, '-')
                 .replace(/\//g, '_');
}

const rezizerBuilder = function rezizerBuilder(url, secret) {
    this.serverUrl = url;
    this.secret = secret;
    this.operations = {};
    this.rawImageUrl = null;

    this.generate = function gen() {
        let path = buildPath(this.rawImageUrl, this.operations);
        if (this.secret) {
            path = generateHash(this.secret, path) + '/' + path;
        }
        return this.serverUrl + '/' + path;
    };

    this.with = function wt(_url) {
        this.rawImageUrl = _url;

        return this;
    };

    this.resize = function rz(w, h) {
        if (!isNaN(parseInt(w, 10)) || !isNaN(parseInt(h, 10))) {
            throw new Error('Either the height or the width are not valid integers', { width: w, height: h });
        }
        this.commands.resize = [w, h];

        return this;
    };
};

// export class
module.exports = rezizerBuilder;
