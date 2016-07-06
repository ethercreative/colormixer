/**
 * Color Mixer
 * @constructor
 */
var ColorMixer = function () {
	if (typeof document.colormixer !== 'undefined' && document.colormixer !== null) {
		document.colormixer.updateInputs();
		return;
	}

	document.colormixer = this;

	this.inputs = [];
	this.updateInputs();

	this.modal = new ColorMixer.Modal();

	// TODO: Update inputs on ColorType & Stops Min / Max settings change
};

/**
 * Update the inputs
 */
ColorMixer.prototype.updateInputs = function () {
	var self = this;

	this.inputs = ColorMixer.Unique(this.inputs
		.concat([].slice.call(document.querySelectorAll('input[data-colormixer]'))));

	this.inputs.forEach(function (input) {
		if (typeof input.colorMixerSettings !== "undefined") return;

		input.colorMixerSettings = {
			colorType: input.dataset.colormixer,

			current: 0,
			max: parseInt(input.dataset.multiple) < 0 ? 99999 : parseInt(input.dataset.multiple),

			showPicker: ColorMixer.Boolean(input.dataset.picker),
			showSwatches: ColorMixer.Boolean(input.dataset.swatches),
			showImage: ColorMixer.Boolean(input.dataset.image),

			showAlpha: ColorMixer.Boolean(input.dataset.alpha),
			showHex: ColorMixer.Boolean(input.dataset.hex),
			showRgb: ColorMixer.Boolean(input.dataset.rgb),
			showCmyk: ColorMixer.Boolean(input.dataset.cmyk),
			showComplementary: ColorMixer.Boolean(input.dataset.complementary),

			swatches: !!input.dataset.swatches ? JSON.parse(input.dataset.swatches) : [],

			assetSources: ColorMixer.Boolean(input.dataset.image) && !!input.dataset.sources ? input.dataset.sources : ''
		};

		function addColor(input, c) {
			var defaultColor = document.createElement('input');
			defaultColor.type = 'text';
			defaultColor.name = input.name + '[]';
			defaultColor.value = c.alphaHex;
			defaultColor.setAttribute('readonly', true);
			defaultColor.className = 'colormixer--color';
			defaultColor.style.backgroundColor = c.rgba;

			defaultColor.addEventListener('click', function () {
				self.modal.show(defaultColor, input.colorMixerSettings);
			});

			input.parentNode.appendChild(defaultColor);

			input.colorMixerSettings.current++;
		}

		// Parse initial value //
		var value = input.value;

		// No Value
		if (!value) {
			// Do Nothing!
		}

		// Single Color
		else if (value[0] === '#') {
			var c = ColorMixer.Color(value);
			if (c) addColor(input, c);
		}

		// Multiple single colors
		else if (value[0] === '[' && value[1] !== '[') {
			var colors = JSON.parse(value);

			colors.forEach(function (color) {
				var c = ColorMixer.Color(color);
				if (c) addColor(input, c);
			});
		}

		// Multiple Schemes
		else {
			// TODO
		}

		if (input.colorMixerSettings.current < input.colorMixerSettings.max) {
			var add = document.createElement('a');
			add.className = 'colormixer--add';
			add.href = '#';
			add.title = 'Add another color';
			add.addEventListener('click', function (e) {
				e.preventDefault();
				// TODO
			});
			input.parentNode.appendChild(add);
		}
	});
};

/***************************
 *          Modal          *
 ***************************/
/**
 * Color Mixer Modal
 * @constructor
 */
ColorMixer.Modal = function () {
	var self = this;

	this.isOpen = false;

	this.color = new ColorMixer.Color('#000');

	this.elements = {
		bodies: {},
		picker: {}
	};

	// MODAL
	var modal = document.createElement('div');
	modal.id = 'ColorMixerModal';
	modal.className = 'pane hidden';
	modal.addEventListener('mousedown', function (e) {
		e.stopPropagation();
	});
	window.addEventListener('mousedown', function () {
		if (self.isOpen)
			self.hide();
	});
	this.elements.modal = modal;


	// TABS
	var tabs = document.createElement('nav'),
		tabsList = document.createElement('ul'),
		pickerTab = document.createElement('a'),
		swatchesTab = document.createElement('a'),
		li;

	tabs.className = 'tabs';
	this.elements.tabs = tabs;

	function switchTab(e) {
		e.preventDefault();
		tabs.getElementsByClassName('sel')[0].classList.remove('sel');
		this.classList.add('sel');

		for (var key in self.elements.bodies) {
			if (key === this.tabType + 'Body')
				self.elements.bodies[key].classList.remove('hidden');
			else
				self.elements.bodies[key].classList.add('hidden');
		}
	}

	pickerTab.className = 'tab sel';
	pickerTab.textContent = 'Picker';
	pickerTab.tabType = 'picker';
	pickerTab.addEventListener('click', switchTab);
	li = document.createElement('li');
	li.appendChild(pickerTab);
	tabsList.appendChild(li);
	this.elements.pickerTab = pickerTab;

	swatchesTab.className = 'tab';
	swatchesTab.textContent = 'Swatches';
	swatchesTab.tabType = 'swatches';
	swatchesTab.addEventListener('click', switchTab);
	li = document.createElement('li');
	li.appendChild(swatchesTab);
	tabsList.appendChild(li);
	this.elements.swatchesTab = swatchesTab;

	tabs.appendChild(tabsList);

	modal.appendChild(tabs);


	// BODIES
	var body = document.createElement('div'),
		pickerBody = document.createElement('div'),
		swatchesBody = document.createElement('div');

	body.className = 'body';

	// Picker
	pickerBody.className = 'colormixer-modal--picker';

	// Picker : Color Picker
	this.elements.picker.colorPicker = ColorMixer.Modal.CreateColorPicker();
	pickerBody.appendChild(this.elements.picker.colorPicker);

	body.appendChild(pickerBody);
	this.elements.bodies.pickerBody = pickerBody;

	// Swatches
	swatchesBody.className = 'colormixer-modal--swatches hidden';
	swatchesBody.textContent = 'SWATCHES';
	body.appendChild(swatchesBody);
	this.elements.bodies.swatchesBody = swatchesBody;

	modal.appendChild(body);


	// FOOTER
	var footer = document.createElement('footer'),
		deleteButton = document.createElement('a'),
		cancelButton = document.createElement('button'),
		selectButton = document.createElement('button');

	footer.className = 'footer';

	deleteButton.className = 'delete';
	deleteButton.textContent = 'Delete';
	this.elements.deleteButton = deleteButton;
	// TODO: Add delete function

	cancelButton.className = 'btn';
	cancelButton.textContent = 'Cancel';
	cancelButton.addEventListener('click', function () {
		self.hide();
	});

	selectButton.className = 'btn submit';
	selectButton.textContent = 'Select';
	// TODO: Add select function

	footer.appendChild(deleteButton);
	footer.appendChild(cancelButton);
	footer.appendChild(selectButton);

	modal.appendChild(footer);

	document.body.appendChild(modal);

	return this;
};

/**
 * Show the modal
 *
 * @param elem {Node}
 * @param options {Object}
 */
ColorMixer.Modal.prototype.show = function (elem, options) {
	var coords = ColorMixer.GetCoords(elem);
	this.elements.modal.style.top = (coords.top + elem.clientHeight) + 'px';
	this.elements.modal.style.left = (coords.left - 24) + 'px';
	this.elements.modal.classList.remove('hidden');

	// TODO: Setup according to options

	this.isOpen = true;
};

/**
 * Hide the modal
 */
ColorMixer.Modal.prototype.hide = function () {
	this.elements.modal.classList.add('hidden');

	this.isOpen = false;
};

/***************************
 *       Modal Parts       *
 ***************************/
/**
 * Create the color picker
 *
 * @returns {Element}
 */
ColorMixer.Modal.CreateColorPicker = function () {
	var inputHex = '#f00';
	var outputColor = new ColorMixer.Color(inputHex),
		vsColor = new ColorMixer.Color(inputHex),
		hueColor = new ColorMixer.Color(inputHex);

	var colorPicker = document.createElement('div');
	colorPicker.className = 'colormixer-modal--color-picker';

	// Lightness / Saturation
	var vsPicker = document.createElement('div'),
		vsHandle = document.createElement('div');
	vsPicker.className = 'lightness-saturation';
	vsHandle.className = 'handle';
	vsHandle.style.background = vsColor.rgba;
	vsPicker.appendChild(vsHandle);

	vsColor.onChange = function () {
		vsHandle.style.background = vsColor.rgba;

		if (vsColor.s <= 15 && vsColor.v >= 85)
			vsHandle.classList.add('light');
		else
			vsHandle.classList.remove('light');

		if (!vsHandle.classList.contains('dragging')) {
			vsHandle.style.left = vsColor.s + '%';
			vsHandle.style.top = (100 - vsColor.v) + '%';
		}
	};

	ColorMixer.Modal.HandleDrag(vsHandle, ColorMixer.Modal.HandleDrag.Direction.BOTH, function (pos) {
		var s = pos.x,
			v = 100 - pos.y;

		outputColor.s = s;
		outputColor.v = v;
		outputColor.h = hueColor.h;

		vsColor.s = s;
		vsColor.v = v;
		vsColor.h = hueColor.h;
	});

	// Hue
	var huePicker = document.createElement('div'),
		hueHandle = document.createElement('div');
	huePicker.className = 'hue';
	hueHandle.className = 'handle';
	hueHandle.style.background = hueColor.rgba;
	huePicker.appendChild(hueHandle);

	hueColor.onChange = function () {
		var rgba = 'rgba(' + hueColor.r + ', ' + hueColor.g + ', ' + hueColor.b;
		vsPicker.style.background = 'linear-gradient(to right, '+rgba+', 0), '+rgba+', 1))';
		hueHandle.style.background = hueColor.rgba;

		if (!hueHandle.classList.contains('dragging')) {
			hueHandle.style.top = 100 - ((hueColor.h / 360) * 100) + '%';
		}
	};

	ColorMixer.Modal.HandleDrag(hueHandle, ColorMixer.Modal.HandleDrag.Direction.Y, function (pos) {
		var hue = 360 * (1 - (pos.y / 100));
		outputColor.h = hue;
		hueColor.h = hue;
		vsColor.h = hue;
	});

	// Alpha
	var alphaPicker = document.createElement('div'),
		alphaHandle = document.createElement('div');
	alphaPicker.className = 'alpha';
	alphaHandle.className = 'handle';
	alphaPicker.appendChild(document.createElement('span'));
	alphaHandle.appendChild(document.createElement('span'));
	alphaHandle.firstChild.style.background = outputColor.rgba;
	alphaPicker.appendChild(alphaHandle);

	outputColor.onChange = function () {
		var rgba = 'rgba(' + outputColor.r + ', ' + outputColor.g + ', ' + outputColor.b;
		alphaPicker.firstElementChild.style.background = 'linear-gradient(to right, '+rgba+', 0), '+rgba+', 1))';
		alphaHandle.firstChild.style.background = outputColor.rgba;

		if (!alphaHandle.classList.contains('dragging')) {
			alphaHandle.style.left = outputColor.alpha + '%';
		}
	};

	ColorMixer.Modal.HandleDrag(alphaHandle, ColorMixer.Modal.HandleDrag.Direction.X, function (pos) {
		outputColor.alpha = pos.x;
	});

	colorPicker.appendChild(vsPicker);
	colorPicker.appendChild(huePicker);
	colorPicker.appendChild(alphaPicker);

	hueColor.onChange();
	vsColor.onChange();
	outputColor.onChange();

	return colorPicker;
};

/**
 * Draggable Handle
 *
 * @param handle {Node}
 * @param direction {ColorMixer.Modal.HandleDrag.Direction|Number}
 * @param onMoveCallback {Function=}
 */
ColorMixer.Modal.HandleDrag = function (handle, direction, onMoveCallback) {
	// Vars
	var parent = handle.parentNode,
		parentPos;

	// Event Listeners
	function onMouseMove(e) {
		var newPos = {
			x: ((e.clientX - parentPos.left) / parent.clientWidth) * 100,
			y: ((e.clientY - parentPos.top) / parent.clientHeight) * 100
		};

		if (newPos.y < 0) newPos.y = 0;
		if (newPos.y > 100) newPos.y = 100;
		if (newPos.x < 0) newPos.x = 0;
		if (newPos.x > 100) newPos.x = 100;

		if (direction === ColorMixer.Modal.HandleDrag.Direction.X ||
			direction === ColorMixer.Modal.HandleDrag.Direction.BOTH) {
			handle.style.left = newPos.x + '%';
		}

		if (direction === ColorMixer.Modal.HandleDrag.Direction.Y ||
			direction === ColorMixer.Modal.HandleDrag.Direction.BOTH) {
			handle.style.top = newPos.y + '%';
		}

		if (onMoveCallback) onMoveCallback(newPos);
	}

	handle.addEventListener('mousedown', function () {
		parentPos = parent.getBoundingClientRect();
		handle.classList.add('dragging');
		window.addEventListener('mousemove', onMouseMove, true);
	});

	parent.addEventListener('click', function (e) {
		if (e.target === handle) return;
		parentPos = parent.getBoundingClientRect();
		onMouseMove(e);
	});

	window.addEventListener('mouseup', function () {
		handle.classList.remove('dragging');
		window.removeEventListener('mousemove', onMouseMove, true);
	});
};

/**
 * Handle Drag Direction Enum
 */
ColorMixer.Modal.HandleDrag.Direction = {
	BOTH: 1,
	X: 2,
	Y: 3
};

/***************************
 *         Helpers         *
 ***************************/
/**
 * Display an error message on screen & in the console
 *
 * @param message
 */
ColorMixer.Fail = function (message) {
	if (Craft && Craft.cp) Craft.cp.displayError('<strong>Color Mixer:</strong> ' + message);
	if (window.console) console.error.apply(console, ['%cColor Mixer: %c' + message, 'font-weight:bold;','font-weight:normal;']);
};

/**
 * Get element coordinates reletive to document
 *
 * @param elem
 * @returns {{top: number, left: number}}
 */
ColorMixer.GetCoords = function (elem) {
	var box = elem.getBoundingClientRect(),
		bod = document.body.getBoundingClientRect();

	return { top: Math.round(box.top - bod.top), left: Math.round(box.left - bod.left) };
};

/**
 * Convert a string to a boolean
 *
 * @param string {String}
 * @return {boolean}
 */
ColorMixer.Boolean = function (string) {
	return typeof string !== "undefined" && string == "true";
};

/**
 * Removes duplicates from array
 *
 * @param array {Array}
 * @returns {Array}
 */
ColorMixer.Unique = function (array) {
	var a = array.concat();
	for(var i=0; i<a.length; ++i) {
		for(var j=i+1; j<a.length; ++j) {
			if(a[i] === a[j])
				a.splice(j--, 1);
		}
	}
	return a;
};

// /**
//  * Round a number to X places
//  *
//  * @param number {number}
//  * @param places {number}
//  * @returns {number}
//  */
// ColorMixer.RoundTo = function (number, places) {
// 	places = Math.pow(10, places);
// 	return Math.round(number * places) / places;
// };

/**
 * The Color Object
 *
 * @param alphaHex
 * @returns {Color}
 * @constructor
 */
ColorMixer.Color = function (alphaHex) {
	if (typeof alphaHex !== "string") ColorMixer.Fail('Invalid Alpha Hex (' + typeof alphaHex + ')');

	if (alphaHex.length !== 9) {
		if (alphaHex[0] !== '#') alphaHex = '#' + alphaHex;

		if (alphaHex.length === 4)
			alphaHex = '#' + alphaHex[1] + alphaHex[1] + alphaHex[2] + alphaHex[2] + alphaHex[3] + alphaHex[3];

		if (alphaHex.length === 7) alphaHex = '#ff' + alphaHex.substring(1);

		if (alphaHex.length !== 9) {
			ColorMixer.Fail('Invalid Alpha Hex (' + alphaHex + ')');
			return null;
		}
	}

	var Color = function (alphaHex) {
		this._hex = '#' + alphaHex.substring(3, 9);
		this._alpha = parseInt(alphaHex.substring(1, 3), 16) / 255;

		this._r = parseInt(alphaHex.substring(3, 5), 16);
		this._g = parseInt(alphaHex.substring(5, 7), 16);
		this._b = parseInt(alphaHex.substring(7, 9), 16);

		var r = (this.r / 255),
			g = (this.g / 255),
			b = (this.b / 255);

		var min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			diff = max - min;

		this._k = 1 - max;
		this._c = (1 - r - this._k) / (1 - this._k) || 0;
		this._m = (1 - g - this._k) / (1 - this._k) || 0;
		this._y = (1 - b - this._k) / (1 - this._k) || 0;

		this._s = (max === 0 ? 0 : diff / max);
		this._v = max;
		switch (max) {
			case min: this._h = 0; break;
			case r: this._h = (g - b) / diff + (g < b ? 6 : 0); break;
			case g: this._h = (b - r) / diff + 2; break;
			case b: this._h = (r - g) / diff + 4; break;
		}
		this._h /= 6;

		this._alphaHex = alphaHex;

		this._onChange = [];
	};

	Color.HueToRgb = function(p, q, t) {
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6) return p + (q - p) * 6 * t;
		if(t < 1/2) return q;
		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	};

	Color.prototype = {
		get hex () { return this._hex; },
		set hex (v) { this._hex = v; this.updateFromHex(); },

		get alpha () { return ~~(this._alpha * 100); },
		set alpha (v) { this._alpha = v / 100; this.updateFromRgba(); },


		get r () { return ~~this._r; },
		set r (v) { this._r = v; this.updateFromRgba(); },

		get g () { return ~~this._g; },
		set g (v) { this._g = v; this.updateFromRgba(); },

		get b () { return ~~this._b; },
		set b (v) { this._b = v; this.updateFromRgba(); },


		get k () { return this._k * 100; },
		set k (v) { this._k = v / 100; this.updateFromCmyk(); },

		get c () { return this._c * 100; },
		set c (v) { this._c = v / 100; this.updateFromCmyk(); },

		get m () { return this._m * 100; },
		set m (v) { this._m = v / 100; this.updateFromCmyk(); },

		get y () { return this._y * 100; },
		set y (v) { this._y = v / 100; this.updateFromCmyk(); },


		get h () { return 360 * this._h; },
		set h (v) { this._h = v / 360; this.updateFromHsv(); },

		get s () { return ~~(this._s * 100); },
		set s (v) { this._s = v / 100; this.updateFromHsv(); },

		get v () { return ~~(this._v * 100); },
		set v (v) { this._v = v / 100; this.updateFromHsv(); },


		get alphaHex () { return this._alphaHex; },
		set alphaHex (v) { this._alphaHex = v; this.updateFromAlphaHex(); },

		get rgba() { return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.alpha / 100 + ')'; },

		get onChange () { var self = this; return function () { self._onChange.forEach(function (func) { func(); }); }; },
		set onChange (v) { this._onChange.push(v); }
	};

	Color.prototype.updateFromCmyk = function () {
		this._r = 255 * (1 - this._c) * (1 - this._k);
		this._g = 255 * (1 - this._m) * (1 - this._k);
		this._b = 255 * (1 - this._y) * (1 - this._k);

		this.updateFromRgba();
	};

	Color.prototype.updateFromHsv = function () {
		var i, f, p, q, t;

		i = Math.floor(this._h * 6);
		f = this._h * 6 - i;
		p = this._v * (1 - this._s);
		q = this._v * (1 - f * this._s);
		t = this._v * (1 - (1 - f) * this._s);

		switch (i % 6) {
			case 0: this._r = this._v; this._g = t; this._b = p; break;
			case 1: this._r = q; this._g = this._v; this._b = p; break;
			case 2: this._r = p; this._g = this._v; this._b = t; break;
			case 3: this._r = p; this._g = q; this._b = this._v; break;
			case 4: this._r = t; this._g = p; this._b = this._v; break;
			case 5: this._r = this._v; this._g = p; this._b = q; break;
		}

		this._r *= 255;
		this._g *= 255;
		this._b *= 255;

		this.updateFromRgba();
	};

	Color.prototype.updateFromRgba = function () {
		var self = this;

		this._alphaHex = (function () {
			function d(s) {
				if ((s + '').length === 1) return '0' + s;
				return s;
			}

			var a = d((~~(self._alpha * 255)).toString(16)),
				r = d(self.r.toString(16)),
				g = d(self.g.toString(16)),
				b = d(self.b.toString(16));

			return '#' + a + r + g + b;
		})();

		this.updateFromAlphaHex();
	};

	Color.prototype.updateFromHex = function () {
		this._alphaHex = '#' + (this._alpha * 255).toString(16) + this._hex.substring(1);
		this.updateFromAlphaHex();
	};

	Color.prototype.updateFromAlphaHex = function () {
		var n = new ColorMixer.Color(this._alphaHex);

		for (var key in this) {
			if (key[0] !== '_' || key === '_onChange') continue;
			this[key] = n[key];
		}

		this.onChange();
	};

	return new Color(alphaHex);
};