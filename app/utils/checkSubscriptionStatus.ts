// utils/checkSubscriptionStatus.ts
import { CreateSupabaseClient } from './supabaseClient';

export async function checkSubscriptionStatus(userId: string, supabaseAccessToken: string) {
  const supabase = CreateSupabaseClient(supabaseAccessToken);
  
  // Pobieranie statusu subskrypcji użytkownika z Supabase
  const { data, error } = await supabase
    .from('users')
    .select('subscription_status, trial_end_date, subscription_id')
    .eq('id', userId)
    .single();

 if (error || !data) {
    console.error('Error fetching subscription details:', error);
    return {
      subscriptionStatus: 'inactive',
      trialEndDate: null,
      subscriptionId: null,
    };
  }

  return {
    subscriptionStatus: data.subscription_status,
    trialEndDate: data.trial_end_date,
    subscriptionId: data.subscription_id,
  } 
}
