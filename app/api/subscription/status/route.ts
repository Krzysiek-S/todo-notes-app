import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { CreateSupabaseClient } from '../../../utils/supabaseClient';

export async function GET(req: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = CreateSupabaseClient(session.supabaseAccessToken);
    const { data, error } = await supabase
      .from('users')
      .select('subscription_status')
      .eq('id', session.user.id)
      .single();

    if (error || !data) {
      console.error('Failed to fetch subscription status:', error?.message);
      return NextResponse.json({ error: 'Failed to fetch subscription status' }, { status: 500 });
    }

    return NextResponse.json({ isSubscribed: data.subscription_status === 'active' });
  } catch (error) {
    console.error('Unexpected error fetching subscription status:', error);
    return NextResponse.json({ error: 'Unexpected error fetching subscription status' }, { status: 500 });
  }
}
