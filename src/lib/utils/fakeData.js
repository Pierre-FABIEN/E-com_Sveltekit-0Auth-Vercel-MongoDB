import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

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

		const database = client.db('DataBaseSveltekit');
		const usersCollection = database.collection('users');
		const addressesCollection = database.collection('addresses');
		const ordersCollection = database.collection('orders');
		const productsCollection = database.collection('products');

		// Supprimer les données existantes
		await usersCollection.deleteMany({});
		await addressesCollection.deleteMany({});
		await ordersCollection.deleteMany({});
		await productsCollection.deleteMany({});

		// Ajouter l'utilisateur admin
		const adminUser = {
			_id: new ObjectId('6683d18172557c8fda15165a'),
			name: 'Projet 360',
			email: 'projet.troiscentsoixante@gmail.com',
			image: 'https://lh3.googleusercontent.com/a/ACg8ocIdMOgYxqPBshiSkpHNlZfJmZxYHg...',
			role: 'admin',
			createdAt: new Date('2024-07-02T10:08:01.265Z'),
			updatedAt: new Date('2024-07-02T10:08:01.265Z')
		};

		await usersCollection.insertOne(adminUser);

		const users = [adminUser];

		// Générer des utilisateurs fictifs et leurs adresses
		for (let i = 0; i < 20; i++) {
			const user = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				image: faker.image.avatar(),
				role: 'user',
				createdAt: new Date(),
				updatedAt: new Date()
			};

			// Insérer l'utilisateur et obtenir l'ID inséré
			const result = await usersCollection.insertOne(user);
			const userId = result.insertedId;

			// Générer entre 0 et 3 adresses pour chaque utilisateur
			const addressCount = faker.number.int({ min: 0, max: 3 });
			const userAddresses = [];
			for (let j = 0; j < addressCount; j++) {
				const address = {
					street: faker.location.streetAddress(),
					city: faker.location.city(),
					state: faker.location.state(),
					zip: faker.location.zipCode(),
					country: faker.location.country(),
					userId: userId
				};
				const addressResult = await addressesCollection.insertOne(address);
				userAddresses.push(addressResult.insertedId);
			}

			// Créer une commande pour chaque utilisateur avec une adresse aléatoire parmi celles créées pour cet utilisateur
			if (userAddresses.length > 0) {
				const randomAddressId =
					userAddresses[faker.number.int({ min: 0, max: userAddresses.length - 1 })];
				const order = {
					userId: userId,
					addressId: randomAddressId,
					total: parseFloat(faker.commerce.price()), // S'assurer que le total est un nombre
					createdAt: new Date(),
					updatedAt: new Date()
				};
				const orderResult = await ordersCollection.insertOne(order);
				const orderId = orderResult.insertedId;

				// Générer entre 1 et 5 produits pour chaque commande
				const productCount = faker.number.int({ min: 1, max: 5 });
				for (let k = 0; k < productCount; k++) {
					const product = {
						name: faker.commerce.productName(),
						price: parseFloat(faker.commerce.price()), // S'assurer que le prix est un nombre
						orderId: orderId,
						createdAt: new Date(),
						updatedAt: new Date()
					};
					await productsCollection.insertOne(product);
				}
			}

			users.push(user);
		}

		console.log('Inserted users:', users.length);
	} catch (error) {
		console.error('An error occurred:', error);
	} finally {
		await client.close();
	}
}

run().catch(console.dir);
