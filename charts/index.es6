import * as LineChart from './linechart.es6';
import * as PunchCard from './punchcard.es6';
import * as PieChart from './piechart.es6';

const TYPES = {
	'chart-line': LineChart,
	'punch-card': PunchCard,
	'pie-chart': PieChart
};

const Chart = {
	create(widget) {
		const c = Object.create(Chart.prototype);

		c.widget = widget;

		if (!Chart.isSupportedType(c.widget.version.type)) {
			throw new Error('charts: not supported type');
		}

		return c;
	},
	isSupportedType(type) {
		return TYPES[type] !== undefined;
	},
	prototype: {
		margin: {top: 20, right: 20, bottom: 30, left: 50},
		getDimensions() {
			return this.widget.version.client.display;
		},
		getData() {
			return this.widget.data;
		},
		append(parentElementSelector) {
			const app = TYPES[this.widget.version.type].append.bind(this);
			document.querySelector(parentElementSelector).innerHTML = '';
			app(document.querySelector(parentElementSelector));
		},
		update(parentElementSelector) {
			const upd = TYPES[this.widget.version.type].update.bind(this);
			upd(document.querySelector(parentElementSelector));
		}
	}
};

export default Chart;