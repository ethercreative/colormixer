<?php
namespace Craft;

class ColorMixerPlugin extends BasePlugin {
	public function getName()
	{
		return Craft::t('Color Mixer');
	}

	public function getVersion()
	{
		return '1.1.1';
	}

	public function getSchemaVersion()
	{
		return '0.0.1';
	}

	public function getDeveloper()
	{
		return 'Ether Creative';
	}

	public function getDeveloperUrl()
	{
		return 'http://ethercreative.co.uk';
	}

	public function getDocumentationUrl()
	{
		return 'https://github.com/ethercreative/ColorMixer/blob/master/readme.md';
	}

	public function getDescription()
	{
		return 'A set of Twig filters for modifying hex colors';
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

	public function getReleaseFeedUrl()
	{
		return 'https://raw.githubusercontent.com/ethercreative/ColorMixer/master/releases.json';
	}
}