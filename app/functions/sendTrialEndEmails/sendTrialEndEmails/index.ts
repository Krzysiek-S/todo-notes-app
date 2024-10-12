import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { CreateSupabaseClient } from '@/app/utils/supabaseClient';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTrialEndEmails = async (supabaseAccessToken: string) => {
    const supabase = CreateSupabaseClient(supabaseAccessToken);
    const { data: users } = await supabase
    .from('users')
    .select('email, trial_start_date')
    .lte('trial_start_date', new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000));

    if (Error) {
        console.error('Error fetching users:', Error);
        return;
      }

      for (const user of users || []) {
        await resend.emails.send({
          from: 'no-reply@yourapp.com',
          to: user.email,
          subject: 'Your trial is ending soon!',
          html: `<p>Hello, your trial period is ending in 2 days. If you don't want to be charged, you can cancel your subscription.</p>`,
        });
      }
};
