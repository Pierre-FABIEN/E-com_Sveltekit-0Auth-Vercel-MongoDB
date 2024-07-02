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

    const database = client.db('DataBaseSveltekit');
    const usersCollection = database.collection('users');
    const addressesCollection = database.collection('addresses');

    // Supprimer les données existantes
    await usersCollection.deleteMany({});
    await addressesCollection.deleteMany({});

    const users = [];

    for (let i = 0; i < 20; i++) {
      const user = {
        name: faker.name.fullName(),
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
      const addressCount = faker.datatype.number({ min: 0, max: 3 });
      for (let j = 0; j < addressCount; j++) {
        const address = {
          street: faker.address.streetAddress(),
          city: faker.address.city(),
          state: faker.address.state(),
          zip: faker.address.zipCode(),
          country: faker.address.country(),
          userId: userId
        };
        await addressesCollection.insertOne(address);
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
