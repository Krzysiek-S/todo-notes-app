import { NextApiRequest, NextApiResponse } from 'next';
import { CreateSupabaseClient } from '../../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            console.log("405 Error: Incorrect HTTP method");
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        const { userId, trialEndDate, supabaseAccessToken } = req.body;
        if (!userId || !trialEndDate || !supabaseAccessToken) {
            console.log("400 Error: Missing userId, trialEndDate, or supabaseAccessToken", { userId, trialEndDate, supabaseAccessToken });
            return res.status(400).json({ message: 'Bad Request: Missing required fields' });
        }

        console.log("Starting trial for user:", userId, "with end date:", trialEndDate);

        // Tworzenie klienta Supabase z tokenem dostępu
        const supabase = CreateSupabaseClient(supabaseAccessToken);

        const { data, error } = await supabase
            .from('subscriptions')
            .update({ trial_end: trialEndDate })
            .eq('user_id', userId);

        if (error) {
            console.error("Database update error:", error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }

        res.status(200).json({ message: 'Trial started successfully', data });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: 'Internal Server Error', error:( err as Error).message });
    }
}
