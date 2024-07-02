import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DATABASE_URL;

if (!uri) {
	console.error('DATABASE_URL is not defined');
	process.exit(1);
}

console.log('Using database URL:', uri);

const client = new MongoClient(uri);

async function run() {
	try {
		await client.connect();

		const database = client.db('DataBaseSveltekit'); // Remplacez par le nom de votre base de données
		const articlesCollection = database.collection('articles');
		const productsCollection = database.collection('products');

		// Supprimer les données existantes
		await articlesCollection.deleteMany({});
		await productsCollection.deleteMany({});

		const articles = [];
		const products = [];

		for (let i = 0; i < 10; i++) {
			articles.push({
				id: faker.string.uuid(),
				title: faker.lorem.sentence(),
				content: faker.lorem.paragraphs(),
				author: faker.person.fullName(),
				publishedAt: faker.date.past(),
				tags: faker.lorem.words().split(' ')
			});

			products.push({
				id: faker.string.uuid(),
				name: faker.commerce.productName(),
				description: faker.commerce.productDescription(),
				price: parseFloat(faker.commerce.price()),
				sku: faker.string.uuid(),
				stock: faker.number.int({ min: 0, max: 100 }),
				createdAt: faker.date.past(),
				updatedAt: new Date()
			});
		}

		await articlesCollection.insertMany(articles);
		await productsCollection.insertMany(products);

		console.log('Fake data inserted successfully');
	} finally {
		await client.close();
	}
}

run().catch(console.dir);
