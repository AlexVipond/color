# color

Greatly missing color functions and types for JavaScript.
- Supports three color spaces: *sRGB*, *CIELab* and *CIEXYZ* with precise conversion between them.
- Zero dependencies
- Parser doesn’t rely on browser to parse color strings and could be used in any environment.
- Understands all CSS colors and many more cool features!

## Usage

In the terminal:
```

% npm install @snigos/color

```

Then in the module:
```js

// JavaScript modules
import { color, contrast } from '@snigos/color';

const bgColor = color('#fdfeff');
const bgContrast = contrast(bgColor);

const badPrimaryColor = 'hsl(134deg 80% 50%)';

bgContrast(badPrimaryColor); // 1.67
bgContrast.validate(badPrimaryColor);
/* {
  wcag-aa-normal-text: false,
  wcag-aa-large-text: false,
  wcag-aa-ui: false,
  wcag-aaa-normal-text: false,
  wcag-aaa-large-text: false,
} */

const goodPrimaryColor = bgContrast.find({
  hue: 134,
  saturation: 0.8,
  targetContrast: 4.5,
});

bgContrast(goodPrimaryColor); // 4.54
goodPrimaryColor.toHslString(); // hsl(134deg 80% 29.7%)
goodPrimaryColor.toHexString(); // #0f882b
goodPrimaryColor.toLab().toLchString(); // lch(49.377% 60.817 140.04deg)
goodPrimaryColor.copyWith({ lightness: goodPrimaryColor.lightness + 0.05 });
/*
  sRGBColor {
    red: 18,
    green: 159,
    blue: 51,
    hue: 134,
    saturation: 0.8,
    lightness: 0.346875,
    alpha: 1,
    ...
  }
*/
```

## Motivation

Whether you like it or not, but merging between CSS and JavaScript and using JavaScript for styling in non-CSS environments, like mobile development, is here and most likely will stay for quite a while. The need of JavaScript representations of CSS units is inevitable, especially in a color as things there are about to change with introduction of CIELab color space in modern browsers that is pretty much around the corner. You can read [this article](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/) by [Lea Verou](https://twitter.com/leaverou) explaining well, why Lab colors are pretty cool.

Color package consists of several perfectly tree-shakeable modules:
- color function: color parcer that converts strings like this: #da34e1 into JavaScript object, an sRGBColor instance in this case
- sRGBColor class whos instances store vital information about the color in sRGB color space
- LabColor class that does the same for Lab color space
- XYZColor class that store information about the color in CIEXYZ color space
- contrast function: calculates, validates and generates color in given hue with desired target contrast
- mix and mixLab functions: well, they mix colors either in sRGB or Lab color space

You can only import and use functionality you need.

## FAQ

> Why 3 different classes to store color?

Because underlining color spaces are very different, especially sRGB and Lab colors. They literally mathematically incomparible, that's why we need auxilary class XYZ for conversions between them. They also share same parameters like hue and lightness, that are completely different things and storing it all in one instance would be a nightmare.

> Where's CMYK?

First of all CMYK colors are huge thing by itself and to be done property requires separate library and secondly its subtractive color nature would not allow some core functionality of this library.

> Are color instances immutable?

Yes! Any modification of instance will always produce new instance and all properties of color instances are read-only.

> Does this library comply with CSS Color spec?

This library partually comply with CSS Color spec, it uses the same Bradford adaptation method with default D65 white point for sRGB and D50 white point for Lab (also used by Adobe products), it parses all the possible color notations defined in the spec including CSS named colors, but it also has few important differences:
1. contrast function in this library doesn't floor (truncate) the result, but mathematically rounds it, so contrast value `4.4954` will be correctly shown as `4.5`, however `contrast.validate` function will not validate such contrast as valid according to WCAG2.0 requirements.
2. parser of this library additionally **allows** mixed absolute and relative values like so: `rgb(50% 123 25% / .5)`, which is not valid syntax according to CSS Color spec.
3. `mix` and `mixLab` functions of the library work different from `mix-color` CSS function with semi-transparent colors. Our approach is layering colors on top of each other, also known as alpha blending and their approach is linear interpolation (aka lerp) between two colors:
```js
/**
 * If you put tansparent color on top of green the result will still be green
 * In CSS function mix-color() the result with same parameters will give you "transparent" 
 */
mix('green', 'transparent', '100%').name; // "green"
```

## API

### Contents:
* [color()](#color-1)
  * [String parsing options](#string-parsing-options)
  * [Descriptor object parsing options](#descriptor-object-parsing-options)

* [sRGBColor](#srgbcolor)
  * [sRGBColor.rgb()](#static-srgbcolorrgb)
  * [sRGBColor.rgbArray()](#static-srgbcolorrgbarray)
  * [sRGBColor.hsl()](#static-srgbcolorhsl)
  * [sRGBColor.hslArray()](#static-srgbcolorhslarray)
  * [sRGBColor.hwb()](#static-srgbcolorhwb)
  * [sRGBColor.hwbArray()](#static-srgbcolorhwbarray)
  * [sRGBColor.lin()](#static-srgbcolorlin)
  * [sRGBColor.linArray()](#static-srgbcolorlinarray)
  * [sRGBColor.name](#srgbcolorname)
  * [sRGBColor.red](#srgbcolorred)
  * [sRGBColor.green](#srgbcolorgreen)
  * [sRGBColor.blue](#srgbcolorblue)
  * [sRGBColor.hue](#srgbcolorhue)
  * [sRGBColor.hrad](#srgbcolorhrad)
  * [sRGBColor.hgrad](#srgbcolorhgrad)
  * [sRGBColor.hturn](#srgbcolorhturn)
  * [sRGBColor.saturation](#srgbcolorsaturation)
  * [sRGBColor.lightness](#srgbcolorlightness)
  * [sRGBColor.alpha](#srgbcoloralpha)
  * [sRGBColor.luminance](#srgbcolorluminance)
  * [sRGBColor.mode](#srgbcolormode)
  * [sRGBColor.whitepoint](#srgbcolorwhitepoint)
  * [sRGBColor.prototype.copyWith()](#srgbcolorprototypecopywith)
  * [sRGBColor.prototype.withAlpha()](#srgbcolorprototypewithalpha)
  * [sRGBColor.prototype.invert()](#srgbcolorprototypeinvert)
  * [sRGBColor.prototype.toLin()](#srgbcolorprototypetolin)
  * [sRGBColor.prototype.toHwb()](#srgbcolorprototypetohwb)
  * [sRGBColor.prototype.toLab()](#srgbcolorprototypetolab)
  * [sRGBColor.prototype.toXyz()](#srgbcolorprototypetoxyz)
  * [sRGBColor.prototype.toGrayscale()](#srgbcolorprototypetograyscale)
  * [sRGBColor.prototype.toRgbString()](#srgbcolorprototypetorgbstring)
  * [sRGBColor.prototype.toHexString()](#srgbcolorprototypetohexstring)
  * [sRGBColor.prototype.toHslString()](#srgbcolorprototypetohslstring)
  * [sRGBColor.prototype.toHwbString()](#srgbcolorprototypetohwbstring)

* [LabColor](#labcolor)
  * [LabColor.lab()](#static-labcolorlab)
  * [LabColor.labArray()](#static-labcolorlabarray)
  * [LabColor.lch()](#static-labcolorlch)
  * [LabColor.lchArray()](#static-labcolorlcharray)
  * [LabColor.lightness](#labcolorlightness)
  * [LabColor.a](#labcolora)
  * [LabColor.b](#labcolorb)
  * [LabColor.chroma](#labcolorchroma)
  * [LabColor.hue](#labcolorhue)
  * [LabColor.hrad](#labcolorhrad)
  * [LabColor.hgrad](#labcolorhgrad)
  * [LabColor.hturn](#labcolorhturn)
  * [LabColor.alpha](#labcoloralpha)
  * [LabColor.luminance](#labcolorluminance)
  * [LabColor.mode](#labcolormode)
  * [LabColor.whitepoint](#labcolorwhitepoint)
  * [LabColor.prototype.copyWith()](#labcolorprototypecopywith)
  * [LabColor.prototype.withAlpha()](#labcolorprototypewithalpha)
  * [LabColor.prototype.invert()](#labcolorprototypeinvert)
  * [LabColor.prototype.toRgb()](#labcolorprototypetorgb)
  * [LabColor.prototype.toXyz()](#labcolorprototypetoxyz)
  * [LabColor.prototype.toGrayscale()](#labcolorprototypetograyscale)
  * [LabColor.prototype.toLabString()](#labcolorprototypetolabstring)
  * [LabColor.prototype.toLchString()](#labcolorprototypetolchstring)

* [XYZColor](#xyzcolor)
  * [XYZColor.D50](#static-xyzcolord50)
  * [XYZColor.D65](#static-xyzcolord65)
  * [XYZColor.x](#xyzcolorx)
  * [XYZColor.y](#xyzcolory)
  * [XYZColor.z](#xyzcolorz)
  * [XYZColor.alpha](#xyzcoloralpha)
  * [XYZColor.luminance](#xyzcolorluminance)
  * [XYZColor.mode](#xyzcolormode)
  * [XYZColor.whitepoint](#xyzcolorwhitepoint)
  * [XYZColor.prototype.adapt()](#xyzcolorprototypeadapt)
  * [XYZColor.prototype.toRgb()](#xyzcolorprototypetorgb)
  * [XYZColor.prototype.toLab()](#xyzcolorprototypetolab)
  * [XYZColor.prototype.toXyzArray()](#xyzcolorprototypetoxyzarray)

* [contrast()](#contrast)
  * [contrast.find()](#contrastfind)
  * [contrast.min()](#contrastmin)
  * [contrast.max()](#contrastmax)
  * [contrast.validate()](#contrastvalidate)


***

### `color()`

Parses color from variety of string formats as well as object descriptors. Returns either sRGBColor, LabColor or XYZColor instance depending on the input, or `undefined` if parsing attempt is unsuccessful.

```js

import { color } from 'snigos/color';

color('royalblue'); // => sRGBColor { ... } 

```

#### String parsing options

Parses any CSS color in any format parsable by the browsers and more. Case-insensitive.

```js

import { color } from 'snigos/color';

// Standard named colors and transparent
color('red'); // ✅
color('Yellow'); // ✅
color('SaLmOn'); // ✅
color('transparent'); // ✅

// #RRGGBB hexadecimal notation
color('#FF45AD'); // ✅
color('#ff45AD3e'); // ✅
color('#f4a'); // ✅
color('#f4A3'); // ✅

// RGB function notation
color('rgb(126 13 76 / 0.34)'); // ✅
color('RGBA(84% 5% 43% / 34%)'); // ✅
color('rgba(126 13% 76%)'); // ✅
color('RgB(126, 13, 76, 0.34)'); // ✅
color('rgb( 84% , 5% , 43% , 34% )'); // ✅
color('rgba(126,13.2%,76%)'); // ✅

// HSL function notation
color('hsl(126deg 13% 76% / 0.34)'); // ✅
color('hsla(126 5% 43% / 34%)'); // ✅
color('HSL(0.5TURN,13%,76%)'); // ✅
color('hslA( 2.6rad 100% 50% )'); // ✅
color('hsl(214grad, 13%, 76%, 0.34)'); // ✅

/**
 * !!NOTE!! All notations below only support newer whitespace notation
 * according to CSS Color-4 spec
 */

// HWB function notation
color('hwb(126deg 13% 76% / 0.34)'); // ✅
color('hwb(126 5% 43% / 34%)'); // ✅
color('HWB(0.5TURN 13% 76%)'); // ✅
color('hWb( 2.6rad 100% 50% )'); // ✅

// Lab function notation
color('lab(46% 13 -127 / 0.34)'); // ✅
color('LAB(65.534% 0 -34.23536)'); // ✅

// LCH function notation
color('lch(46% 106.45 127deg / 0.34)'); // ✅
color('LCH( 65.534% 80 -3.145Rad )'); // ✅
color('Lch(15% 140 144.5 / 50%)'); // ✅

// Fanatic notations
color('rgb(-46% 0b110001 0xff / +34e-2)'); // ✅
color('lch(.8e2% 0b1101010 -12e-4turn)'); // ✅

```

#### Descriptor object parsing options

Parses color based on descriptor object provided. Needless to mention that in this case parsing speed will be a bit faster, so if you know values this approach is more preferable. Values of descriptor object can either strings or numbers (strings will slightly affect parsing speed). Alpha value in descriptor object is optional and defaults to 1.

```js

import { color } from 'snigos/color';

// RGB color model
color({
  red: 134,
  green: '14',
  blue: '34%',
  alpha: 0.95,
}); // ✅

// HSL color model
color({
  hue: '264deg',
  saturation: 0.8,
  lightness: 0.34,
  alpha: '95%',
}); // ✅

// HWB color model
color({
  hue: 264,
  whiteness: 0.8,
  blackness: '34%',
}); // ✅

// XYZ color model
color({
  x: 0.34,
  y: 0.4514,
  z: 0.9,
  alpha: 0.95,
}); // ✅

// Lab color model
color({
  lightness: '34%',
  a: 80,
  b: -34,
  alpha: '95%',
}); // ✅

// LCH color model
color({
  lightness: 0.34,
  chroma: 81,
  hue: '-34grad',
}); // ✅

```

***

### `sRGBColor`

Creates instanse of sRGBColor

```js
new sRGBColor(descriptor);
```

Takes color descriptor object as only parameter:
| **Property**  | **Type**   | **Default value**                  | **Notes**                                      |
|---------------|------------|------------------------------------|------------------------------------------------|
| `red`         | `number`   |                                    | Red value in 0...255 range                     |
| `green`       | `number`   |                                    | Green value in 0...255 range                   |
| `blue`        | `number`   |                                    | Blue value in 0...255 range                    |
| `hue`         | `number`   |                                    | Hue value in 0...360 range                     |
| `saturation`  | `number`   |                                    | Saturation value in 0...1 range                |
| `lightness`   | `number`   |                                    | Lightness in 0...1 range                       |
| `alpha`       | `number`   | 1                                  | Alpha value in 0...1 range                     |
| `whitePoint`  | `number[]` | XYZColor.D65 = [0.9505, 1, 1.089]  | Illuminant white point D65 or D50              |

**NOTE**: In real life scenarios you almost never will have to use class constructor in this way and instead you are going to use one of the static methods of the class

***

#### `static sRGBColor.rgb()`

Creates instanse of sRGBColor with provided red, green and blue values

```js
sRGBColor.rgb(descriptor);
```

Takes color descriptor object as only parameter:
| **Property**  | **Type**   | **Default value**                  | **Notes**                                      |
|---------------|------------|------------------------------------|------------------------------------------------|
| `red`         | `number`   |                                    | Red value in 0...255 range                     |
| `green`       | `number`   |                                    | Green value in 0...255 range                   |
| `blue`        | `number`   |                                    | Blue value in 0...255 range                    |
| `alpha`       | `number`   | 1                                  | Alpha value in 0...1 range                     |

Returns sRGBColor instance or undefined if parameters are given incorrectly.

***

#### `static sRGBColor.rgbArray()`

Creates instanse of sRGBColor with provided red, green, blue and alpha values in array

```js
sRGBColor.rgbArray(rgbaArray);
```

Takes array in [red, green, blue, alpha] format. If no alpha value provided, it defaults to 1. Returns sRGBColor instance or undefined if parameters are given incorrectly.

***

#### `static sRGBColor.hsl()`

Creates instanse of sRGBColor with provided hue, saturation and lightness values

```js
sRGBColor.hsl(descriptor);
```

Takes color descriptor object as only parameter:
| **Property**  | **Type**   | **Default value**           | **Notes**                                        |
|---------------|------------|-----------------------------|--------------------------------------------------|
| `hue`         | `number`   |                             | Hue value in 0...360 range, representing degrees |
| `saturation`  | `number`   |                             | Saturation value in 0...1 range                  |
| `lightness`   | `number`   |                             | Lightness value in 0...1 range                   |
| `alpha`       | `number`   | 1                           | Alpha value in 0...1 range                       |

Returns sRGBColor instance or undefined if parameters are given incorrectly.

***

#### `static sRGBColor.hslArray()`

Creates instanse of sRGBColor with provided hue, saturation, lightness and alpha values in array

```js
sRGBColor.hslArray(hslaArray);
```

Takes array in [hue, saturation, lightness, alpha] format. If no alpha value provided, it defaults to 1. Returns sRGBColor instance or undefined if parameters are given incorrectly.

***

#### `static sRGBColor.hwb()`

Creates instanse of sRGBColor with provided hue, whiteness and blackness values

```js
sRGBColor.hwb(descriptor);
```

Takes color descriptor object as only parameter:
| **Property**  | **Type**   | **Default value**           | **Notes**                                        |
|---------------|------------|-----------------------------|--------------------------------------------------|
| `hue`         | `number`   |                             | Hue value in 0...360 range, representing degrees |
| `whiteness`   | `number`   |                             | Whiteness value in 0...1 range                   |
| `blackness`   | `number`   |                             | Blackness value in 0...1 range                   |
| `alpha`       | `number`   | 1                           | Alpha value in 0...1 range                       |

Returns sRGBColor instance or undefined if parameters are given incorrectly.

***

#### `static sRGBColor.hwbArray()`

Creates instanse of sRGBColor with provided hue, whiteness, blackness and alpha values in array

```js
sRGBColor.hwbArray(hwbaArray);
```

Takes array in [hue, whiteness, blackness, alpha] format. If no alpha value provided, it defaults to 1. Returns sRGBColor instance or undefined if parameters are given incorrectly.

***

#### `static sRGBColor.lin()`

Creates instanse of sRGBColor with provided linear values of red, green, blue components through the process of gamma decoding (applying a gamma of 1/2.2 to the values). 

```js
sRGBColor.lin(descriptor);
```

Takes color descriptor object as only parameter:
| **Property**  | **Type**   | **Default value**           | **Notes**                                      |
|---------------|------------|-----------------------------|------------------------------------------------|
| `red`         | `number`   |                             | Red value in 0...1 range                       |
| `green`       | `number`   |                             | Green value in 0...1 range                     |
| `blue`        | `number`   |                             | Blue value in 0...1 range                      |
| `alpha`       | `number`   | 1                           | Alpha value in 0...1 range                     |

Returns sRGBColor instance or undefined if parameters are given incorrectly.

***

#### `static sRGBColor.linArray()`

Creates instanse of sRGBColor with provided linear values of red, green, blue components and alpha values in array

```js
sRGBColor.linArray(linaArray);
```

Takes array in [lin-red, lin-green, lin-blue, alpha] format. If no alpha value provided, it defaults to 1. Returns sRGBColor instance or undefined if parameters are given incorrectly.

***

#### `sRGBColor.name`

Returns color name if color is one of CSS-supported [named colors](https://www.w3.org/TR/css-color-4/#named-colors). If color is semi-transparent (has alpha value less than 1) color name is concatenated with `*`.

```js

const crimson = sRGBColor.rgbArray([220, 20 ,60]);
crimson.name; // "crimson"

const semiBlack = sRGBColor.rgbArray([0, 0, 0, 0.4]);
semiBlack.name; // "black*"

```

***

#### `sRGBColor.red`
#### `sRGBColor.green`
#### `sRGBColor.blue`

Return red, green and blue values of the color identifying a point in the sRGB color space. Output is a number in [0...255] range:

```js

import { color } from 'snigos/color';


// Color input is case-insensitive
const white = color('WhItE');
white.red; // 255
white.green; // 255
white.blue; // 255

const royalblue = color('#4169E1');
royalblue.red; // 65
royalblue.green; // 105
royalblue.blue; // 225

```

***

#### `sRGBColor.hue`
#### `sRGBColor.hrad`
#### `sRGBColor.hgrad`
#### `sRGBColor.hturn`

Returns the hue angle of the color on the color wheel in degrees (`hue`), radians (`hrad`), gradients (`hgrad`) and turns or cycles (`hturn`) respectively. 0 degrees is referred to red color.

```js

import { color } from 'snigos/color';

const darkgreen = color('hsl(120deg 100% 25%)');
darkgreen.hue; // 120
darkmagenta.hrad; // 2.0944
darkmagenta.hgrad; // 133.3333
darkmagenta.hturn; // 0.3333

const darkmagenta = color('hsla(-0.125turn, 65%, 35%)');
darkmagenta.hue; // 315
darkmagenta.hrad; // 5.4978
darkmagenta.hgrad; // 350
darkmagenta.hturn; // 0.875


```

***


#### `sRGBColor.saturation`

Returns the color saturation value of HSL representation **as number**. Number in [0...1] range, where 0 is completely desaturated color and 1 - fully saturated color.

```js

import { color } from 'snigos/color';

const gold = color('#fc9');
gold.saturation; // 1
gold.toHslString(); // "hsl(30 100% 80%)"

const slateGray = color('slategray');
slateGray.saturation; // 0.13

```

***

#### `sRGBColor.lightness`

Returns the color lightness value of HSL representation **as number**. Number in [0...1] range, where 0 is completely dark color (black) and 1 - fully light color (white).

```js

import { color } from 'snigos/color';

const deepSkyBlue = color('rgb(0 191 255)');
deepSkyBlue.lightness; // 0.5
deepSkyBlue.toHslString(); // "hsl(195 100% 50%)"

const textColor = color('#2a2e2f');
textColor.lightness; // 0.17


```

***

#### `sRGBColor.alpha`

Returns the value of the alpha-channel of the color. Number in [0...1] range, where 0 is completely transparent and 1 - has full opacity.

```js

import { color } from 'snigos/color';

const blue = color('#23f');
blue.alpha; // 1

const semiTransparent = color('#23f4');
semiTransparent.alpha; // 0.2667

const transparent = color('transparent');
transparent.alpha; // 0

```

***

#### `sRGBColor.luminance`

Returns relative luminance of the color of any point in a colorspace, normalized to 0 for darkest black and 1 for lightest white. Number in [0...1] range. Relative luminance is used for calculating color contrast.

```js

import { color, contrast } from 'snigos/color';

const royalblue = color('#4169e1');
royalblue.luminance; // 0.1666104

const violet = color('violet');
violet.luminance; // 0.4031848

// Calculate contrast ratio
(violet.luminance + 0.05) / (royalblue.luminance + 0.05); // 2.0921654731259443
contrast(royalblue, violet); // 2.09

```

***

#### `sRGBColor.hueGroup`
#### `sRGBColor.hueGroupOffset`

Returns index of the color group of the color's hue on color wheel. Color groups:
| **hueGroup index** | **Group name**  | **Hue range** |
|--------------------|-----------------|---------------|
| 0                  | Red-Violet      | 315 ... 344   |
| 1                  | Red             | 345 ... 14    |
| 2                  | Orange          | 15 ... 44     |
| 3                  | Yellow          | 45 ... 74     |
| 4                  | Yellow-Green    | 75 ... 104    |
| 5                  | Green           | 105 ... 134   |
| 6                  | Green-Cyan      | 135 ... 164   |
| 7                  | Cyan            | 165 ... 194   |
| 8                  | Blue-Cyan       | 195 ... 224   |
| 9                  | Blue            | 225 ... 254   |
| 10                 | Blue-Violet     | 255 ... 284   |
| 11                 | Violet          | 285 ... 314   |

Property `Color.hueGroupOffset` returns hue offset within color's group. Number in [0...29] range.

```js

import { color } from 'snigos/color';

const fire = color('#fd4523');
fire.hue; // 9
fire.hueGroup; // 0
fire.hueGroupOffset; // 24

const coolNavy = color('rgb(60, 20, 220)');
coolNavy.hue; // 252
coolNavy.hueGroup; // 8
coolNavy.hueGroupOffset; // 27

```

Even though color warmth is hugely subjective, you can can presume color groups 0 - 5 as warm colors and 6 - 11 as cool, that's actually the main reason why group indexation shifted back.

**NOTE:** The central color of each group will have `Color.hueGroupOffset` equal to 15, not 0.


***

#### `sRGBColor.mode`

Returns mode of the color, `0` is color is light and `1` if color is dark. Useful to determine font color for certain background. It is **guaranteed** that 'black' color will always have sufficient contrast with any colors of mode "0" and otherwise 'white' color will have sufficient contrast with colors of mode "1".

```js

import { color } from 'snigos/color';

const backgroundColor = color('#2980B9');
const textColor = color(backgroundColor.mode ? 'white' : 'black');

backgroundColor.mode; // 1
textColor.mode; // 0

```

***

#### `sRGBColor.whitePoint`

Returns array of XYZ tristimulus values of CIE standard illuminant of current color. Defaults to `XYZColor.D65`: https://en.wikipedia.org/wiki/Illuminant_D65 for sRGBColor

***

#### `sRGBColor.prototype.copyWith()`

Copies color instance with provided parameters and returns new sRGBColor instance. Accepted parameters: `red`, `green`, `blue`, `hue`, `saturation`, `lightness`, `alpha`. Note: red, green and blue parameters have priority over hue, saturation and lightness, meaning if you use red and hue value at the same time, the latter will be ignored.

```js

import { color } from '@snigos/color';

const maroon = color('maroon');
const lightMaroon = maroon.copyWith({ lightness: maroon.lightness + 0.2 });

maroon.lightness; // 0.25
lightMaroon.lightness; // 0.45

```

***

#### `sRGBColor.prototype.withAlpha()`

Copies color instance with provided alpha value. Shortcut method for `.copyWith({ alpha: value })`.

```js

import { color } from '@snigos/color';

const lipsRed = color('#fa3c24');
const lipsRed24 = lipsRed.withAlpha(0.24);

lipsRed24.alpha; // 0.24
lipsRed24.toHexString(); // #fa3c243d

```

***

#### `sRGBColor.prototype.invert()`

Inverts color. Returns new instance of Color representing inverted color.

```js

import { color } from '@snigos/color';

const invertedPink = color('pink').invert();
invertedPink.toRgbString(); // rgb(0 63 52)

invertedPink.invert().name; // pink

```

***

#### `sRGBColor.prototype.toLin()`

Returns array of linear (gamma decoded) values of red, green and blue.

```js

import { color } from '@snigos/color';

const green = color('forestgreen');
green.toLin(); // [0.0159963, 0.2581829, 0.0159963]

```

**NOTE**: Return value doesn't include alpha value

***

#### `sRGBColor.prototype.toHwb()`

Returns array of hue, whiteness and blackness values of the according [HWB color model](https://en.wikipedia.org/wiki/HWB_color_model), as well as alpha channel value.

```js

import { color } from '@snigos/color';

const cyan = color('cyan');
cyan.toHwb(); // [180, 0, 0, 1]
cyan.toHwbString(); // hwb(180deg 0% 0%)

```

***

#### `sRGBColor.prototype.toLab()`

Returns new LabColor instance of the color representing the color in CIELab Color space.

```js

import { color, sRGBColor, LabColor } from '@snigos/color';

const purpleBlue = color('hwb(264 13% 0%)');
const purpleBlueLab = purpleBlue.toLab();

purpleBlueLab instanceof sRGBColor; // false
purpleBlueLab instanceof LabColor; // true
purpleBlueLab.toLabString(); // lab(30.998% 65.18 -90.771)
purpleBlueLab.toLchString(); // lch(30.998% 111.749 305.681deg)

```

***

#### `sRGBColor.prototype.toXyz(whitePoint)`

Returns new XYZColor instance of the color representing the color in CIEXYZ Color space. Takes optional whitepoint argument, array of XYZ tristimulus values of CIE standard illuminant, either XYZColor.D50 or XYZColor.D65, if no value provided, default sRGBColor.whitePoint is used.

```js

import { color, sRGBColor, XYZColor } from '@snigos/color';

const bikingRed = color('#77212E');
const bikingRedXyz = purpleBlue.toXyz();

bikingRedXyz instanceof sRGBColor; // false
bikingRedXyz instanceof XYZColor; // true
bikingRedXyz.x; // 0.1730064
bikingRedXyz.y; // 0.0739667
bikingRedXyz.z; // 0.6960912

bikingRed.whitePoint; // [0.9505, 1, 1.089]
bikingRedXyz.whitePoint; // [0.9505, 1, 1.089]

```

***

#### `sRGBColor.prototype.toGrayscale()`

Returns new grayscale color - shade of gray with the same intensity as initial color.

```js

import { color } from '@snigos/color';

const green = color('green');
const gray = green.toGrayscale();

gray.saturation; // 0
gray.toRgbString('relative'); // rgb(42.7% 42.7% 42.7%)

```

**NOTE:** grayscale conversion is not the same as desaturation!
![Grayscale Demo](/__screenshots__/to-grayscale-demo.jpg)

**NOTE:** because of the nature of Lab color space (separating lightness from chromacity), converting to LabColor before converting to grayscale will generally give you result with greater precision:

```js

import { color } from '@snigos/color';

const green = color('green');
const gray = green.toGrayscale();
const grayLab = green.toLab().toGrayscale();

green.luminance; // 0.1543731
gray.luminance; // 0.1529262
grayLab.luminance; // 0.1547457

```

***

#### `sRGBColor.prototype.toRgbString(format)`

Returns CSS string representation of color in rgb function notation compliable with CSS Color-4 spec in two different formats: `absolute` (default) and `relative`:

```js

import { color } from '@snigos/color';

const orange = color('orange');
orange.toRgbString(); // rgb(255 165 0)
orange.toRgbString('absolute'); // rgb(255 165 0)
orange.toRgbString('relative'); // rgb(100% 64.7% 0%)

```

**NOTE:** color library uses newer whitespace notation for all string representations (instead of older comma-separated notation)

**NOTE:** default precision of 1 decimal place is applied in relative format

***

#### `sRGBColor.prototype.toHexString()`

Returns CSS string representation of color in #-hexadecimal notation compliable with CSS Color-4 spec

```js

import { color } from '@snigos/color';

const mint = color('#56FF7876');
mint.toHexString(); // #56ff7876
mint.toRgbString(); // rgb(86 255 120 / 0.4627)

```

**NOTE:** all strings are normalized to lowercase

**NOTE:** rgb function notation will still use `rgb` as function name even if alpha value is below 1, in contrast to older notation using `rgba` function name - it's not a bug.

***

#### `sRGBColor.prototype.toHslString(precision)`
#### `sRGBColor.prototype.toHwbString(precision)`

Returns CSS string representation of color in HSL and HWB function notation accordingly compliable with CSS Color-4 spec and using given precision (defaults to 1).

```js

import { color } from '@snigos/color';

const eden = color('#264E36');
eden.toHslString(); // hsl(144deg 34.5% 22.7%)
eden.toHwbString(); // hwb(144deg 69.4% 14.9%)
eden.toHslString(0); // hsl(144deg 34% 23%)
eden.toHwbString(0); // hwb(144deg 69% 15%)
eden.toHslString(4); // hsl(144deg 34.4828% 22.7451%)
eden.toHwbString(4); // hwb(144deg 69.4118% 14.902%)

```

**NOTE:** `-deg` suffix denoting degrees will always be added to values representing color hue

***

### `LabColor`

Creates instanse of LabColor

```js
new LabColor(descriptor);
```

Takes color descriptor object as only parameter:
| **Property**  | **Type**   | **Default value**                    | **Notes**                                      |
|---------------|------------|--------------------------------------|------------------------------------------------|
| `lightness`   | `number`   |                                      | Lightness value in 0...1 range                 |
| `a`           | `number`   |                                      | a value in -128...127 range                    |
| `b`           | `number`   |                                      | b value in -128...127 range                    |
| `hue`         | `number`   |                                      | Hue value in 0...360 range                     |
| `chroma`      | `number`   |                                      | Chroma value in 0...260 range                  |
| `alpha`       | `number`   | 1                                    | Alpha value in 0...1 range                     |
| `whitePoint`  | `number[]` | XYZColor.D50 = [0.96422, 1, 0.82521] | Illuminant white point D65 or D50              |

**NOTE**: In real life scenarios you almost never will have to use class constructor in this way and instead you are going to use one of the static methods of the class described below

***

#### `static LabColor.lab()`

Creates instanse of LabColor with provided lightness, a and b values

```js
LabColor.lab(descriptor);
```

Takes color descriptor object as only parameter:
| **Property**  | **Type**   | **Default value**                  | **Notes**                                      |
|---------------|------------|------------------------------------|------------------------------------------------|
| `lightness`   | `number`   |                                    | Lightness value in 0...1 range                 |
| `a`           | `number`   |                                    | a value in -128...127 range                    |
| `b`           | `number`   |                                    | b value in -128...127 range                    |
| `alpha`       | `number`   | 1                                  | Alpha value in 0...1 range                     |

Returns LabColor instance or undefined if parameters are given incorrectly.

***

#### `static LabColor.labArray()`

Creates instanse of LabColor with provided lightness, a, b and alpha values in array

```js
LabColor.labArray(array);
```

Takes array in [lightness, a, b, alpha] format. If no alpha value provided, it defaults to 1. Returns LabColor instance or undefined if parameters are given incorrectly.

***

#### `static LabColor.lch()`

Creates instanse of LabColor with provided lightness, chroma and hue values

```js
LabColor.lch(descriptor);
```

Takes color descriptor object as only parameter:
| **Property**  | **Type**   | **Default value**           | **Notes**                                        |
|---------------|------------|-----------------------------|--------------------------------------------------|
| `lightness`   | `number`   |                             | Lightness value in 0...1 range                   |
| `chroma`      | `number`   |                             | Chroma value in 0...260 range                    |
| `hue`         | `number`   |                             | Hue value in 0...360 range, representing degrees |
| `alpha`       | `number`   | 1                           | Alpha value in 0...1 range                       |

Returns LabColor instance or undefined if parameters are given incorrectly.

***

#### `static LabColor.lchArray()`

Creates instanse of LabColor with provided lightness, chroma, hue and alpha values in array

```js
LabColor.lchArray(array);
```

Takes array in [lightness, chroma, hue, alpha] format. If no alpha value provided, it defaults to 1. Returns LabColor instance or undefined if parameters are given incorrectly.

***

#### `LabColor.lightness`

Returns the Lab color lightness value **as number**. Number in [0...1] range, where 0 is completely dark color (black) and 1 - fully light color (white).

```js

import { color } from 'snigos/color';

const yellowish = color('lab(53% 8.88 54.53)');
yellowish.lightness; // 0.53

```

**NOTE:** you might see most of the libraries storing Lab lightness value in 0...100 range, which is creating inconsistency with other values denoted as percentage and which is why we **don't** do it.

***

#### `LabColor.a`
#### `LabColor.b`

Return value of a and b components of the color. You can read more about Lab color and its axis [here](https://en.wikipedia.org/wiki/CIELAB_color_space).

```js

import { color } from 'snigos/color';

const blueLab = color('blue').toLab();
blueLab.a; // 68.2985992
blueLab.b; // -112.0294101

```

***


#### `LabColor.chroma`

Returns the color chroma value of Lab color **as number**. Number in [0...260] range, on practice this number will rarely be higher than 132.

```js

import { color } from 'snigos/color';

const grayLab = color('#777').toLab();
grayLab.chroma; // 0.0000203
grayLab.toLchString(); // lch(50.034% 0 16.916deg)

const aquaLab = color('aqua').toLab();
aquaLab.chroma; // 52.8284851
aquaLab.toLchString(); // lch(90.666% 52.828 196.452deg)

```

***

#### `LabColor.hue`
#### `LabColor.hrad`
#### `LabColor.hgrad`
#### `LabColor.hturn`

Returns the hue angle of the color on the Lab color wheel in degrees (`hue`), radians (`hrad`), gradients (`hgrad`) and turns or cycles (`hturn`) respectively. Note: Lab color wheel is quite different from RGB color wheel we mostly use, 0 degrees in Lab Color wheel approximately equal to 330-340 degrees on RGB color wheel depending on chroma value.

```js

import { color } from 'snigos/color';

const red = color('red');
const redLab = red.toLab();

red.hue; // 0
redLab.hue; // 40.8526349
redLab.hrad; // 0.713013
redLab.hgrad; // 45.3918166
redLab.hturn; // 0.1134795

```

***

#### `LabColor.alpha`

Returns the value of the alpha-channel of the color. Number in [0...1] range, where 0 is completely transparent and 1 - has full opacity.

```js

import { LabColor } from 'snigos/color';

const labColor = LabColor.lab({ lightness: 0.34, a: -23, b: 124 });
labColor.alpha; // 1

const semiTransparentLabColor = labColor.withAlpha(0.5);
semiTransparentLabColor.alpha; // 0.5

```

***

#### `LabColor.luminance`

Returns relative luminance of the color of any point in a colorspace, normalized to 0 for darkest black and 1 for lightest white. Number in [0...1] range. Relative luminance is used for calculating color contrast.

```js

import { color, contrast } from 'snigos/color';

const royalblueLab = color('#4169e1').toLab();
royalblueLab.luminance; // 0.1586714

const violet = color('violet');
violet.luminance; // 0.4031848

// Calculate contrast ratio
(violet.luminance + 0.05) / (royalblueLab.luminance + 0.05); // 2.171762876944325
contrast(royalblueLab, violet); // 2.17
// NOTE: You can calculate contrast between sRGBColor and LabColor instances

```

***

#### `LabColor.mode`

Returns mode of the color, `0` is color is light and `1` if color is dark. Useful to determine font color for certain background. It is **guaranteed** that black color will always have sufficient contrast with any colors of mode "0" and otherwise white color will have sufficient contrast with colors of mode "1".

```js

import { color } from 'snigos/color';

const bgColorLab = color('lab(5% 0 0)');
const textColor = color(backgroundColor.mode ? 'white' : 'black');

bgColorLab.mode; // 1
textColor.mode; // 0
textColor.name; // white

```

***

#### `LabColor.whitePoint`

Returns array of XYZ tristimulus values of CIE standard illuminant of current color. Defaults to `XYZColor.D50` for LabColor

***

#### `LabColor.prototype.copyWith()`

Copies color instance with provided parameters and returns new LabColor instance. Accepted parameters: `lightness`, `a`, `b`, `chroma`, `hue`, and `alpha`. Note: `a` and `b` parameters have priority over `chroma` and `hue`, meaning if you use a and hue value at the same time, the latter will be ignored.

```js

import { color } from '@snigos/color';

const turmeric = color('#FE840E').toLab();
const lightTurmeric = turmeric.copyWith({ lightness: turmeric.lightness + 0.1 });

turmeric.toLabString(2); // lab(68.48% 43.3 73.12)
lightTurmeric.toLabString(2); // lab(78.48% 73.12 73.12)

```

***

#### `LabColor.prototype.withAlpha()`

Copies color instance with provided alpha value. Shortcut method for `.copyWith({ alpha: value })`.

```js

import { color } from '@snigos/color';

const lipsRedLab = color('#fa3c24').toLab();
const lipsRedLab24 = lipsRedLab.withAlpha(0.24);

lipsRedLab24.alpha; // 0.24
lipsRedLab24.toLchString(); // lch(56.7% 91.955 39.804deg / 0.24)

```

***

#### `LabColor.prototype.invert()`

Inverts color. Returns new instance of LabColor representing inverted color, which in Lab color space means negation of `a` abd `b` components.

```js

import { color } from '@snigos/color';

const pinkLab = color('pink').toLab();
const invertedPinkLab = pinkLab.invert();

pinkLab.toLabString(); // lab(83.788% 24.44 3.76)
invertedPinkLab.toLabString(); // lab(83.788% -24.44 -3.76)

```

***

#### `LabColor.prototype.toRgb()`

Returns new sRGBColor instance of the color representing the color in sRGB Color space.

```js

import { sRGBColor, LabColor } from '@snigos/color';

const purpleBlue = LabColor.lab({ lightness: 0.3, a: 65, b: -90 });
const purpleBlueRgb = purpleBlue.toRgb();

purpleBlueRgb instanceof LabColor; // false
purpleBlueRgb instanceof sRGBColor; // true
purpleBlueRgb.toHexString(); // #5900de
purpleBlueRgb.toRgbString(); // rgb(89 0 222)

```

***

#### `LabColor.prototype.toXyz(whitePoint)`

Returns new XYZColor instance of the color representing the color in CIEXYZ Color space. Takes optional whitepoint argument, array of XYZ tristimulus values of CIE standard illuminant, either XYZColor.D50 or XYZColor.D65, if no value provided, default LabColor.whitePoint is used.

```js

import { color, LabColor, XYZColor } from '@snigos/color';

const sweetCornLab = color('#F0EAD6').toLab();
const sweetCornXyz = sweetCornLab.toXyz();

sweetCornXyz instanceof LabColor; // false
sweetCornXyz instanceof XYZColor; // true
sweetCornXyz.x; // 0.7930204
sweetCornXyz.y; // 0.8244821
sweetCornXyz.z; // 0.5722771

sweetCornLab.whitePoint; // [0.96422, 1, 0.82521]
sweetCornXyz.whitePoint; // [0.96422, 1, 0.82521]

```

***

#### `LabColor.prototype.toGrayscale()`

Returns new grayscale color - shade of gray with the same lightness value as initial color.

```js

import { color } from '@snigos/color';

const redLab = color('lch(45% 100 40)');
const gray = redLab.toGrayscale();

redLab.lightness; // 0.45
gray.lightness; // 0.45
gray.a; // 0
gray.b; // 0
gray.chroma; // 0

```

***

#### `LabColor.prototype.toLabString(precision)`
#### `LabColor.prototype.toLchString(precision)`

Returns CSS string representation of color in Lab and LCH function notation accordingly compliable with CSS Color-4 spec and using given precision (defaults to 3).

```js

import { color } from '@snigos/color';

const edenLab = color('#264E36').toLab();
edenLab.toLabString(); // lab(29.704% -19.6 9.714)
edenLab.toLchString(); // lch(29.704% 21.875 153.636deg)
edenLab.toLabString(0); // lab(30% -20 10)
edenLab.toLchString(0); // lch(30% 22 154deg)
edenLab.toLabString(6); // lab(29.70438% -19.599741 9.714303)
edenLab.toLchString(6); // lch(29.70438% 21.875044 153.636422deg)

```

**NOTE:** `-deg` suffix denoting degrees will always be added to values representing color hue

***

### `XYZColor`

Creates instanse of XYZColor

```js
new XYZColor(descriptor);
```

Takes color descriptor object as only parameter:
| **Property**  | **Type**   | **Default value**                    | **Notes**                                      |
|---------------|------------|--------------------------------------|------------------------------------------------|
| `x`           | `number`   |                                      | x value in 0...1 range                         |
| `y`           | `number`   |                                      | y value in 0...1 range                         |
| `z`           | `number`   |                                      | z value in 0...1 range                         |
| `alpha`       | `number`   | 1                                    | Alpha value in 0...1 range                     |
| `whitePoint`  | `number[]` | XYZColor.D65 = [0.9505, 1, 1.089]    | Illuminant white point D65 or D50              |

***

#### `static XYZColor.D50`

Returns array of XYZ tristimulus values of CIE standard illuminant D50: [0.96422, 1, 0.82521]

```js

const xyzD50 = new XYZColor({ x: 0.79, y: 0.825, z: 0.57, whitePoint: XYZColor.D50 });

```

***

#### `static XYZColor.D65`

Returns array of XYZ tristimulus values of CIE standard illuminant D65: [0.9505, 1, 1.089]

```js

const xyzD65 = new XYZColor({ x: 0.79, y: 0.825, z: 0.57, whitePoint: XYZColor.D65 });

```

***

#### `XYZColor.x`
#### `XYZColor.y`
#### `XYZColor.z`

Returns tristimulus value `x`, `y` or `z` accordingly of the XYZColor. You can read more about meaning of these values [here](https://en.wikipedia.org/wiki/CIE_1931_color_space).

```js

import { color } from 'snigos/color';

const cyanXyz = color('cyan').toXyz();
cyanXyz.x; // 0.5380136
cyanXyz.y; // 0.7873272
cyanXyz.z; // 1

```

**NOTE:** you might see some libraries storing XYZ values in 0...100 range, which we've decided not to do.

***

#### `XYZColor.alpha`

Returns the value of the alpha-channel of the color. Number in [0...1] range, where 0 is completely transparent and 1 - has full opacity.

```js

import { XYZColor } from 'snigos/color';

const xyz = new XYZColor({ x: 0.34, y: 0.23, z: 1, alpha: 0.5 });
xyz.alpha; // 0.5

```

***

#### `XYZColor.luminance`

Returns relative luminance of the color. In XYZ color space it is the Y value. Relative luminance is used for calculating color contrast.

```js

import { XYZColor, contrast } from 'snigos/color';

const royalblueXyz = color('#4169e1').toXyz();
royalblueXyz.y; // 0.1666104
royalblueXyz.luminance; // 0.1666104
royalblueXyz.y === royalblueXyz.luminance; // true

const violet = color('violet');
violet.luminance; // 0.4031848

// Calculate contrast ratio
(violet.luminance + 0.05) / (royalblueXyz.luminance + 0.05); // 2.0921654731259443
contrast(royalblueXyz, violet); // 2.09
// NOTE: You can calculate contrast between sRGBColor and XYZColor instances

```

***

#### `XYZColor.mode`

Returns mode of the color, `0` is color is light and `1` if color is dark. Useful to determine font color for certain background. It is **guaranteed** that black color will always have sufficient contrast with any colors of mode "0" and otherwise white color will have sufficient contrast with colors of mode "1".

```js

import { color } from 'snigos/color';

const bgColorXyz = color('lab(5% 0 0)').toXyz();
const textColor = color(bgColorXyz.mode ? 'white' : 'black');

bgColorXyz.mode; // 1
textColor.mode; // 0
textColor.name; // white

```

***

#### `XYZColor.whitePoint`

Returns array of XYZ tristimulus values of CIE standard illuminant of current color. Defaults to `XYZColor.D65`.

***

#### `XYZColor.prototype.adapt(whitePiont)`

Adapts XYZColor from D50 white point to D65 white point or vice versa. Returns new instance of XYZColor adapted to new white point.

```js

import { color, XYZColor } from '@snigos/color';

const pinkXyzD65 = color('pink').toXyz();
const pinkXyzD50 = pinkXyzD65.adapt(XYZColor.D50);

pinkXyzD65.x; // 0.7086978
pinkXyzD50.x; // 0.7244961

```

***

#### `XYZColor.prototype.toRgb()`

Returns new sRGBColor instance of the color representing the color in sRGB Color space.

```js

import { sRGBColor, XYZColor } from '@snigos/color';

const purpleBlueXyz = new XYZColor({ x: 0.1647, y: 0.07, z: 0.666 });
const purpleBlueRgb = purpleBlueXyz.toRgb();

purpleBlueRgb instanceof XYZColor; // false
purpleBlueRgb instanceof sRGBColor; // true
purpleBlueRgb.toHexString(); // #4e00f7
purpleBlueRgb.toRgbString(); // rgb(78 0 247)

```

***

#### `XYZColor.prototype.toLab()`

Returns new LabColor instance of the color representing the corresponding color in CIELab Color space. If current white point is D65, white point will be adapted to D50, the white point used in Lab color space.

```js

import { color, LabColor, XYZColor } from '@snigos/color';

const sweetCornXyz = color('#F0EAD6').toXyz();
const sweetCornLab = sweetCornXyz.toLab();

sweetCornLab instanceof XYZColor; // false
sweetCornLab instanceof LabColor; // true
sweetCornLab.toLchString(2); // lch(92.77% 10.52 92.1deg)

sweetCornXyz.whitePoint; // [0.9505, 1, 1.089] D65 inherited from sRGB
sweetCornLab.whitePoint; // [0.96422, 1, 0.82521] D50 as default Lab Color

```

***

#### `XYZColor.prototype.toXyzArray()`

Returns `x`, `y` and `z` values of the color in array. Alpha value **will not** be included.

```js

import { XYZColor } from '@snigos/color';

const xyzColor = new XYZColor({ x: 0.5505, y: 0.234, z: 0.98, alpha: 0.45 });
xyzColor.toXyzArray(); // [0.5505, 0.234, 0.98]

```

***

### `contrast()`

Calcurates absolute contrast factor of 1 between two provided colors. Returns number in [1...21] range, **regardless of the order** of arguments. The third argument is precision of the output.

| **Parameter** | **Type**   | **Default value** | **Notes**                                      |
|---------------|------------|-------------------|------------------------------------------------|
| `base`        | `AnyColor` | color('white')    | Base/background color to be compared           |
| `compareColor`| `AnyColor` |                   | Color to be compared against base color        |
| `precision`   | `number`   | 2                 | Output precision                               |
 
```js

import { contrast } from '@snigos/color';

contrast('white', 'black'); // 21
contrast('black', 'white'); // 21

contrast('blue', 'salmon', 9); // 3.436280745

```

`contrast()` function is curry-friendly, meaning if only one argument (base color) is provided, it will return function that will expect the color to compare and optional precision as arguments. It is useful when you have single background color and want to compare other colors to it.

```js

import { contrast } from '@snigos/color';

const bgContrast = contrast('#fafeff');
typeof bgContrast; // function
bgContrast('red'); // 3.94
bgContrast('green', 4); // 5.0607
bgContrast('blue', 1); // 8.5

```

***

#### `contrast.find()`

```js

contrast.find(base, descriptor);

```

Returns array of sRGBColor instances according to descriptor with hue, saturation and target contrast value compared to provided base color. If no colors found with given target contrast, returns empty array. If two colors has been returned, the first color will always be lighter and the second darker than provided base color.

Color descriptor object:
| **Property**      | **Type**   | **Default value**           | **Notes**                                        |
|-------------------|------------|-----------------------------|--------------------------------------------------|
| `hue`             | `number`   |                             | Hue value in 0...360 range, representing degrees |
| `saturation`      | `number`   | 1                           | Saturation value in 0...1 range                  |
| `targetContrast`  | `number`   | 7                           | Target contrast between output and base colors   |

```js

import { color, contrast } from '@snigos/color';

const bgColor = color('#2a2e2f');
const [primaryColor] = contrast.find(bgColor, {
  hue: 264,
  targetContrast: 4.75,
});

contrast(bgColor, primaryColor); // 4.77
primaryColor.hue; // 264
primaryColor.saturation; // 1
primaryColor.toHslString(); // hsl(264deg 100% 74.6%)

const shades = contrast.find('#777', {
  hue: 0,
  saturation: 0,
  targetContrast: 3.2,
});

shades.length; // 2
shades.map((shade) => contrast('#777', shade)); // [3.2, 3.29]
shades.map((shade) => shade.toRgbString()); // ["rgb(218 218 218)", "rgb(40 40 40)"]
shades.map((shade) => shade.mode); // [0, 1]

```

As with `contrast()` function, currying will work with any contrast method:

```js

import { contrast } from '@snigos/color';

const bgContrast = contrast('#2a2e2f');
const [primaryColor] = bgContrast.find({
  hue: 264,
  saturation: 0.5,
  targetContrast: 7,
});

bgContrast(primaryColor); // 7
primaryColor.hue; // 264
primaryColor.saturation; // 0.5
primaryColor.toHexString(); // #c5b0e5

```

**NOTE:** Due to the fact there is no formula to achive the result in mathematical way, at least to my knowledge, `find` method uses binary search (aka divide and conquer) to match the closest color. Matching delta is 0.025 and if it's not met algorithm outputs the closest greater to target contrast color.

***

#### `contrast.min()`
#### `contrast.max()`

```js

contrast.min(base, colorArray);
contrast.max(base, colorArray);

```

Returns sRGBColor instance of color from colorArray with minimum and maximum contrast to base color accordingly. If two or more colors will result in the same contrast, the first one will be returned.

```js

import { contrast } from '@snigos/color';

const minContrast = contrast.min('white', ['red', 'green', 'blue']);
const maxContrast = contrast.max('white', ['red', 'green', 'blue']);
minContrast.name; // red
maxContrast.name; // blue

const bgContrast = contrast('#a56');
const fontColor = bgContrast.max(['black', 'white']);
fontColor.name; // white
bgContrast('white'); // 5
bgContrast('black'); // 4.2

```

***

#### `contrast.validate()`

```js

contrast.validate(base, anyColor);

```

Returns [WCAG2.x](https://www.w3.org/WAI/standards-guidelines/wcag/) validation response based on the contrast between colors provided. Each value in response is a boolean indicating success criteria for corresponding WCAG rule.

Validation response object:
| **Property**           | **Type**    | **Notes**                             |
|------------------------|-------------|---------------------------------------|
| `wcag-aa-large-text`   | `boolean`   | WCAG Level AA Large Text (`>= 3`)     |
| `wcag-aa-normal-text`  | `boolean`   | WCAG Level AA Normal Text (`>= 4.5`)  |
| `wcag-aa-ui`           | `boolean`   | WCAG Level AA UI Components (`>= 3`)  |
| `wcag-aaa-large-text`  | `boolean`   | WCAG Level AAA Large Text (`>= 4.5`)  |
| `wcag-aaa-normal-text` | `boolean`   | WCAG Level AAA Normal Text (`>= 7`)   |

```js

import { contrast } from '@snigos/color';

const bgContrast = contrast('white');
bgContrast.validate('#4242FF');
/*
  {
    wcag-aa-large-text: true,
    wcag-aa-normal-text: true,
    wcag-aa-ui: true,
    wcag-aaa-large-text: true,
    wcag-aaa-normal-text: false
  }
*/

bgContrast('#4242FF'); // 6.08

```

**NOTE:** If you're looking for WCAG validation criteria only you **shall not** rely on `contrast()` value, but should use `contrast.validate()` instead because of the rounding precision. `contrast()` function mathematically rounds contrast value, so `4.4954` will be correctly shown as `4.5`, however `contrast.validate` function will not validate such contrast as valid according to WCAG Level AA Normal Text requirements.

```js

contrast('white', '#ec1400'); // 4.5
contrast.validate('white', '#ec1400')['wcag-aa-normal-text']; // false
contrast('white', '#ec1400', 5); // 4.49886 (Less than 4.5)

```

***

### `mix()`

Mixes two colors with optional alpha value applied to the second color. Returns new mixed Color instance. Uses technique of layering colors on top of each other also known as alpha blending.

```js

import { mix } from '@snigos/color';

mix(base, layer, layerAlpha);

```

| **Parameter** | **Type**   | **Default value** | **Notes**                                      |
|---------------|------------|-------------------|------------------------------------------------|
| `base`        | `AnyColor` |                   | Base color to be mix                           |
| `layer`       | `AnyColor` |                   | Layer on top of base color                     |
| `layerAlpha`  | `number`   | 1                 | Optional alpha value for layer color           |

If layer color will have semitransparent alpha channel and you additionally indicate layer alpha as third argument, the resulting alpha value would be a multiplication of those two:

```js

import { mix } from '@snigos/color';

// Following will result in the same outcome
mix('#fff', 'rgb(0 0 0 / 0.5)', 0.2).toRgbString(); // rgb(230 230 230)
mix('#fff', 'rgb(0 0 0 / 0.1)').toRgbString(); // rgb(230 230 230)
mix('#fff', 'rgb(0 0 0)', 0.1).toRgbString(); // rgb(230 230 230)

```

If both base and layer colors will have semitransparent alpha channels, resulting alpha channel will be calculated by formula `base.alpha * (1 + layer.alpha)`:

```js

import { mix } from '@snigos/color';

const semiBlack = mix('rgb(0 0 0 / 0.5)', 'rgb(0 0 0 / 0.5)');
semiBlack.alpha; // 0.75

```

More examples:

```js

import { mix } from '@snigos/color';

mix('#FA9A85', '#00539C', 0.5).toHexString(); // #7d7791
mix('#D69C2F', '#E8B5CE', 0.15).toHexString(); // #d9a047
mix('blue', 'magenta', 0.75).toHexString(); // #bf00ff
mix('#ff6f61', '#6b5b9599').toHexString(); // #a66380

```
![Mix function demo](/__screenshots__/mix-demo.jpg)