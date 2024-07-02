// src/routes/api/webhooks.ts
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
});

const prisma = new PrismaClient();

export async function POST({ request }) {
  const sig = request.headers.get('stripe-signature');
  
  let event;

  try {
    const rawBody = await request.text(); // Get the raw body
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update order status in your database
      await prisma.order.update({
        where: { id: session.metadata.order_id },
        data: { status: 'confirmed' }
      });
      break;
    // Handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return json({ received: true });
}
