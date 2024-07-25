<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		Tooltip,
		Legend,
		CategoryScale
	} from 'chart.js';

	// Register the necessary components and scales
	ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

	export let data;

	// Extract dates and amounts from transactions
	const labels = data.transactions.map((transaction) =>
		new Date(transaction.createdAt).toLocaleDateString()
	);
	const dataAmounts = data.transactions.map((transaction) => transaction.amount);

	const chartData = {
		labels,
		datasets: [
			{
				label: 'Transaction Amounts',
				backgroundColor: 'rgba(75,192,192,0.2)',
				borderColor: 'rgba(75,192,192,1)',
				data: dataAmounts,
				cubicInterpolationMode: 'monotone', // Smooth curves
				tension: 0.4 // Adjust the curvature
			}
		]
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top'
			},
			title: {
				display: true,
				text: 'Transaction Amounts Over Time'
			}
		}
	};
</script>

<Line data={chartData} {options} />
