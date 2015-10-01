import Chart from 'larch.charts';
/**
 * Class LWidget defines behaviour of widget plugins
 */
const ChartClass = function(Logger) {
	const logger = Logger.create('class.Chart');

	return {
		create(widget) {
			let ch;

			try {
				ch = Chart.create(widget);
			} catch(e) {
				logger.error(e);
			}

			return ch;
		}
	};
};
ChartClass.$injector = ['larch.Logger'];

export default {
	name: 'component.Chart',
	type: 'class',
	functor: ChartClass
};