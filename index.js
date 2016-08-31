const crypto = require('crypto');


const concatenatedOperations = ['tint', 'background', 'blur', 'format', 'max-age', 'max-kb',
                                'overlay', 'quality', 'rotate', 'align'];
const simpleOperations = ['distort', 'extend', 'fit', 'fit-in', 'flip', 'flop', 'tile',
                          'grayscale', 'invert', 'map', 'max', 'min', 'progressive', 'round'];


function buildPath(_operations) {
    const parts = [];
    const operations = _operations;

    if (operations.tile) {
        parts.push('tile');
        return parts.join('/');
    }

    if (operations.map) {
        parts.push('map');
        return parts.join('/');
    }

    if (operations.palette) {
        let paletteStr = 'palette';
        if (!isNaN(parseInt(operations.palette, 10))) {
            paletteStr += ':' + operations.palette;
        }
        parts.push(paletteStr);
        return parts.join('/');
    }

    Object.keys(operations).map(function m(operation) {
        if (operation === 'crop') {
            parts.push(this.crop.join(','));
        } else if (operation === 'resize') {
            let resizeStr = operations.resize.join('x');
            if (operations.retina) {
                resizeStr += '@' + operations.retina + 'x';
            }
            delete operations.retina;
            parts.push(resizeStr);
        } else if (operation === 'align') {
            let alignment = operations[operation].toLowerCase();

            switch (alignment) {
            case 'top':
                alignment = 'north';
                break;
            case 'left':
                alignment = 'weast';
                break;
            case 'right':
                alignment = 'east';
                break;
            case 'bottom':
                alignment = 'south';
                break;
            case 'north':
            case 'east':
            case 'south':
            case 'west':
            case 'northeast':
            case 'southeast':
            case 'southwest':
            case 'northwest':
            case 'middle':
            case 'center':
            case 'smart':
                break;
            default:
                return false;
                break;
            }
            parts.push(alignment);
            delete operations.align;
        } else if (operation === 'face') {
            let faceOperation = operation;
            if (operations[operataion] === 'focused') {
              faceOperataion += ':focused';
            }
            parts.push(operation + ':' + operations[operation]);
        } else if (concatenatedOperations.indexOf(operation) > -1) {
            parts.push(operation + ':' + operations[operation]);
        } else {
            parts.push(operation);
        }
        return true;
    });

    return parts.join('/');
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
        let path = buildPath(this.operations);
        if (this.secret) {
            path = generateHash(this.secret, path) + '/' + path;
        }
        path += '/' + this.rawImageUrl;

        return this.serverUrl + '/' + path;
    };

    this.with = function wt(_url) {
        this.rawImageUrl = _url;

        return this;
    };

    this.resize = function rz(w, h) {
        if (isNaN(parseInt(w, 10)) || isNaN(parseInt(h, 10))) {
            throw new Error('Either the height or the width are not valid integers' + { width: w, height: h });
        }
        this.operations.resize = [w, h];

        return this;
    };

    this.overlay = function ov(url, alignment) {
        this.operations.overlay = url + ':' + alignment.replace(/[^a-zA-Z]/g, '');;

        return this;
    };

    this.crop = function cr(top, left, bottom, right) {
        if (isNaN(parseInt(top, 10)) || isNaN(parseInt(left, 10)) || isNaN(parseInt(right, 10)) || isNaN(parseInt(bottom, 10))) {
            throw new Error('At least one of top, left, bottom or right are not valid integers' + { top: top, left: left, bottom: bottom, right: right });
        }
        this.operations.crop = top + ',' + left + ',' + bottom + ',' + right;

        return this;
    };

    this.faceDetection = function fd(inFocus) {
        this.operations.face = inFocus ? 'focused' : true;

        return this;
    };

    this.smart = function sm() {
        this.operations.align = 'smart';

        return this;
    };

    for (let index = 0; index < simpleOperations.length; index++) {
        const operation = simpleOperations[index];
        let method = operation;
        if (operation === 'fit-in') {
            method = 'fitIn';
        }
        this[method] = function so() {
            this.operations[operation] = true;

            return this;
        };
    }

    for (let index = 0; index < concatenatedOperations.length; index++) {
        const operation = concatenatedOperations[index];
        let method = operation;

        if (operation === 'overlay') {
            continue;
        }
        if (operation === 'max-kb') {
            method = 'maxKb';
        }
        if (operation === 'max-age') {
            method = 'maxAge';
        }
        this[method] = function co(_value) {
            let value = _value;
            if (value) {
                value = String(value).replace(/[^0-9a-zA-Z,\.]/g, '');
            }
            this.operations[operation] = value;

            return this;
        };
    }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = rezizerBuilder;
}
