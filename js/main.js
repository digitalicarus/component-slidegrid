/* jshint browserify:true */
"use strict";
var libs       = require('./vendor')
,   ft         = require('./lib/fnTemplate')
,   $          = libs.jquery
,   doc        = document
,   body       = doc.body
,   create     = doc.createElement.bind(doc)
,   $container = $(body.appendChild(create('div')))
;

var tmpl = ft(function () { /*!
	<slide-grid>
		<slide-grid-nav>
			<ul></ul>
		</slide-grid-nav>
		<slide-grid-main>
			<slide-grid-head>
				<slide-grid-row>
					<slide-grid-viewport>
						<slide-grid-panel-set>
							<slide-grid-panel data-navname="first set">
								<grid-cell>col1</grid-cell>
								<grid-cell>col2</grid-cell>
								<grid-cell>col3</grid-cell>
							</slide-grid-panel>
							<slide-grid-panel data-navname="second set">
								<grid-cell>col4</grid-cell>
								<grid-cell>col5</grid-cell>
								<grid-cell>col6</grid-cell>
								<grid-cell>col7</grid-cell>
								<grid-cell>col8</grid-cell>
							</slide-grid-panel>
							<slide-grid-panel data-navname="third set">
								<grid-cell>col9</grid-cell>
								<grid-cell>col10</grid-cell>
								<grid-cell>col11</grid-cell>
								<grid-cell>col12</grid-cell>
							</slide-grid-panel> 
						</slide-grid-panel-set>
					</slide-grid-viewport>
    			</slide-grid-row>
			</slide-grid-head>
			<slide-grid-body>
				<slide-grid-row>
					<slide-grid-gutter>
						<grid-cell>gutter content</grid-cell>
						<grid-cell>more gutter</grid-cell>
					</slide-grid-gutter>
					<slide-grid-viewport>
						<slide-grid-panel-set>
							<slide-grid-panel>
								<grid-cell>data</grid-cell>
								<grid-cell>data</grid-cell>
								<grid-cell>data</grid-cell>
							</slide-grid-panel>
							<slide-grid-panel>
								<grid-cell>data</grid-cell>
								<grid-cell>data</grid-cell>
								<grid-cell>data</grid-cell>
								<grid-cell>data</grid-cell>
								<grid-cell>data</grid-cell>
							</slide-grid-panel>
							<slide-grid-panel>
								<grid-cell>data</grid-cell>
								<grid-cell>data</grid-cell>
								<grid-cell>data</grid-cell>
								<grid-cell>data</grid-cell>
							</slide-grid-panel>
						</slide-grid-panel-set>
					</slide-grid-viewport>
					<slide-grid-gutter>
						<grid-cell>some content</grid-cell>
					</slide-grid-gutter>
				</slide-grid-row>
			</slide-grid-body>
		</slide-grid-main>
	</slide-grid>
*/});

$container.append(tmpl);

// add some data for a fun height
(function (i) {
	var $row = $('slide-grid-body slide-grid-row');
	while(i--) {
		$row.clone().insertAfter($row);
	}
})(100);

// determine how many slide panels are in use
var numPanels = Array.prototype.reduce.call($('slide-grid-panel-set'), 
	function (prev, curr) { 
		var length = $(curr).find('slide-grid-panel').length; 
		return length > prev ? length : prev;
	}, null);

// populate the nav based on slide panel metadata
$('slide-grid-head slide-grid-panel[data-navname]').each(function (i,v) {
	$('<li>'+$(this).attr('data-navname')+'</li>')
		.appendTo($('slide-grid-nav ul'))
		.on('click', function () {
			$('slide-grid-panel-set')
				.css({'transform': 'translateX(-'+(100/numPanels|0)*i+'%)'});
		});
});

// adjust the width of the panel sets to accomodate the assumed number of panels in use
$('slide-grid-panel-set')
	.css({width: (numPanels*100|0)+'%'})
	;
 
// size grid main area after nav is established
$('slide-grid-main')
	.height('calc(100% - ' +
		($('slide-grid-nav').outerHeight()) + 'px)');


window.$ = $;

