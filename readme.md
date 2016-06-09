![Color Mixer for Craft CMS](resources/banner.gif)

# Color Mixer
A set of Twig filters for modifying hex colors in [Craft](http://buildwithcraft.com/).

### Install
Download / clone this repo into ```craft/plugins/colormixer```.

**Important:** Make sure you create the ```colormixer``` folder in the plugins directory.
We've left the folder out to make it easy for anyone wanting to use the plugin as a Git Sub-module!

### Filters
**hexToHsl**

```twig
hexToHsl

hexToHsl($returnAsArray)
```

Converts a hex to HSL. Returns a comma separated string unless ```$returnAsArray``` is set to true.


**hexToRgb**

```twig
hexToRgb

hexToRgb($returnAsArray)
```

Converts a hex to RGB. Returns a comma separated string unless ```$returnAsArray``` is set to true.


**darken**

```twig
darken($amount)
```

Darkens a hex by the ```$amount``` percentage.


**lighten**

```twig
lighten($amount)
```

Lightens a hex by the ```$amount``` percentage.


**mix**

```twig
mix($hexToMixWith, $amount)
```

Mixes two hexes together. The ```$amount``` to mix the colors together by is set between -100..0..+100, where 0 is an equal amount of both colors. ```$amount``` defaults to 0 if not set.


**isLight**

```twig
isLight($threshold)
```

Returns true if the color is considered "light", false if not. The *optional* `$threshold` value determines at what point the color is considered light. Anything above this value is considered light. Defaults to 130, range is 0..255.


**isDark**

```twig
isDark($threshold)
```

Returns true if the color is considered "dark", false if not. The *optional* `$threshold` value determines at what point the color is considered dark. Anything below or equal to this value is considered dark. Defaults to 130, range is 0..255.


**complementary**

```twig
complementary
```

Returns the complimentary color.


**gradientColors**

```twig
gradientColors($amount, $threshold)
```

Returns an array with the input color and a slightly darkened / lightened counterpart (depending on whether the input color is light or dark). Both parameters are *optional*.  
`$amount` defines how much lighter or darker the color should be made (defaults to 10, range is 0..100).  
`$threshold` determines at what point the color is considered dark. Anything below or equal to this value is considered dark. Defaults to 130, range is 0..255.


**gradient**

```twig
gradient($direction, $amountOrSecondary, $threshold)
```

Returns a string of CSS containing the styling to give an element a background gradient. All parameters are *optional*.  
`$direction` defines the direction of the gradient. Must be either: `horizontal` (→), `vertical` (↓), `diagonalDown` (↘), `diagonalUp` (↗), `radial` (○). Defaults to `horizontal`.  
`$amountOrSecondary` defines the amount to lighten or darken the input color (defaults to 10, range is 0..100) or a hex string for the secondary color.
`$threshold` determines at what point the color is considered dark. Anything below or equal to this value is considered dark. Defaults to 130, range is 0..255. If `$amountOrSecondary` is a hex string, this value is ignored.

## Changelog

### 1.1.1
- Fixed bug where `gradient` filter would prepend an additional `#` when the `$amountOrSecondary` param is left blank.  

### 1.1.0
- Added `gradientColors` filter
- Added `gradient` filter

### 1.0.0
- Added docs link & Craft releases updates
- Added plugin branding
- Bumped version number to 1.0.0

### 0.1.2
- Initial Release
- The first full release of ColorMixer for Craft CMS.
- New features include the ability to specify at what point a color is considered light or dark.


---

Copyright © 2016 Ether Creative <hello@ethercreative.co.uk>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.