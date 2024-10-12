import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../lib/stripe';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/lib/auth';
import { CreateSupabaseClient } from '../../utils/supabaseClient';

export async function POST(req: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = CreateSupabaseClient(session.supabaseAccessToken);

    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_id')
      .eq('id', session.user.id)
      .single();

    if (error || !user || !user.subscription_id) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 400 });
    }

    // Anulowanie subskrypcji w Stripe
    await stripe.subscriptions.update(user.subscription_id, {
      cancel_at_period_end: true,
    });

    // Aktualizacja statusu subskrypcji w bazie danych
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_status: 'canceled',
        trial_end_date: null,
        subscription_id: null,
      })
      .eq('id', session.user.id);

    if (updateError) {
      console.error('Error updating subscription status:', updateError.message);
      return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscription canceled' });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
