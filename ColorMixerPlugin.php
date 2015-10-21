<?php
namespace Craft;

class ColorMixerPlugin extends BasePlugin {
	public function getName()
	{
		return Craft::t('Color Mixer');
	}

	public function getVersion()
	{
		return '0.1.2';
	}

	public function getDeveloper()
	{
		return 'Ether Creative';
	}

	public function getDeveloperUrl()
	{
		return 'http://ethercreative.co.uk';
	}

	public function hasCpSection()
	{
		return false;
	}

	public function addTwigExtension()
	{
		Craft::import('plugins.colormixer.twigextensions.ColorMixerTwigExtension');

		return new ColorMixerTwigExtension();
	}
}