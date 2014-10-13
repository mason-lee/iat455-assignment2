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
	var self = this;
	var width = MEDIA.width;
	var height = MEDIA.height;

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
		var canvas = this.canvas;
		APP.drawImage(canvas);
		var maskCanvas = this.maskCanvas;

		var maskWidth = this.mask.width;
		var maskHeight = this.mask.height;

		var maskX = this.controls.x.value;
		var maskY = this.controls.y.value;
		var maskScale = this.controls.scale.value;
		var maskRotation = this.controls.rotation.value;
		
		maskCanvas.context.clearRect(0, 0, MEDIA.width, MEDIA.height);

		var xOffset = this.mask.width/-2;
		var yOffset = this.mask.height/-2;

		// Save the default state
		maskCanvas.context.save();
		// Start the transformation
		maskCanvas.context.translate(maskWidth/2, maskHeight/2);
		// Rotate the coordinate
		maskCanvas.context.rotate(maskRotation* Math.PI/180);
		// Scale the coordinate
		maskCanvas.context.scale(maskScale, maskScale);
		
		maskCanvas.context.translate(xOffset, yOffset);

		// Change the position
		maskCanvas.context.drawImage(this.mask, maskX, maskY, this.maskCanvas.width, this.maskCanvas.height);
		maskCanvas.context.restore();

		var img = canvas.getImageData();
		var foreground = this.foregroundCanvas.getImageData();
		var mask = this.maskCanvas.getImageData();

		var imgData = new Uint32Array(img.data.buffer);
		var foregroundData = new Uint32Array(foreground.data.buffer);
		var maskData = new Uint32Array(mask.data.buffer);

		for (var i = 0, len = imgData.length; i < len; i++) {
			var imgPixel = imgData[i];

			var imgR = imgPixel & 255;
			var imgG = (imgPixel >> 8) & 255;
			var imgB = (imgPixel >> 16) & 255;

			var foregroundPixel = foregroundData[i];

			var foregroundR = foregroundPixel & 255;
			var foregroundG = (foregroundPixel >> 8) & 255;
			var foregroundB = (foreground >> 16) & 255;

			var maskPixel = maskData[i];

			var maskR = maskPixel & 255;
			var maskG = (maskPixel >> 8) & 255;
			var maskB = (maskPixel >> 16) & 255;


			if (maskR > 128) {
				imgR = foregroundR;
				imgG = foregroundG;
				imgB = foregroundB;
			} 
			/*
				Screen Blending
			 */
			var r = 255 - (255 - imgR) * (255 - foregroundR);
			var g = 255 - (255 - imgG) * (255 - foregroundG);
			var b = 255 - (255 - imgB) * (255 - foregroundB);

			if (r < 0) { r = 0; }
			if (g < 0) { g = 0; }
			if (b < 0) { b = 0; }

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