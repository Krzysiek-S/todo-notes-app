import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../lib/stripe';
import { getServerSession } from "next-auth";
import { AuthOptions } from '@/app/lib/auth';
import { CreateSupabaseClient } from '../../utils/supabaseClient';

export async function POST(req: NextRequest) {
  const session = await getServerSession(AuthOptions);

  console.log("Received POST request to subscription API");

  if (!session || !session.user || !session.user.id) {
    console.warn("Unauthorized access attempt");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { priceId, action } = await req.json();
  console.log("Request body:", { priceId, action });

  if (!priceId && action !== 'cancel') {
    console.error("Missing price ID");
    return NextResponse.json({ error: 'Missing price ID' }, { status: 400 });
  }

  try {
    const supabase = CreateSupabaseClient(session.supabaseAccessToken);
   
    console.log("USER:", session.user)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('stripecustomerid, subscription_id')
      .eq('id', session.user.id)
      .single();
      console.log('Fetched user data:', user);
    console.log('COŚTAM:', user?.stripecustomerid)
    if (userError) {
      console.error('Error fetching user:', userError.message);
      return NextResponse.json({ error: 'Error fetching user data' }, { status: 500 });
    }

    let customerId = user?.stripecustomerid;

    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name!
      });
      customerId = customer.id;
      console.log("dddddduuuuuuuuuuuuupa", customerId);

      const { error: updateError } = await supabase
        .from('users')
        .update({ stripecustomerid: customerId })
        .eq('id', session.user.id);

      if (updateError) {
        console.error('Error updating user with Stripe customer ID:', updateError.message);
        return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
      }
    }

    if (action === 'cancel') {
      if (!user.subscription_id) {
        console.warn("No active subscription found");
        return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
      }

      // Anulowanie subskrypcji w Stripe
      await stripe.subscriptions.update(user.subscription_id, {
        cancel_at_period_end: true,  // Anuluje subskrypcję po zakończeniu okresu rozliczeniowego
      });
      console.log("Subscription marked to cancel at the end of the period");
      // Aktualizacja statusu subskrypcji w bazie danych
      await supabase
        .from('users')
        .update({
          subscription_status: 'canceled',
          trial_end_date: null,
          subscription_id: null
        })
        .eq('id', session.user.id);

      return NextResponse.json({ message: 'Subscription canceled' });
    }

    // Tworzenie sesji Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 5
     },
      customer: customerId,
      success_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_VERCEL_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_VERCEL_URL}/cancel`,
    });
    console.log("Created Stripe checkout session:", checkoutSession.id);
    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
