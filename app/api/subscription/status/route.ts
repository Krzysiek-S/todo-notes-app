import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { AuthOptions } from '@/app/lib/auth';
import { CreateSupabaseClient } from '../../../utils/supabaseClient';

export async function GET(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  console.log("Received GET request to subscription/status API");
  if (!session || !session.user || !session.user.id) {
    console.warn("Unauthorized access attempt");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = CreateSupabaseClient(session.supabaseAccessToken);
    const { data, error } = await supabase
      .from('users')
      .select('subscription_status, trial_end_date')
      .eq('id', session.user.id)
      .single();
      console.log("Fetched user subscription data:", data);
    if (error || !data) {
      console.error('Failed to fetch subscription status:', error?.message);
      return NextResponse.json({ error: 'Failed to fetch subscription status' }, { status: 500 });
    }

    const isSubscribed = data.subscription_status;
    const trialEndDate = data.trial_end_date || null;
    console.log('is subscribed', isSubscribed)
    return NextResponse.json({ isSubscribed, trialEndDate });
  } catch (error) {
    console.error('Unexpected error fetching subscription status:', error);
    return NextResponse.json({ error: 'Unexpected error fetching subscription status' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  console.log("Received POST request to subscription/status API");
  if (!session || !session.user || !session.user.id) {
    console.warn("Unauthorized access attempt");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subscriptionStatus } = await req.json();
    console.log("Updating subscription status to:", subscriptionStatus);
    const supabase = CreateSupabaseClient(session.supabaseAccessToken);

    const { error } = await supabase
      .from('users')
      .update({ subscription_status: subscriptionStatus })
      .eq('id', session.user.id);

    if (error) {
      console.error('Failed to update subscription status:', error.message);
      return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscription status updated successfully' });
  } catch (error) {
    console.error('Unexpected error updating subscription status:', error);
    return NextResponse.json({ error: 'Unexpected error updating subscription status' }, { status: 500 });
  }
}