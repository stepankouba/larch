import d3 from 'd3';
import nv from 'nvd3';

const TYPE = 'pie-chart';

export function append(parentElement) {
	const {width, height} = this.getDimensions();
	const margin = this.margin;
	// const radius = Math.min(width, height) / 2;
	const data = this.getData();
	const colors = d3.scale.category10().range();

	nv.addGraph(() => {
		const chart = nv.models.pieChart()
			.x(d => d.key)
			.y(d => d.value)
			.showLabels(true)
			.labelThreshold(0.05)
			.labelType('percent')
			.donut(true)
			.donutRatio(0.35)
			.showLegend(false)
			.labelsOutside(true)
			.color(colors)
			;

		// create _chart
		d3.select(parentElement)
			.append('svg')
			.attr('class', TYPE)
			// .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
			// .attr('preserveAspectRatio', 'xMidYMid')
			// .append('g')
			// .attr('transform', `translate(${margin.left},${margin.top})`)
			.datum(data)
			.call(chart);

		return chart;
	});

	// const _pie = d3.layout.pie()
	// 	// .padAngle(0.03) // specify pie padding
	// 	.sort(null)
	// 	.value(d => d.value);

	// const _arc = d3.svg.arc()
	// 	.innerRadius(this._radius - 40)
	// 	.outerRadius(this._radius - 5);

	// const color = d3.scale.category10();

	// const _arcHover = d3.svg.arc()
	// 	.innerRadius(radius - 40)
	// 	.outerRadius(radius - 10);

	// // TODO: mouse events
	// chart.selectAll('.arc')
	// 	.data(_pie(this.getData()))
	// 	.enter().append('g')
	// 	.attr('class', 'arc')
	// 	.append('path')
	// 	.attr('d', _arc)
	// 	.attr('fill', d => color(d.value))
	// 	// .on('mouseover', d => {
	// 	// 	d3.select(this)
	// 	// 		.transition()
	// 	// 		.duration(200)
	// 	// 		.attr('d', _arcHover);
	// 	// })
	// 	// .on('mouseout', d => {
	// 	// 	d3.select(this)
	// 	// 		.transition()
	// 	// 		.duration(200)
	// 	// 		.attr('d', _arc);
	// 	// })
	// 	;
};