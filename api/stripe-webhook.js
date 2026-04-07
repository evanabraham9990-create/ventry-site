import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable body parsing — Stripe needs the raw body for signature verification
export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const customerEmail = session.customer_details?.email;

        if (customerEmail && subscriptionId) {
          // Find user by email
          const { data: users } = await supabase.auth.admin.listUsers();
          const user = users?.users?.find((u) => u.email === customerEmail);

          if (user) {
            // Update profile
            await supabase.from('profiles').upsert({
              id: user.id,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            });

            // Create subscription record
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            await supabase.from('subscriptions').upsert({
              user_id: user.id,
              stripe_subscription_id: subscriptionId,
              plan: sub.items.data[0]?.price?.id === process.env.STRIPE_PRICE_GROWTH ? 'growth' : 'starter',
              status: sub.status,
              current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
              current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        await supabase
          .from('subscriptions')
          .update({
            status: sub.status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription);
        }
        break;
      }
    }
  } catch (err) {
    console.error('[webhook] Processing error:', err.message);
  }

  return res.status(200).json({ received: true });
}
