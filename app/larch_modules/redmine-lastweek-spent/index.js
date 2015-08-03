'use strict';

(function(){
	var template = '\
		<div class="text-center">\
			<h3>{{data.value}} MDs<h3>\
			<h6>for last week</h6>\
		</div>\
	';

	var widgetType = {
		/**
		 * metadata
		 */
		authors: ['koubas'] ,
		desc:  'What has been spent on Accurity for last week' ,
		homepage:  '' ,
		id: 3,
		name:  'redmine-lastweek-spent' ,
		repository:  '' ,
		source:  'Redmine' ,
		tags: [ ],
		title:  'Last week spent' ,
		version:  '0.1',
		
		/**
		 * implementation settings
		 */
		template: template,
		config: {
			updateInterval: null, // in milsecs
			useInnerFramework: false, //use angular 
			useHandleBars: true,
		},
		paths: {
			//jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js',
			//d3js: 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'
		},
		udf: {
			open: function(text){ window.alert(text); }
		},
		modalParams: null,
		typeParams: null,
		displayParams: {
			position: {
				top: '380px',
				left: '240px',
				width: '200px',
				height: '160px'
			}
		},
		systemParams: {
		        api: '/redmine/spent/lastweek',
		        apiVersion: '0.1',
		        method: 'get',
		        port: 9003,
		        url: 'http://localhost',
		 }


	};

	return widgetType;
})();