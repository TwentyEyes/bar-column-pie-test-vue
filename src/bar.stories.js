import barChart from './bar-column-pie.vue'

const customOptions = { // Custom Chart options
	chart: {
		animation: false,
		zoomType: 'xy',
		height: 575,
		spacingTop: 23
	},
	xAxis: {
		text: 'Date'
	},
	yAxis: [
		{
			title: {
				text: 'Users'
			},
			opposite: true
		},
		{
			title: {
				text: 'Visits'
			}
		}],
	tooltip: {
		shared: true,
		useHTML: true,
		headerFormat: '<div class="exa-chart-tooltip">' +
			'<table class="exa-chart-tooltip-table">',
		pointFormat: '<tr>' +
			'<td><div class="exa-chart-tooltip-item-bullet" style="background-color: {point.color}"></div> {series.name} </td>' +
			'<td style="text-align: right"><b> {point.y}</b></td></tr>',
		footerFormat: '</table>'
	},
	plotOptions: {
		column: {
			stacking: 'normal',
			dataLabels: {
				enabled: true
			}
		},
		series: {
			borderWidth: 0,
			dataLabels: {
				enabled: false
			}
		}
	},
	legend: {
		enabled: true
	}
}

export default {
	title: 'Charts/Bar',
	component: barChart,
	argTypes: {
		customOptions: { control: { type: 'object' } },
		stacked: { control: { type: 'boolean' } },
		type: { control: false },
		radius: { control: { type: 'number' } },
		customColors: { control: { type: 'array' } },
		series: { control: { type: 'array', required: true } },
		drilldown: { control: { type: 'object' } },
		categories: { control: { type: 'array', required: false } },
		switchType: { control: { type: 'boolean' } },
	}
}

const Template = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { barChart },
	template: `<bar-chart
      ref="chart"
      v-bind="$props"
    />`
})

export const Bar = Template.bind({})
Bar.args = {
	customOptions: customOptions,
	stacked: false,
	type: 'bar',
	radius: 0,
	series: [{
		name: 'Things',
		colorByPoint: true,
		data: [{
				name: 'Animals',
				y: 5,
				drilldown: 'animals'
		}, {
				name: 'Fruits',
				y: 2,
				drilldown: 'fruits'
		}, {
				name: 'Cars',
				y: 4,
				drilldown: 'cars'
		}]
	}],
	drilldown: {
		series: [{
				id: 'animals',
				data: [
						['Cats', 4],
						['Dogs', 2],
						['Cows', 1],
						['Sheep', 2],
						['Pigs', 1]
				]
		}, {
				id: 'fruits',
				data: [
						['Apples', 4],
						['Oranges', 2]
				]
		}, {
				id: 'cars',
				data: [
						['Toyota', 4],
						['Opel', 2],
						['Volkswagen', 2]
				]
		}]
	}
}