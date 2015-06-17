'use strict';

(function(){
	var td = function(data) {
		var working = {};
		var i = 1;
		var xs = {};
		var columns = [];

		function formatDate(date) {
		    var d = new Date(date),
		        month = '' + (d.getMonth() + 1),
		        day = '' + d.getDate(),
		        year = d.getFullYear();

		    if (month.length < 2) month = '0' + month;
		    if (day.length < 2) day = '0' + day;

		    return [year, month, day].join('-');
		}

		data.forEach(function(obj){
			var author = obj.author_name;
			var date = formatDate(obj.created_at);

			if (!working[author])
				working[author] = {};

			if (!working[author][date])
				working[author][date] = 0;

			working[author][date]++;
		});
		

		Object.keys(working).forEach(function(k) {
			var xValues = [];
			var values = [];

			xs[k] = 'x'+i;

			xValues.push('x'+i);
			columns.push(xValues.concat(Object.keys(working[k])));

			values.push(k);
			columns.push(values.concat(Object.keys(working[k]).map(function(v){return working[k][v];})));

			i++;
		});

		return {xs: xs, columns: columns, type: 'spline'};
	};

	var widgetType = {
		/**
		 * metadata
		 */
		authors: ['koubas'] ,
		desc:  'graphical representation of last 100 commits' ,
		homepage:  '' ,
		id: 6,
		name:  'gitlab-commits' ,
		repository:  '' ,
		source:  'Gitlab' ,
		tags: [ ],
		title:  'Gitlab commits' ,
		version:  '0.1',
		
		/**
		 * implementation settings
		 */
		template: null,
		config: {
			updateInterval: null, // in milsecs
			useInnerFramework: false, //use angular
			useHandleBars: false,
			useC3: true
		},
		paths: {
			//jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js',
			//d3js: 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'
		},
		udf: {
			open: function(text){ window.alert(text); },
			transformData: td
		},
		modalParams: {
			size: 'sm'
		},
		typeParams: {
			projects: 'text',
			token: 'text'
		},
		displayParams: {
			widgetHeight: 'large',
			c3: {
				axis: {
					x: {
				    	type: 'timeseries',
				        tick: { format: '%Y-%m-%d' }
				    }
				}
			}
		},
		systemParams: [
			{
				api: '/api/v3/projects?search={project}&private_token={token}',
				apiVersion: '0.1',
				method: 'get',
				port: undefined,
				url: 'https://git.simplity.eu',
				// this object defines which property should be after query stored in params
				results: {
					id: 'projectId'
				}
			},
			{
				api: '/api/v3/projects/{projectId}/repository/commits?per_page=100&private_token={token}',
				apiVersion: '0.1',
				method: 'get',
				port: undefined,
				url: 'https://git.simplity.eu',
			}
		]


	};

	return widgetType;
})();