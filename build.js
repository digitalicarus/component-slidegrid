#!/usr/bin/env node
/* jshint node:true */
"use strict";

var path         = require('path')
,   fs           = require('fs')
,   watch        = require('watch')
,   stylus       = require('stylus')
,   autoprefixer = require('autoprefixer-stylus')
,   browserify   = require('browserify')
,   bundle       = browserify({bare: true, ignore: /\/node_modules\//})
,   params       = require('minimist')(process.argv)
,   jsMain       = path.join(__dirname, 'js', 'main.js')
,   cssMain      = path.join(__dirname, 'css', 'main.styl')
,   outfile      = path.join(__dirname, 'dist', 'app.js')
,   cssOutfile   = path.join(__dirname, 'dist', 'styles.css')
,   watchDir     = path.join(__dirname, 'js')
,   cssWatchDir  = path.join(__dirname, 'css')
,   watchOpts    = {
		ignoreDotFiles: true,
		ignoreUnreadableDir: true,
		ignoreNotPermitted: true
	}
;

bundle.add(jsMain);

function buildJS (outfile) {
	/* jshint expr:true */
	var writable = outfile ? fs.createWriteStream(outfile) : process.stdout;
	function end () { outfile && writable.end(); }

	var res = bundle
		.transform('babelify', {presets: ['es2015'], ignore: /vendor/})
		.bundle()
		.on('error', function (err) {
			console.log(err.toString());
			end();
		})
		.on('end', function () {
			outfile && console.log(outfile, 'written');
			end();
		})
		.pipe(writable)
		;

	return res;
}

function buildCSS (cssOutfile) {
	stylus(require('fs').readFileSync(cssMain, 'utf8'))
		.set('filename', cssMain)
		.use(autoprefixer())
		.render(function (err, css) {
			if (err) {
				console.error("Error building CSS: ", err);
			} else {
				fs.writeFile(cssOutfile, css, 'utf8', function () {});
				console.log(cssOutfile + ' got wrote');
			}
		});
}

if ('watch' in params) {
	console.log('watching ', watchDir, cssWatchDir);
	watch.createMonitor(watchDir, watchOpts, function (mon) {
		var outfileRegex = new RegExp(outfile, 'i');
		function handleChange (f, change) {
			if (!outfileRegex.test(f)) {
				console.log(f, change);
				buildJS(outfile);
			} 
		}
		mon.on('created', function (f, stat) {
			handleChange(f, 'created');
		});
		mon.on('changed', function (f, curr, prev) {
			handleChange(f, 'changed');
		});
		mon.on('removed', function (f, stat) {
			handleChange(f, 'removed');
		});
	});
	watch.createMonitor(cssWatchDir, watchOpts, function (mon) {
		var outfileRegex = new RegExp(cssOutfile, 'i');
		function handleChange (f, change) {
			if (!outfileRegex.test(f)) {
				console.log(f, change);
				buildCSS(cssOutfile);
			} 
		}
		mon.on('created', function (f, stat) {
			handleChange(f, 'created');
		});
		mon.on('changed', function (f, curr, prev) {
			handleChange(f, 'changed');
		});
		mon.on('removed', function (f, stat) {
			handleChange(f, 'removed');
		});
	}); 
} else {
	buildJS(outfile);
	buildCSS(cssOutfile);
}
