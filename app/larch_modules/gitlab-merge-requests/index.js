'use strict';

(function(){
	var widgetType = {
		/**
		 * metadata
		 */
		authors: ['koubas'] ,
		desc:  'List of the merge reuqests for particular project' ,
		homepage:  '' ,
		id: 5,
		name:  'gitlab-merge-requests' ,
		repository:  '' ,
		source:  'Gitlab' ,
		tags: [ ],
		title:  'Merge requests' ,
		version:  '0.1',
		
		/**
		 * implementation settings
		 */
		templateUrl: 'index.html',
		config: {
			updateInterval: null, // in milsecs
			useInnerFramework: false, //use angular
			useHandleBars: true
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
			token: 'text'
		},
		displayParams: {
			position: {
				top: '380px',
				left: '20px',
				width: '1000px',
				height: '350px'
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
				api: '/api/v3/projects/6/merge_requests?state=opened&private_token={token}',
				apiVersion: '0.1',
				method: 'get',
				port: undefined,
				url: 'https://git.simplity.eu',
			}
		]


	};

	return widgetType;
})();