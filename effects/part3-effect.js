"use strict";

var Part3Effect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	//create another canvas object for the other source image
	self.otherCanvas = new MEDIA.Canvas();
	//controls
	self.name = 'Part-3 Effect';

	self.controls = {		
		LuminanceThreshold:{
			value: 80,
			min: 0,
			max: 255,
			step: 2
		},
		Fuzziness:{
			value: 100,
			min: 0,
			max: 255,
			step: 1
		}
	};
};

Part3Effect.prototype = {
	draw: function() {
		var canvas = this.canvas,
		lThresh = this.controls.LuminanceThreshold.value,
		fuzziness = this.controls.Fuzziness.value,
		w = MEDIA.width,
		h = MEDIA.height;

		APP.drawImage(canvas);

		var img = canvas.getImageData(),
		data32 = new Uint32Array(img.data.buffer);

		var upperlimit = lThresh + fuzziness/2;
		var lowerlimit = lThresh - fuzziness/2;
		
		for (var i = 0; i < data32.length; i++) {
			var pixel = data32[i],
			result,
			r = pixel & 255,
			g = (pixel >> 8) & 255,
			b = (pixel >> 16) & 255;

			// Get brightness from rgb value
			var brightness = (r + g+ b) / 3;

			if(brightness > upperlimit) {
				brightness = upperlimit;
			}
			else if(brightness < lowerlimit) {
				brightness = upperlimit;
			}

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





