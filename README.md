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

# Supported operations
## alignments
- Aligns the image to one of it's edge or to the it's center. If you use `smart()` the system will find the most important part of the image and user it as center. They are themselves operations.
Usage: `.north()`, `.east()`, `.south()`, `.west()`, `.northeast()`, `.southeast()`, `.southwest()`, `.northwest()`, `.smart()` or `.center()`.

## background
- Sets the background color of the image in color name format, #RRGGBB format or 255,255,255 format , where each channel is an integer from 0 to 255. You can specify `blur` to set the background as a distorted and blurred version of the image or `auto` to set the color from the most important color of the image.
Available options: color name (`red`, `purple`), RGB hex color code (`FF0000`, `800080`), `blur` or `auto`.
Usage: `.background('red')`

## blur
- Blurs the image to value from 1 to 1000.
Available range: `1` to `1000`.
Usage: `.blur(2)`

## crop
- Crops a region of the image specified by the top-left coordinate and the bottom-right coordinate of the image. You must specify the four points: `.crop(100, 200, 300, 400)` where `100` is the top position, `200` is the right position, the `300` is the bottom position and `400` is the left position.
Usage: `.crop(10, 20, 100, 110)`

## distort
- Distorts the image to the match the desired resize dimension. No parameter is expected.
Usage: `.distort()`

## extend
- Extends the informed amount of pixels to each side of the image. The order to be used is: top, bottom, left, right.
Usage: `.extend(10, 20, 30, 40)`

## faceDetection
- Detects faces in the image and use them as center of the image for cropping. If you specify the parameter `focused`, the image will focus and crop the image to the detected faces, or leave it blank to just align the image to the part that have faces.
Usage: `.faceDetection('focused')`


## fitIn
- Maintains the image dimension ratio when resizing, adding black bars to the output image. If you combine it with `background`, you will change the color of the bars.
Usage: `.fitIn()`

## fit
- Ifs the source image is smaller than the desired resize dimension, it will keep the image's dimension. If it is bigger, the image will be resized.
Usage: `.fit()`

## flip
- Flips the image vertically.
Usage: `.fit()`

## flop
- Flops the image horizontally.
Usage: `.flop()`

## format
- Changes the output image format.
Available options: `jpeg`, `png`, `webp`
Usage: `.format('jpeg')`

## grayscale
- Changes the color table of the image to grayscale.
Usage: `.grayscale()`

## invert
- Inverts the image colors, making it a negative.
Usage: `.invert()`

## map
- Creates a URL to generate mapping tiles for the informed image. All other operations will be removed when using it.
Usage: `.map()`

## max
- Changes the resized dimensions to the max of height and width and fit with the image ratio.
Usage: `.max()`

## maxAge
- Changes the max-age header to be used for caching the image on the client side
Usage: `.maxAge(3200)`

## maxKb
- Sets the max file size of the output image, in kilobytes.
Usage: `.maxKb(5)`

## min
- Changes the resized dimensions to the min of height and width and fit with the image ratio.
Usage: `.min()`

## overlay
- Expects an URL of a image to be used as a watermark on the output image and placed on a corner specified as the second parameter of the function.
Usage: `.overlay('http://your.domain.own/image.jpg', 'northwest')`

## palette
- Retrieves *N* most important color from the image palette, the values are between 1 and 10. 5 if nothing is specified. All other operations will be removed when using it.
Usage: `.palette()`

## progressive
- Sets progressive filter to the JPEG image.
Usage: `.progressive()`

## quality
- Sets output quality of the image filter to the JPEG image.
Usage: `.quality(70)`

## resize
- Sets output dimension of the image with *height* and *width*.
Usage: `.resize(100, 100)`

## rotate
- Rotates the image in 90°, 180° or 270°.
Usage: `.rotate(90)`

## round
- Creates a round corner of the image. The values are percentages between 0 to 100. If no value is specified, it will use 100 as value.
Usage: `.round()`

## tile
- Creates a URL to generate tiles in the zoomify format for the informed image. The origin image has no size limitations. All other operations will be removed when using it.
Usage: `.tile()`

## tint
- Colorizes the image with a color name format, #RRGGBB format or 255,255,255,1.0 format , where each channel is an integer from 0 to 255 and the alpha channel sits between 0 and 1.
Available options: color name (`red`, `purple`), RGB hex color code (`FF0000`, `800080`).
Usage: `.background(128, 0, 128, .5)` or `.background('FF0000')`
