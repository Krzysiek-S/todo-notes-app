// api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../lib/stripe';
import { CreateSupabaseClient } from '../../utils/supabaseClient';

export const config = {
  api: {
    bodyParser: false, // Stripe wymaga wyłączonego bodyParsera
  },
};

export async function POST(req: NextRequest) {
  // Użycie ReadableStream do pobrania surowego ciała żądania
  const rawBody = await req.text(); 
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    // Weryfikacja sygnatury webhooka
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

  // Obsługa różnych typów zdarzeń Stripe
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const subscriptionStatus = subscription.status;

      console.log(`Subscription event: ${event.type} for customer: ${customerId} with status: ${subscriptionStatus}`);

      // Inicjalizacja Supabase
      const supabase = CreateSupabaseClient();

      // Aktualizacja statusu subskrypcji w bazie danych
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

      // Pobieranie adresu e-mail użytkownika
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email, name') // Zakładając, że firstName jest w tabeli users
        .eq('stripecustomerid', customerId)
        .single();

      if (userError) {
        console.error('Failed to fetch user email:', userError.message);
        return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
      }

      // Wywołanie endpointu API Next.js do wysyłania e-maila
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_VERCEL_URL}/api/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          firstName: user.name, // Dopasowanie do twojego szablonu e-mail
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send email notification:', errorText);
        return NextResponse.json({ error: 'Failed to send email notification' }, { status: 500 });
      }

      // Aktualizacja statusu subskrypcji na "payment_failed"
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

  // Odpowiedź 200 OK
  return NextResponse.json({ received: true });
}
