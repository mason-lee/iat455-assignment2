"use strict";

var APP = APP || {};

APP.init = function() {
	//setup app
	APP.setup({w:640, h:480});
	//add effects
	APP.effects = [];
	APP.effects.push(new Part1Effect());
	APP.effects.push(new Part2Effect());
	APP.effects.push(new Part3Effect());
	//setup controls
	APP.setupControls();
};

APP.init();
