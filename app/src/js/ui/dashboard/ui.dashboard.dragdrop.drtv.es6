function dragDrtv($log) {
	let log = $log.getLogger('dragDrtv');

	return {
		restrict: 'A',
		replace: true,
		link: function(scope, elem, attr, ctrl) {

			elem.attr('draggable', 'true');
			elem.bind('dragstart', function(e){
				log.debug('started');

				e.stopPropagation();
				return true;
			});
			elem.bind('dragend', function(e){
				log.debug('ended');
				
				return true;
			});
		}
	};
}
dragDrtv.$inject = ['$log'];

function dropDrtv($log) {
	return {

	};
}
dropDrtv.$inject = ['$log'];

function droppableDrtv($log) {
	return {
		restrict: 'A',
		replace: true,
		link: function($scope, elem, attr, ctrl) {
			
			elem.bind('dragenter', function(e){
				elem.css('background-color', 'green');
				return true;
			});
			elem.bind('dragover', function(e){
				e.preventDefault();

				return true;
			});
			elem.bind('dragleave', function(e){
				elem.css('background-color', '');
			});
		}
	};
}
droppableDrtv.$inject = ['$log'];


export default {
	drag: dragDrtv,
	drop: dropDrtv,
	droppable: droppableDrtv
};