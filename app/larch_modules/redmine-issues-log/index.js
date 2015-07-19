'use strict';

(function(){
	var widgetType = {
		/**
		 * metadata
		 */
		authors: [ 'koubas'] ,
		desc:  'Displays last 7 days snaphots of particular issue' ,
		homepage:  '' ,
		id: 1 ,
		name:  'redmine-issues-log' ,
		repository:  '' ,
		source:  'Redmine' ,
		tags: [ ],
		title:  'Issue log' ,
		version:  '0.1',

		/**
		 * implementation settings
		 */
		template: null,
		templateUrl: 'index.html',
		config: {
			updateInterval: null, // in milsecs
			useInnerFramework: true, //use angular 
		},
		paths: {
			//jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js',
			//d3js: 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'
		},
		controller: function($scope) {
			$scope.showDetail = null;

			$scope.setShowDetail = function(value){
				if ($scope.showDetail === null || $scope.showDetail !== value) {
					$scope.showDetail = value;
				} else {
					$scope.showDetail = null;
				}

			}
		},
		udf: {
			open: function(text){ window.alert(text); }
		},
		modalParams: {
	        size: 'sm'
	    },
	    typeParams: {
        	month: 'number',
        	user: 'text'
        },
        displayParams: {
			widgetHeight: 'large'
		},
        systemParams: {
        	api: '/redmine/issues/{user}/log/{month}',
        	apiVersion: '0.1',
        	method: 'get',
        	port: 9003,
        	url: 'http://localhost'
    	}
   	};
	return widgetType;
})();
