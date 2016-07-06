<?php

namespace Craft;

class ColorMixerFieldType extends BaseFieldType {

	public function getName()
	{
		return Craft::t('Color Mixer');
	}

	public function defineContentAttribute()
	{
		return AttributeType::Mixed;
	}

	// SETTINGS
	public function defineSettings()
	{
		craft()->templates->includeCssResource('colormixer/css/colormixer.css');
		craft()->templates->includeJsResource('colormixer/js/colormixer-field.js');
		craft()->templates->includeJs("new ColorMixer();");
		craft()->templates->includeJs("var colorMixerMMS = $('#types-ColorMixer-minMaxStops');
document.getElementById('types-ColorMixer-colorType').addEventListener('change', function () {
	if (this.value === 'single') colorMixerMMS.slideUp(100);
	else colorMixerMMS.slideDown(100);
});");

		return array(
			'colorType' => array(AttributeType::String, 'default' => 'single'),
			'numberOfStopsMin' => array(AttributeType::Number, 'default' => 1),
			'numberOfStopsMax' => array(AttributeType::Number, 'default' => 2),

			'maxColors' => array(AttributeType::Number, 'default' => -1),
			'defaultColor' => array(AttributeType::String, 'default' => '#ff000000'),

			// Tabs
			'showPicker' => array(AttributeType::Bool, 'default' => true),
			'showSwatches' => array(AttributeType::Bool, 'default' => true),
			'showImage' => array(AttributeType::Bool, 'default' => false),

			// Requires showPicker
			'showAlpha' => array(AttributeType::Bool, 'default' => true),
			'showHex' => array(AttributeType::Bool, 'default' => true),
			'showRgb' => array(AttributeType::Bool, 'default' => true),
			'showCmyk' => array(AttributeType::Bool, 'default' => true),
			'showComplementary' => array(AttributeType::Bool, 'default' => true),

			// Requires showSwatches
			'swatches' => array(AttributeType::Mixed),

			// Requires showImage
			'assetSources' => array(AttributeType::Mixed)
		);
	}

	public function getSettingsHtml()
	{
		$colorTypeOptions = array();
		$sourceOptions = array();

		foreach (['Single', 'Scheme', 'Gradient'] as $option)
		{
			$colorTypeOptions[] = array('label' => $option, 'value' => strtolower($option));
		}

		foreach (craft()->assetSources->getAllSources() as $source)
		{
			$sourceOptions[] = array('label' => $source->name, 'value' => $source->id);
		}

		return craft()->templates->render('colormixer/settings', array(
			'colorTypeOptions' => $colorTypeOptions,
			'sourceOptions' => $sourceOptions,
			'settings'      => $this->getSettings()
		));
	}

}