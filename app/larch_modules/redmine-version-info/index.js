'use strict';

(function(){
	var template = '\
		<div class="text-center">\
			<h3>{{data.estimated}} MDs / {{data.spent}} MDs<h3>\
			<h6>estimated for month / spent in the month</h6>\
		</div>\
	';

	var widgetType = {
		/**
		 * metadata
		 */
		authors: ['koubas'] ,
		desc:  'What is estimated and spent on Accurity in particular month' ,
		homepage:  '' ,
		id: 4,
		name:  'redmine-version-info' ,
		repository:  '' ,
		source:  'Redmine' ,
		tags: [ ],
		title:  'Month spent and estimated' ,
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
		modalParams: {
			size: 'sm'
		},
		typeParams: {
			projects: 'text',
			month: 'number'
		},
		displayParams: {
			position: {
				top: '380px',
				left: '460px',
				width: '560px',
				height: '160px'
			}
		},
		systemParams: {
		        api: '/redmine/version/{projects}/{month}',
		        apiVersion: '0.1',
		        method: 'get',
		        port: 9003,
		        url: 'http://localhost'
		 }


	};

	return widgetType;
})();