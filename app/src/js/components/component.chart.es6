import Handlebars from 'handlebars';
import { copyDefinedProps } from '../lib/lib.assign.es6';
import d3 from 'd3';
/**
 * Class LWidget defines behaviour of widget plugins
 */
const ChartClass = function(Logger) {
	const logger = Logger.create('class.Chart');

	const Chart = {
		create(widget) {
			const c = Object.create(Chart.prototype);

			c.widget = widget;

			return c;
		},
		prototype: {
			margin: {top: 20, right: 20, bottom: 30, left: 50},
			removeLoader(parentElementSelector) {
				document.querySelector(parentElementSelector)
					.removeChild(document.querySelector(`${parentElementSelector} > .loader`));
			},
			append(parentElementSelector) {
				const parentElement = document.querySelector(parentElementSelector);

				const {width, height} = this.widget.version.client.display;
				const margin = this.margin;
				
				const format = d3.time.format('%Y-%W');

				const chart = d3.select(parentElement)
					.insert('svg')
					.attr('class', this.type)
					.attr('viewBox', `0 0 ${width + margin.left + margin.right + 20} ${height + margin.top + margin.bottom + 20}`)
					.attr('preserveAspectRatio', 'xMidYMid')
					.append('g')
					.attr('transform', `translate(${margin.left},${margin.top})`);

				const x = d3.scale.linear()
							.domain([0, this.widget.data.length])
							.range([0,width]);

				const xAxis = d3.svg.axis()
								.scale(x)
								.tickValues(this.widget.data.map(d => new Date(d.week * 1000)))
								.tickFormat(format)
								.orient('bottom');

				const y = d3.scale.linear()
							.domain([0, Math.max(...this.widget.data.map(i => i.total / i.days.length))])
							.range([height, 0]);

				const yAxis = d3.svg.axis()
								.scale(y)
								.orient('left');

				const lineFunc = d3.svg.line()
					.interpolate('cardinal')
					.x((d, i) => x(i))
					.y(d => y(d.total / d.days.length));

				chart.append('g')
					.attr('class', 'chart-line-x-axis')
					.attr('transform', `translate(0,${height})`)
					.call(xAxis);

				chart.append('g')
					.attr('class', 'chart-line-y-axis')
					.call(yAxis)
					.append('text')
					.attr('transform', 'rotate(-90)')
					.attr('y', 6)
					.attr('dy', '.71em')
					.style('text-anchor', 'end')
					.text('Commits per week (avg)');

				const l = chart
					.append('path')
					.attr('d', lineFunc(this.widget.data))
					.attr('class', 'chart-line-value');

				const totalLength = l.node().getTotalLength();

				l.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
					.attr('stroke-dashoffset', totalLength)
					.transition()
					.duration(2000)
					.ease('linear')
					.attr('stroke-dashoffset', 0);
			}
		}
	};

	return Chart;
};
ChartClass.$injector = ['larch.Logger'];

export default {
	name: 'component.Chart',
	type: 'class',
	functor: ChartClass
};