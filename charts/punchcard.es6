import d3 from 'd3';

const TYPE = 'punch-card';

export function append(parentElement) {
	const {width, height} = this.getDimensions();
	const margin = {top: 20, right: 20, bottom: 30, left: 120};
	const data = this.getData();

	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '11p'];

	const x = d3.scale.linear().domain([0, 23]).range([0, width]);
	const y = d3.scale.linear().domain([0, 6]).range([0, height]);
	const color = d3.scale.category10();

	const xAxis = d3.svg.axis().scale(x).orient('bottom')
		.ticks(hours.length)
		.tickPadding(10)
		.tickFormat(d => hours[d]);

	const yAxis = d3.svg.axis().scale(y).orient('left')
		.ticks(days.length)
		.tickPadding(10)
		.tickFormat(d => days[d]);

	const maxRadius = d3.max(data.map(d => d[2]));

	const r = d3.scale.linear().domain([0, maxRadius]).range([0, 12]);

	const _svg = d3.select(parentElement)
			.append('svg')
			.attr('class', `nvd3 ${TYPE}`)
			.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
			.attr('preserveAspectRatio', 'xMidYMid')
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

	_svg.append('g')
		.attr('class', 'nv-axis nv-x')
		.attr('transform', `translate(0, ${height})`)
		.call(xAxis);

	_svg.append('g')
		.attr('class', 'nv-axis nv-x')
		.call(yAxis);

	_svg.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', d => x(d[1]))
		.attr('cy', d => y(d[0]))
		.attr('r', d => r(d[2]))
		.attr('fill', d => color(d[0]));
};