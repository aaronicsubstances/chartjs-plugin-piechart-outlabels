# Quick Start

## First Steps

Include Chart.js library and chartjs-plugin-piechart-outlabels-aars plugin to HTML page.

```html
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script 
		src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js"
	></script>
	<script
		src="https://cdn.jsdelivr.net/npm/chartjs-plugin-piechart-outlabels-aars@1.0.4/dist/chartjs-plugin-piechart-outlabels-aars.umd.min.js"
	></script>

	<title>Pie Chart Outlabels</title>
</head>
```

The plugin works with the chart types called `pie` and `doughnut`. Insert canvas element to HTML page.

```html
<div id="chart-wrapper">
	<canvas id="outlabeledChart"></canvas>
</div>
```

Initialize chart.

```html
<script id="script-construct">
	var chart = new Chart(document.getElementById('outlabeledChart'), {
		type: 'pie',
		data: {
			labels: [
				'ONE',
				'TWO',
				'THREE',
				'FOUR',
				'FIVE',
				'SIX',
				'SEVEN',
				'EIGHT',
				'NINE',
				'TEN'
			],
			datasets: [{
				backgroundColor: [
					'#FF3784',
					'#36A2EB',
					'#4BC0C0',
					'#F77825',
					'#9966FF',
					'#00A8C6',
					'#379F7A',
					'#CC2738',
					'#8B628A',
					'#8FBE00'
				],
				data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			}]
		},
		options: {
			radius: 40, // makes chart 40% smaller (100% by default, so this preoprty has to defined in order to see the labels not clipped off)
			plugins: {
				legend: false,
				outlabels: {
					text: '%l %p',
					color: 'white',
					stickLength: 45,
					font: {
						resizable: true,
						minSize: 12,
						maxSize: 18
					}
				}
			}
		}
	});
</script>
```

## Final Result

```html
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script 
			src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js"
		></script>
		<script
			src="https://cdn.jsdelivr.net/npm/chartjs-plugin-piechart-outlabels-aars@1.0.4/dist/chartjs-plugin-piechart-outlabels-aars.umd.min.js"
		></script>

		<title>Pie Chart Outlabels</title>
	</head>
	<body>
		<div id="chart-wrapper">
			<canvas id="outlabeledChart"></canvas>
		</div>
		<script id="script-construct">
			var chart = new Chart(document.getElementById('outlabeledChart'), {
				type: 'pie',
				data: {
					labels: [
						'ONE',
						'TWO',
						'THREE',
						'FOUR',
						'FIVE',
						'SIX',
						'SEVEN',
						'EIGHT',
						'NINE',
						'TEN'
					],
					datasets: [{
						backgroundColor: [
							'#FF3784',
							'#36A2EB',
							'#4BC0C0',
							'#F77825',
							'#9966FF',
							'#00A8C6',
							'#379F7A',
							'#CC2738',
							'#8B628A',
							'#8FBE00'
						],
						data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
					}]
				},
				options: {
					radius: 40, // makes chart 40% smaller (100% by default, so this preoprty has to defined in order to see the labels not clipped off)
					plugins: {
						legend: false,
						outlabels: {
							text: '%l %p',
							color: 'white',
							stickLength: 45,
							font: {
								resizable: true,
								minSize: 12,
								maxSize: 18
							}
						}
					}
				}
			});
		</script>
	</body>
</html>
```
