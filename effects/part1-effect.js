function Part1Effect() {
	this.canvas = new MEDIA.Canvas();
	this.name = 'Part-1 Effect';
	this.controls = {
		x: {
			value: 0,
			min: 0, 
			max: MEDIA.width,
			step: 1
		},
		y: {
			value: 0,
			min: 0,
			max: MEDIA.height,
			step: 1
		},
		scale: {
			value: 1,
			min: 0,
			max: 5,
			step: 1
		},
		rotation: {
			value: 0,
			min: 0,
			max: 360,
			step: 1
		}
	}
	var self = this,	
		width = MEDIA.width,
		height = MEDIA.height;

	this.foregroundCanvas = new MEDIA.Canvas();

	var foreground = new Image();
	foreground.onload = function() {
		self.foregroundCanvas.context.drawImage(
			foreground, 0, 0, width, height
		);
	};
	foreground.src = 'img/reggie_fils_aime.jpg';

	this.maskCanvas = new MEDIA.Canvas();
	this.mask = new Image();	
	this.mask.src = "img/reggie_fils_aime-masks.jpg";
}

Part1Effect.prototype = {
	draw: function() {
		var canvas = this.canvas,
			maskCanvas = this.maskCanvas;

		APP.drawImage(canvas);

		var maskWidth = this.maskCanvas.width,
			maskHeight = this.maskCanvas.height,
			maskX = this.controls.x.value,
			maskY = this.controls.y.value,
			maskScale = this.controls.scale.value,
			maskRotation = this.controls.rotation.value;
		
		// Clear the pixels of the maskCanvas
		maskCanvas.context.clearRect(0, 0, MEDIA.width, MEDIA.height);

		// Block off the parts of the mask image outside of image boundary
		maskCanvas.context.fillStyle = "white";
		maskCanvas.context.fillRect(0, 0, MEDIA.width, MEDIA.height);
	
		// Calculate the offset to use it later for translation
		var xOffset = maskWidth/-2,
			yOffset = maskHeight/-2;

		// Save the default state 
		// push state on state stack
		maskCanvas.context.save();
		// Start the transformation
		maskCanvas.context.translate(maskWidth/2, maskHeight/2);
		// Rotate the coordinate
		maskCanvas.context.rotate(maskRotation* Math.PI/180);
		// Scale the coordinate
		maskCanvas.context.scale(maskScale, maskScale);
		// Translate the mask canvas offset amounts to draw it on the right position		
		maskCanvas.context.translate(xOffset, yOffset);

		// Change the position
		maskCanvas.context.drawImage(this.mask, maskX, maskY, maskWidth, maskHeight);
		// Pop state stack and restore state
		maskCanvas.context.restore();


		var img = canvas.getImageData(),
			foreground = this.foregroundCanvas.getImageData(),
			mask = this.maskCanvas.getImageData(),
			imgData = new Uint32Array(img.data.buffer),
			foregroundData = new Uint32Array(foreground.data.buffer),
			maskData = new Uint32Array(mask.data.buffer);

		for (var i = 0, len = imgData.length; i < len; i++) {
			var imgPixel = imgData[i],
				imgR = imgPixel & 255,
				imgG = (imgPixel >> 8) & 255,
				imgB = (imgPixel >> 16) & 255,
				foregroundPixel = foregroundData[i],
				foregroundR = foregroundPixel & 255,
				foregroundG = (foregroundPixel >> 8) & 255,
				foregroundB = (foreground >> 16) & 255,
				maskPixel = maskData[i],
				maskR = maskPixel & 255,
				maskG = (maskPixel >> 8) & 255,
				maskB = (maskPixel >> 16) & 255;

			if (maskR > 128) {
				imgR = foregroundR;
				imgG = foregroundG;
				imgB = foregroundB;
			} 
			/*
				Overlay blending
			 */
			var r = imgR / foregroundR;
			var g = imgG / foregroundG;
			var b = imgB / foregroundB;

			if (imgR < 128) {
				r = 2 * imgR * foregroundR;
			} else {
				r = 255 - (255 - imgR) * (255 - foregroundR);
			}

			if (imgG < 128) {
				g = 2 * imgG * foregroundG;
			} else {
				g = 255 - (255 - imgG) * (255 - foregroundG);
			}

			if (imgB < 128) {
				b = 2 * imgB * foregroundB;
			} else {
				b = 255 - (255 - imgB) * (255 - foregroundB);
			}

			if (r < 0) { r = 0; } if (r>255) { r= 255; }
			if (g < 0) { g = 0; } if (g>255) { g=255; }
			if (b < 0) { b = 0; } if (b>255) { b=255; }

			imgData[i] = 
				(r & 255) |
				((g & 255) << 8) |
				((b & 255) << 16) |
				(255 << 24);

			
			// imgData[i] = 
			// 	(imgR & 255) |
			// 	((imgG & 255) << 8) |
			// 	((imgB & 255) << 16) |
			// 	(255 << 24);
		}
		canvas.putImageData(img);
	}
};