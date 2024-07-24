<script lang="ts">
	import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

	export let data;

	console.log(data);

	const transaction = data.transaction;

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${day}/${month}/${year} à ${hours}:${minutes}`;
	}

	async function downloadPdf() {
		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage([600, 800]);
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

		page.drawText('Transaction Details', {
			x: 50,
			y: 750,
			size: 18,
			font,
			color: rgb(0, 0, 0)
		});

		let yPosition = 720;

		const addText = (text: string, size: number = 12) => {
			page.drawText(text, { x: 50, y: yPosition, size, font, color: rgb(0, 0, 0) });
			yPosition -= size + 4;
		};

		addText(`Amount: ${transaction.amount} ${transaction.currency.toUpperCase()}`);
		addText(`Status: ${transaction.status}`);
		addText(`Order ID: ${transaction.orderId}`);
		addText(`Stripe Payment ID: ${transaction.stripePaymentId}`);
		addText(`Created At: ${formatDate(transaction.createdAt)}`);
		addText(`Updated At: ${formatDate(transaction.updatedAt)}`);

		addText('User Details', 16);
		addText(`Name: ${transaction.app_user_name}`);
		addText(`Email: ${transaction.app_user_email}`);
		addText(`Recipient: ${transaction.app_user_recipient}`);
		addText(`Street: ${transaction.app_user_street}`);
		addText(`City: ${transaction.app_user_city}`);
		addText(`State: ${transaction.app_user_state}`);
		addText(`ZIP Code: ${transaction.app_user_zip}`);
		addText(`Country: ${transaction.app_user_country}`);

		addText('Customer Details', 16);
		addText(`Name: ${transaction.customer_details_name}`);
		addText(`Email: ${transaction.customer_details_email}`);
		if (transaction.customer_details_phone) {
			addText(`Phone: ${transaction.customer_details_phone}`);
		}

		addText('Products', 16);
		transaction.products.forEach((product) => {
			addText(`Product Name: ${product.name}`);
			addText(`Quantity: ${product.quantity}`);
			addText(`Price: $${product.price}`);
			yPosition -= 10;
		});

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `invoice_${transaction.orderId}.pdf`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
</script>

<button class="download-button" on:click={downloadPdf}>Download PDF</button>
<div class="transaction-details">
	{#if transaction}
		<h2>Transaction Details</h2>
		<p><strong>Amount:</strong> {transaction.amount} {transaction.currency.toUpperCase()}</p>
		<p><strong>Status:</strong> {transaction.status}</p>
		<p><strong>Order ID:</strong> {transaction.orderId}</p>
		<p><strong>Stripe Payment ID:</strong> {transaction.stripePaymentId}</p>
		<p><strong>Created At:</strong> {formatDate(transaction.createdAt)}</p>
		<p><strong>Updated At:</strong> {formatDate(transaction.updatedAt)}</p>

		<h2>User Details</h2>
		<p><strong>Name:</strong> {transaction.app_user_name}</p>
		<p><strong>Email:</strong> {transaction.app_user_email}</p>
		<p><strong>Recipient:</strong> {transaction.app_user_recipient}</p>
		<p><strong>Street:</strong> {transaction.app_user_street}</p>
		<p><strong>City:</strong> {transaction.app_user_city}</p>
		<p><strong>State:</strong> {transaction.app_user_state}</p>
		<p><strong>ZIP Code:</strong> {transaction.app_user_zip}</p>
		<p><strong>Country:</strong> {transaction.app_user_country}</p>

		<h2>Customer Details</h2>
		<p><strong>Name:</strong> {transaction.customer_details_name}</p>
		<p><strong>Email:</strong> {transaction.customer_details_email}</p>
		{#if transaction.customer_details_phone}
			<p><strong>Phone:</strong> {transaction.customer_details_phone}</p>
		{/if}

		<div class="product-list">
			<h2>Products</h2>
			<ul>
				{#each transaction.products as product}
					<li>
						<p><strong>Product Name:</strong> {product.name}</p>
						<p><strong>Quantity:</strong> {product.quantity}</p>
						<p><strong>Price:</strong> ${product.price}</p>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.transaction-details {
		margin: 20px;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
	}
	.transaction-details h2 {
		margin-bottom: 10px;
	}
	.transaction-details p {
		margin: 5px 0;
	}
	.product-list {
		margin-top: 20px;
	}
	.product-list ul {
		list-style: none;
		padding: 0;
	}
	.product-list li {
		margin-bottom: 10px;
	}
	.download-button {
		margin-top: 20px;
	}
</style>
