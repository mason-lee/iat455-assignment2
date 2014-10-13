"use strict";

var Part2Effect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	//create another canvas object for the other source image
	self.otherCanvas = new MEDIA.Canvas();
	//controls
	self.name = 'Part-2 Effect';

	self.controls = {		
		LuminanceThreshold:{
			value: 1,
			min: 0,
			max: 255,
			step: 2
		}
	};
};

Part2Effect.prototype = {
	draw: function() {
		var canvas = this.canvas,
		lThresh = this.controls.LuminanceThreshold.value,
		w = MEDIA.width,
		h = MEDIA.height;

		APP.drawImage(canvas);

		var img = canvas.getImageData(),
		data32 = new Uint32Array(img.data.buffer);

		for (var i = 0; i < data32.length; i++) {
			var pixel = data32[i],
			result,
			r = pixel & 255,
			g = (pixel >> 8) & 255,
			b = (pixel >> 16) & 255;
	
			// Get brightness from rgb value
			var brightness = (r + g+ b) / 3;

			if(brightness > lThresh) {
				result = 255;
			}
			else {
				result = 0;
			}

			data32[i] = (255 << 24) | (result << 16) | (result << 8) | result;
		}
		canvas.putImageData(img);
	}
};





