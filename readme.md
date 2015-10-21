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

Mixes two hexes together. The ```$amount``` to mix the colors together by is set between -100..0..+100, where 0 is an equal amount of both colors.
```$amount``` defaults to 0 if not set.


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