// app/api/subscription/start-trial/route.ts
import { NextResponse } from "next/server";
import { CreateSupabaseClient } from "../../../utils/supabaseClient";
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/lib/auth';

export async function POST(req: Request) {
    const session = await getServerSession(AuthOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  try {
    const { userId, trialEndDate } = await req.json();
    

    if (!userId || !trialEndDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = CreateSupabaseClient(session.supabaseAccessToken);

    // Zapisanie daty zakończenia okresu próbnego w bazie danych
    const { data, error } = await supabase
      .from("users")
      .update({ trial_end_date: trialEndDate })
      .eq("id", userId);

    if (error) {
      return NextResponse.json({ error: "Failed to start trial period" }, { status: 500 });
    }

    return NextResponse.json({ message: "Trial period started successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
