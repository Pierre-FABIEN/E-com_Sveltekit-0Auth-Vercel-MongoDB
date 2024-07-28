<script lang="ts">
	import { Line, Bar } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		LineElement,
		PointElement,
		BarElement,
		LinearScale,
		Title,
		Tooltip,
		Legend,
		CategoryScale
	} from 'chart.js';

	// Register the necessary components and scales
	ChartJS.register(
		LineElement,
		PointElement,
		BarElement,
		LinearScale,
		Title,
		Tooltip,
		Legend,
		CategoryScale
	);

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
				label: 'Transactions',
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
				display: false,
				text: 'Transaction Amounts Over Time'
			}
		}
	};

	// Extract statuses and their counts from transactions
	const statusCounts = data.transactions.reduce((acc, transaction) => {
		acc[transaction.status] = (acc[transaction.status] || 0) + 1;
		return acc;
	}, {});

	const statusLabels = Object.keys(statusCounts);
	const statusData = Object.values(statusCounts);

	const statusChartData = {
		labels: statusLabels,
		datasets: [
			{
				label: 'Transaction Statuses',
				backgroundColor: 'rgba(153,102,255,0.2)',
				borderColor: 'rgba(153,102,255,1)',
				data: statusData
			}
		]
	};

	const statusOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top'
			},
			title: {
				display: false,
				text: 'Transaction Statuses'
			}
		}
	};

	// Extract amounts spent by each user
	const userSpendings = data.transactions.reduce((acc, transaction) => {
		console.log(transaction, 'transaction');

		acc[transaction.app_user_email] = (acc[transaction.app_user_email] || 0) + transaction.amount;
		return acc;
	}, {});

	const userLabels = Object.keys(userSpendings);
	const userData = Object.values(userSpendings);

	const userChartData = {
		labels: userLabels,
		datasets: [
			{
				label: 'User Spendings',
				backgroundColor: 'rgba(255,99,132,0.2)',
				borderColor: 'rgba(255,99,132,1)',
				data: userData
			}
		]
	};

	const userOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top'
			},
			title: {
				display: false,
				text: 'User Spendings'
			}
		}
	};

	console.log(data, 'data');
</script>

<div class="ccc">
	<h1 class="text-5xl w-[80vw] m-5">Dashboard</h1>
	<div class="rtb w-[80vw]">
		<div class="w-[30%] rounded border p-5">
			<Line data={chartData} {options} />
		</div>
		<div class="w-[30%] rounded border p-5">
			<Bar data={statusChartData} {statusOptions} />
		</div>
		<div class="w-[30%] rounded border p-5">
			<Bar data={userChartData} {userOptions} />
		</div>
	</div>
</div>
