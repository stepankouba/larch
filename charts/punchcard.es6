import d3 from 'd3';
import nv from 'nvd3';

const TYPE = 'punch-card';

export function append(parentElement) {
	const {width, height} = this.getDimensions();
	const margin = {top: 20, right: 20, bottom: 30, left: 80};
	const rawData = this.getData();

	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '11p'];

	const data = [];

	days.forEach(day => data.push({key: day, values: []}));
	rawData.forEach(dayLog => {
		const day = dayLog[0];
		const hour = dayLog[1];
		const value = dayLog[2];

		data[day].values.push({
			x: hour,
			y: day,
			size: Math.round(value / height * 100),
			shape: 'circle'
		});
	});

	nv.addGraph(() => {
		const chart = nv.models.scatterChart()
			// .showDistX(true)
			// .showDistY(true)
			.duration(300)
			.showLegend(false)
			.color(d3.scale.category10().range());

		chart
			.height(height)
			.width(width)
			.margin(margin);

		// chart.scatter.onlyCircles(true);
		chart.xAxis.tickFormat(d => hours[d]);
		chart.yAxis.tickFormat(d => days[d]);

		d3.select(parentElement)
			.append('svg')
			.attr('class', TYPE)
			.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
			.attr('preserveAspectRatio', 'xMidYMid')
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.datum(data)
			.call(chart);

		// nv.utils.windowResize(chart.update);

		return chart;
	});
};