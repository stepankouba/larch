function dragDrtv($log, $document) {
	let log = $log.getLogger('dragDrtv');

	return {
		restrict: 'A',
		replace: true,
		controller: function($scope) {
			this.action = function(text) {
				window.alert(text);
			}
		},
		link: function dragDrtvLink(scope, elem, attr, ctrl) {
			let moving = false;
			let elemPos = {};
			let newPos = {};
			let mousePos = {};
			const STEP = 20;

			let borders = {
				min: {x: 0, y: 0},
				max: {
					x: $document[0].querySelector('#larch-dashboard-content').getBoundingClientRect().width,
					y: $document[0].querySelector('#larch-dashboard-content').getBoundingClientRect().height,
				},
				isInBorders: function bordersIsInBorders(position) {
					let {x, y, width, height} = position;
					return (this.min.x <= x &&  (x + width) <= this.max.x) &&
							(this.min.y <= y &&  (y + height) <= this.max.y);
				}
			};

			function mouseMove(e) {
				e.preventDefault();

				// step
				if (Math.abs(e.clientX - mousePos.x) < STEP && Math.abs(e.clientY - mousePos.y) < STEP ) {
					return false;
				}

				let delta = {x: e.clientX - mousePos.x, y: e.clientY - mousePos.y};

				if (Math.abs(delta.x) >= STEP) {
					let r = Math.floor(Math.abs(delta.x) / STEP);

					delta.x = (delta.x < 0) ? (-r * STEP) : r * STEP;
				} else {
					delta.x = 0;
				}
				
				if (Math.abs(delta.y) >= STEP) {
					let r = Math.floor(Math.abs(delta.y) / STEP);

					delta.y = (delta.y < 0) ? (-r * STEP) : r * STEP;
				} else {
					delta.y = 0;
				}

				newPos.x = elemPos.x + delta.x;
				newPos.y = elemPos.y + delta.y;

				// save 
				elemPos.x = newPos.x;
				elemPos.y = newPos.y;

				// remember last mous position
				mousePos.x = e.clientX;
				mousePos.y = e.clientY;

				elem[0].style.left = elemPos.x + 'px';
				elem[0].style.top = elemPos.y + 'px';

				return false;
			}

			function mouseUp(e) {
				e.preventDefault();

				if (moving) {
					moving = false;

					$document.unbind('mousemove');
					$document.unbind('mouseup');
				}

				return false;
			}

			function mouseDown(e) {
				e.preventDefault();

				if (!moving) {
					moving = true;

					mousePos.x = e.clientX;
					mousePos.y = e.clientY;

					elemPos.x = elem.prop('offsetLeft');
					elemPos.y = elem.prop('offsetTop');

					// can do this, because divs are not resizable
					newPos.width = elemPos.width = elem[0].getBoundingClientRect().width;
					newPos.height = elemPos.height = elem[0].getBoundingClientRect().height;

					$document.bind('mousemove', mouseMove);
					$document.bind('mouseup', mouseUp);
				}

				return false;
			}

			scope.$on('grid', (e, showGrid) => {
				if (showGrid) {
					elem.bind('mousedown', mouseDown);
				} else {
					elem.unbind('mousedown');
				}
			});
		}
	};
}
dragDrtv.$inject = ['$log', '$document'];


export default {
	drag: dragDrtv,
};