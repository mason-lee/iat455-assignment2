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

	var img = new Image();
	img.onload = function() {
		otherCanvas.context.drawImage(img, 0, 0, MEDIA.width, MEDIA.height);
	}
};

Part3Effect.prototype = {
	draw: function() {
		var canvas = this.canvas,
			otherCanvas = this.otherCanvas,
			lThresh = this.controls.LuminanceThreshold.value,
			fuzziness = this.controls.Fuzziness.value,
			w = MEDIA.width,
			h = MEDIA.height;

		APP.drawImage(canvas);

		var img = canvas.getImageData(),
			otherImg = canvas.getImageData(),
			pixels1 = new Uint32Array(img.data.buffer),
			pixels2 = new Uint32Array(otherImg.data.buffer);

		var upperlimit = lThresh + fuzziness/2;
		var lowerlimit = lThresh - fuzziness/2;
		
		for (var i = 0; i < pixels1.length; i++) {
			var pixel1 = pixels1[i],
				pixel2 = pixels2[i],
				result,
				r1 = pixel1 & 255,
				g1 = (pixel1 >> 8) & 255,
				b1 = (pixel1 >> 16) & 255,
				r2 = pixel2 & 255,
				g2 = (pixel2 >> 8) & 255,
				b2 = (pixel2 >> 16) & 255;

			
			
			// Get brightness from rgb value
			var brightness = (r1 + g1+ b1) / 3;

			if (brightness > upperlimit) {
				brightness = upperlimit;
			}
			else if (brightness < lowerlimit) {
				brightness = upperlimit;
			}

			if (brightness > lThresh) {
				r1=g1=b1=255;
			}
			else {
				r1=g1=b1=0;
			}

			/*
				Multiplicative Blending
			 */
			var r = r1 * r2,
				g = g1 * g2,
				b = b1 * b2;
			
			pixels1[i] = 
				(r & 255) |
				((g & 255) << 8) |
				((b & 255) << 16) |
				(255 << 244);
		}
		canvas.putImageData(img);
	}
};





