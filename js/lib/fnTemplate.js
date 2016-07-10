/* jshint browserify:true */
module.exports = function fnTemplate (f) {
	"use strict";
	return f.toString()
		.replace(/[^\/]*\/\*!/m,'')
		.replace(/\*\/(.|\s)*/m, '')
		;
};
