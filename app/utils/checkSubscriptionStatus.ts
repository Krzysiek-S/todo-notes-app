// utils/checkSubscriptionStatus.ts
import { CreateSupabaseClient } from './supabaseClient';

export async function checkSubscriptionStatus(userId: string, supabaseAccessToken: string): Promise<string | null> {
  const supabase = CreateSupabaseClient(supabaseAccessToken);
  
  // Pobieranie statusu subskrypcji użytkownika z Supabase
  const { data, error } = await supabase
    .from('users')
    .select('subscription_status')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to fetch subscription status:', error.message);
    return null;
  }

  return data?.subscription_status || null;
}
