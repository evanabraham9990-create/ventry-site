import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  starter: process.env.STRIPE_PRICE_STARTER,
  growth: process.env.STRIPE_PRICE_GROWTH,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan, email } = req.body;

  if (!plan || !email) {
    return res.status(400).json({ error: 'Plan and email are required.' });
  }

  const priceId = PRICE_MAP[plan];
  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  try {
    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({ email });
    }

    // Create Checkout Session with 14-day trial
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
      },
      success_url: `${req.headers.origin || 'https://ventryxai.com'}/dashboard.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://ventryxai.com'}/signup.html?plan=${plan}`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
}
