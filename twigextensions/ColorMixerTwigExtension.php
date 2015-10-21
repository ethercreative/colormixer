<?php

/**
 * Using modified code from:
 * Author: Arlo Carreon <http://arlocarreon.com>
 * Info: http://mexitek.github.io/phpColors/
 * License: http://arlo.mit-license.org/
 */

namespace Craft;

use Twig_Extension;
use Twig_Filter_Method;

class ColorMixerTwigExtension extends Twig_Extension {

	/**
	 * Auto darkens/lightens by 10%.
	 * Set this to FALSE to adjust automatic shade to be between given color
	 * and black (for darken) or white (for lighten)
	 */
	const DEFAULT_ADJUST = 10;

	public function getName()
	{
		return 'Color Mixer';
	}

	public function getFilters()
	{
		return array(
			'hexToHsl' => new Twig_Filter_Method($this, 'hexToHsl'),
			'hexToRgb' => new Twig_Filter_Method($this, 'hexToRgb'),
			'darken' => new Twig_Filter_Method($this, 'darken'),
			'lighten' => new Twig_Filter_Method($this, 'lighten'),
			'mix' => new Twig_Filter_Method($this, 'mix'),
			'isLight' => new Twig_Filter_Method($this, 'isLight'),
			'isDark' => new Twig_Filter_Method($this, 'isDark'),
			'complementary' => new Twig_Filter_Method($this, 'complementary'),
		);
	}

	/////////////////////
	// Public          //
	/////////////////////

	/**
	 * Given a HEX string returns a HSL array equivalent.
	 * @param string $color
	 * @param boolean $returnAsArray
	 * @return array HSL associative array
	 */
	public function hexToHsl($color, $returnAsArray = false)
	{
		$color = self::_checkHex($color);

		// Convert HEX to DEC
		$R = hexdec($color[0].$color[1]);
		$G = hexdec($color[2].$color[3]);
		$B = hexdec($color[4].$color[5]);

		$HSL = array();
		$var_R = ($R / 255);
		$var_G = ($G / 255);
		$var_B = ($B / 255);
		$var_Min = min($var_R, $var_G, $var_B);
		$var_Max = max($var_R, $var_G, $var_B);
		$del_Max = $var_Max - $var_Min;
		$L = ($var_Max + $var_Min)/2;
		if ($del_Max == 0)
		{
			$H = 0;
			$S = 0;
		}
		else
		{
			if ( $L < 0.5 ) $S = $del_Max / ( $var_Max + $var_Min );
			else            $S = $del_Max / ( 2 - $var_Max - $var_Min );
			$del_R = ( ( ( $var_Max - $var_R ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
			$del_G = ( ( ( $var_Max - $var_G ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
			$del_B = ( ( ( $var_Max - $var_B ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
			$H = 0.5;
			if      ($var_R == $var_Max) $H = $del_B - $del_G;
			else if ($var_G == $var_Max) $H = ( 1 / 3 ) + $del_R - $del_B;
			else if ($var_B == $var_Max) $H = ( 2 / 3 ) + $del_G - $del_R;
			if ($H < 0) $H++;
			if ($H > 1) $H--;
		}

		$HSL['H'] = ($H*360);
		$HSL['S'] = $S;
		$HSL['L'] = $L;

		return $returnAsArray ? $HSL : implode(",", $HSL);
	}

	/**
	 * Given a HEX string returns a RGB array equivalent.
	 * @param string $color
	 * @param boolean $returnAsArray
	 * @return array RGB associative array
	 */
	public function hexToRgb($color, $returnAsArray = false)
	{
		$color = self::_checkHex($color);

		// Convert HEX to DEC
		$R = hexdec($color[0].$color[1]);
		$G = hexdec($color[2].$color[3]);
		$B = hexdec($color[4].$color[5]);

		$RGB['R'] = $R;
		$RGB['G'] = $G;
		$RGB['B'] = $B;

		return $returnAsArray ? $RGB : implode(",", $RGB);
	}

	/**
	 * Given a HEX value, returns a darker color. If no desired amount provided, then the color halfway between
	 * given HEX and black will be returned.
	 * @param string $color
	 * @param int $amount
	 * @return string Darker HEX value
	 */
	public function darken( $color, $amount = self::DEFAULT_ADJUST )
	{
		$color = self::_checkHex($color);

		$color = $this->hexToHsl($color, true);
		// Darken
		$darkerHSL = $this->_darken($color, $amount);
		// Return as HEX
		return self::_hslToHex($darkerHSL);
	}

	/**
	 * Given a HEX value, returns a lighter color. If no desired amount provided, then the color halfway between
	 * given HEX and white will be returned.
	 * @param string $color
	 * @param int $amount
	 * @return string Lighter HEX value
	 */
	public function lighten( $color, $amount = self::DEFAULT_ADJUST )
	{
		$color = self::_checkHex($color);

		$color = $this->hexToHsl($color, true);
		// Lighten
		$lighterHSL = $this->_lighten($color, $amount);
		// Return as HEX
		return self::_hslToHex($lighterHSL);
	}

	/**
	 * Given a HEX value, returns a mixed color. If no desired amount provided, then the color mixed by this ratio
	 * @param string $color
	 * @param string $hex2 Secondary HEX value to mix with
	 * @param int $amount = -100..0..+100
	 * @return string mixed HEX value
	 */
	public function mix($color, $hex2, $amount = 0)
	{
		$color = self::_checkHex($color);

		$color = self::hexToRgb($color, true);
		$rgb2 = self::hexToRgb($hex2, true);
		$mixed = $this->_mix($color, $rgb2, $amount);
		// Return as HEX
		return self::_rgbToHex($mixed);
	}

	/**
	 * Returns whether or not given color is considered "light"
	 * @param string $color
	 * @param int $threshold
	 * @return bool
	 * @throws Exception
	 */
	public function isLight( $color, $threshold = 130 ){
		$color = self::_checkHex($color);

		// Get our color
		// Calculate straight from rbg
		$r = hexdec($color[0].$color[1]);
		$g = hexdec($color[2].$color[3]);
		$b = hexdec($color[4].$color[5]);
		return (( $r*299 + $g*587 + $b*114 )/1000 > $threshold);
	}

	/**
	 * Returns whether or not a given color is considered "dark"
	 * @param string $color
	 * @param int $threshold
	 * @return bool
	 * @throws Exception
	 */
	public function isDark( $color, $threshold = 130 ){
		$color = self::_checkHex($color);

		// Get our color
		// Calculate straight from rbg
		$r = hexdec($color[0].$color[1]);
		$g = hexdec($color[2].$color[3]);
		$b = hexdec($color[4].$color[5]);
		return (( $r*299 + $g*587 + $b*114 )/1000 <= $threshold);
	}
	/**
	 * Returns the complimentary color
	 * @param string $color
	 * @return string Complementary hex color
	 */
	public function complementary($color) {
		$color = self::_checkHex($color);

		// Get our HSL
		$hsl = $this->hexToHsl($color, true);
		// Adjust Hue 180 degrees
		$hsl['H'] += ($hsl['H']>180) ? -180:180;
		// Return the new value in HEX
		return self::_hslToHex($hsl);
	}

	/////////////////////
	// Private         //
	/////////////////////

	/**
	 *  Given a HSL associative array returns the equivalent HEX string
	 * @param array $hsl
	 * @return string HEX string
	 * @throws Exception "Bad HSL Array"
	 */
	private static function _hslToHex( $hsl = array() ){
		// Make sure it's HSL
		if(empty($hsl) || !isset($hsl["H"]) || !isset($hsl["S"]) || !isset($hsl["L"]) ) {
			throw new Exception("Param was not an HSL array");
		}
		list($H,$S,$L) = array( $hsl['H']/360,$hsl['S'],$hsl['L'] );
		if( $S == 0 ) {
			$r = $L * 255;
			$g = $L * 255;
			$b = $L * 255;
		} else {
			if($L<0.5) {
				$var_2 = $L*(1+$S);
			} else {
				$var_2 = ($L+$S) - ($S*$L);
			}
			$var_1 = 2 * $L - $var_2;
			$r = round(255 * self::_hueToRgb( $var_1, $var_2, $H + (1/3) ));
			$g = round(255 * self::_hueToRgb( $var_1, $var_2, $H ));
			$b = round(255 * self::_hueToRgb( $var_1, $var_2, $H - (1/3) ));
		}
		// Convert to hex
		$r = dechex($r);
		$g = dechex($g);
		$b = dechex($b);
		// Make sure we get 2 digits for decimals
		$r = (strlen("".$r)===1) ? "0".$r:$r;
		$g = (strlen("".$g)===1) ? "0".$g:$g;
		$b = (strlen("".$b)===1) ? "0".$b:$b;
		return '#'.$r.$g.$b;
	}

	/**
	 *  Given an RGB associative array returns the equivalent HEX string
	 * @param array $rgb
	 * @return string RGB string
	 * @throws Exception "Bad RGB Array"
	 */
	private static function _rgbToHex( $rgb = array() ){
		// Make sure it's RGB
		if(empty($rgb) || !isset($rgb["R"]) || !isset($rgb["G"]) || !isset($rgb["B"]) ) {
			throw new Exception("Param was not an RGB array");
		}

		// Convert RGB to HEX
		$hex[0] = dechex( $rgb['R'] );
		$hex[1] = dechex( $rgb['G'] );
		$hex[2] = dechex( $rgb['B'] );

		return '#'.implode( '', $hex );
	}

	/**
	 * Darkens a given HSL array
	 * @param array $hsl
	 * @param int $amount
	 * @return array $hsl
	 */
	private function _darken( $hsl, $amount = self::DEFAULT_ADJUST){
		// Check if we were provided a number
		if( $amount ) {
			$hsl['L'] = ($hsl['L'] * 100) - $amount;
			$hsl['L'] = ($hsl['L'] < 0) ? 0:$hsl['L']/100;
		} else {
			// We need to find out how much to darken
			$hsl['L'] = $hsl['L']/2 ;
		}
		return $hsl;
	}
	/**
	 * Lightens a given HSL array
	 * @param array $hsl
	 * @param int $amount
	 * @return array $hsl
	 */
	private function _lighten( $hsl, $amount = self::DEFAULT_ADJUST){
		// Check if we were provided a number
		if( $amount ) {
			$hsl['L'] = ($hsl['L'] * 100) + $amount;
			$hsl['L'] = ($hsl['L'] > 100) ? 1:$hsl['L']/100;
		} else {
			// We need to find out how much to lighten
			$hsl['L'] += (1-$hsl['L'])/2;
		}
		return $hsl;
	}
	/**
	 * Mix 2 rgb colors and return an rgb color
	 * @param array $rgb1
	 * @param array $rgb2
	 * @param int $amount ranged -100..0..+100
	 * @return array $rgb
	 *
	 * 	ported from http://phpxref.pagelines.com/nav.html?includes/class.colors.php.source.html
	 */
	private function _mix($rgb1, $rgb2, $amount = 0) {
		$r1 = ($amount + 100) / 100;
		$r2 = 2 - $r1;
		$rmix = (($rgb1['R'] * $r1) + ($rgb2['R'] * $r2)) / 2;
		$gmix = (($rgb1['G'] * $r1) + ($rgb2['G'] * $r2)) / 2;
		$bmix = (($rgb1['B'] * $r1) + ($rgb2['B'] * $r2)) / 2;
		return array('R' => $rmix, 'G' => $gmix, 'B' => $bmix);
	}
	/**
	 * Given a Hue, returns corresponding RGB value
	 * @param int $v1
	 * @param int $v2
	 * @param int $vH
	 * @return int
	 */
	private static function _hueToRgb( $v1,$v2,$vH ) {
		if( $vH < 0 ) {
			$vH += 1;
		}
		if( $vH > 1 ) {
			$vH -= 1;
		}
		if( (6*$vH) < 1 ) {
			return ($v1 + ($v2 - $v1) * 6 * $vH);
		}
		if( (2*$vH) < 1 ) {
			return $v2;
		}
		if( (3*$vH) < 2 ) {
			return ($v1 + ($v2-$v1) * ( (2/3)-$vH ) * 6);
		}
		return $v1;
	}

	/**
	 * You need to check if you were given a good hex string
	 * @param string $hex
	 * @return string Color
	 * @throws Exception "Bad color format"
	 */
	private static function _checkHex( $hex ) {
		// Strip # sign is present
		$color = str_replace("#", "", $hex);
		// Make sure it's 6 digits
		if( strlen($color) == 3 ) {
			$color = $color[0].$color[0].$color[1].$color[1].$color[2].$color[2];
		} else if( strlen($color) != 6 ) {
			throw new Exception("HEX color needs to be 6 or 3 digits long, received: " . $color);
		}
		return $color;
	}

}