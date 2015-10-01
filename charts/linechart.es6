import d3 from 'd3';
import nv from 'nvd3';

const TYPE = 'chart-line';

export function append(parentElement) {
	const {width, height} = this.getDimensions();
	const margin = this.margin;
	const rawData = this.getData();
	const data = [{key: 'Commits avg per week', area: true, values: []}];

	rawData.forEach(d => {
		data[0].values.push({x: d.week, y: d.total / d.days.length});
	});

	nv.addGraph(() => {
		const chart = nv.models.lineChart()
			.duration(300)
			.showLegend(true)
			.interpolate('cardinal')
			.color(d3.scale.category10().range());

		chart
			.height(height)
			.width(width)
			.margin(margin);

		// chart.scatter.onlyCircles(true);
		chart.xAxis
			.tickFormat(d => d3.time.format('%Y-%W')(new Date(d * 1000)));
		// chart.yAxis.tickFormat(d => days[d]);

		d3.select(parentElement)
			.append('svg')
			.attr('class', TYPE)
			.datum(data)
			.call(chart);

		nv.utils.windowResize(chart.update);

		return chart;
	});

	// const format = d3.time.format('%Y-%W');

	// const chart = d3.select(parentElement)
	// 	.insert('svg')
	// 	.attr('class', TYPE)
	// 	.attr('viewBox', `0 0 ${width + margin.left + margin.right + 20} ${height + margin.top + margin.bottom + 20}`)
	// 	.attr('preserveAspectRatio', 'xMidYMid')
	// 	.append('g')
	// 	.attr('transform', `translate(${margin.left},${margin.top})`);

	// const x = d3.scale.linear()
	// 			.domain([0, data.length])
	// 			.range([0,width]);

	// const xAxis = d3.svg.axis()
	// 				.scale(x)
	// 				.tickValues(data.map(d => new Date(d.week * 1000)))
	// 				.tickFormat(format)
	// 				.orient('bottom');

	// const y = d3.scale.linear()
	// 			.domain([0, Math.max(...data.map(i => i.total / i.days.length))])
	// 			.range([height, 0]);

	// const yAxis = d3.svg.axis()
	// 				.scale(y)
	// 				.orient('left');

	// const lineFunc = d3.svg.line()
	// 	.interpolate('cardinal')
	// 	.x((d, i) => x(i))
	// 	.y(d => y(d.total / d.days.length));

	// chart.append('g')
	// 	.attr('class', 'chart-line-x-axis')
	// 	.attr('transform', `translate(0,${height})`)
	// 	.call(xAxis);

	// chart.append('g')
	// 	.attr('class', 'chart-line-y-axis')
	// 	.call(yAxis)
	// 	.append('text')
	// 	.attr('transform', 'rotate(-90)')
	// 	.attr('y', 6)
	// 	.attr('dy', '.71em')
	// 	.style('text-anchor', 'end')
	// 	.text('Commits per week (avg)');

	// const l = chart
	// 	.append('path')
	// 	.attr('d', lineFunc(data))
	// 	.attr('class', 'chart-line-value');

	// const totalLength = l.node().getTotalLength();

	// l.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
	// 	.attr('stroke-dashoffset', totalLength)
	// 	.transition()
	// 	.duration(2000)
	// 	.ease('linear')
	// 	.attr('stroke-dashoffset', 0);
};