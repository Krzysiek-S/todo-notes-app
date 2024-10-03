// pages/api/cancel-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../lib/stripe';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { CreateSupabaseClient } from '../../utils/supabaseClient';

export async function POST(req: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = CreateSupabaseClient(session.supabaseAccessToken);

    // Pobierz użytkownika z Supabase, aby uzyskać subskrypcję
    const { data: user, error } = await supabase
      .from('users')
      .select('stripesubscriptionid')
      .eq('id', session.user.id)
      .single();

    if (error || !user || !user.stripesubscriptionid) {
      return NextResponse.json({ error: 'Nie znaleziono subskrypcji' }, { status: 400 });
    }

    // Anulowanie subskrypcji w Stripe
    const deletedSubscription = await stripe.subscriptions.cancel(user.stripesubscriptionid);

    // Zaktualizuj stan subskrypcji w bazie danych, aby odzwierciedlać, że została anulowana
    const { error: updateError } = await supabase
      .from('users')
      .update({ subscription_status: 'canceled' }) // Dodajemy status anulowanej subskrypcji
      .eq('id', session.user.id);

    if (updateError) {
      console.error('Error updating user subscription status:', updateError.message);
      return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subskrypcja została anulowana', deletedSubscription });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
