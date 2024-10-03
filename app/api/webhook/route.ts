import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../lib/stripe';
import { CreateSupabaseClient } from '../../utils/supabaseClient';

export const runtime = 'nodejs'; // lub 'edge'
// Stripe wymaga wyłączonego bodyParsera

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', (err as Error).message);
    return NextResponse.json({ error: 'Webhook Error: ' + (err as Error).message }, { status: 400 });
  }

  console.log(`Received Stripe event: ${event.type}`);

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const subscriptionStatus = subscription.status;

      console.log(`Subscription event: ${event.type} for customer: ${customerId} with status: ${subscriptionStatus}`);

      const supabase = CreateSupabaseClient();
      const { error } = await supabase
        .from('users')
        .update({ subscription_status: subscriptionStatus })
        .eq('stripecustomerid', customerId);

      if (error) {
        console.error('Failed to update subscription status in Supabase:', error.message);
        return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
      }

      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      console.log(`Invoice payment failed for customer: ${customerId}`);

      const supabase = CreateSupabaseClient();
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email, name')
        .eq('stripecustomerid', customerId)
        .single();

      if (userError) {
        console.error('Failed to fetch user email:', userError.message);
        return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_VERCEL_URL}/api/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          firstName: user.name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send email notification:', errorText);
        return NextResponse.json({ error: 'Failed to send email notification' }, { status: 500 });
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ subscription_status: 'payment_failed' })
        .eq('stripecustomerid', customerId);

      if (updateError) {
        console.error('Failed to update subscription status to payment_failed in Supabase:', updateError.message);
        return NextResponse.json({ error: 'Failed to update status on payment failure' }, { status: 500 });
      }

      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
