# RezizerUrl - a NodeJS Rezizer Url Generator

> PLEASE, if you wanna use it in browsers DO NOT use a secured version of Rezizer with the SECRET_KEY. Prefer securing by whitelisting your own image domain.

## Install

```sh
npm install rezizer
```

## Testing

You can run the test suit with:
```
npm test
```

You can run tests to validate the hash generation with:
```
npm run test-hashing
```

You can run tests against a running instance of Rezizer with:
```
npm run test-requests
```
> N.B. It will assume that you have a local version of Rezizer running on "**http://localhost:8080**"


## Usage

```javascript
const Rezizer = require('rezizer-client');
const secretKey = 'OhMyG0shWhatASecretKey!';

// start the generator
const rezizerUrl = new Rezizer('http://your.rezizer.url:port', secretKey);

// get the Rezized url
const imageUrl = rezizerUrl.with('http://your.domain.url/foo/bar.jpg').resize(100,100).generate();
```
