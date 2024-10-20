// app/api/subscription/start-trial/route.ts
import { NextResponse } from "next/server";
import { CreateSupabaseClient } from "../../../utils/supabaseClient";
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/lib/auth';

export async function POST(req: Request) {
    const session = await getServerSession(AuthOptions);
    if (!session || !session.user || !session.user.id) {
      console.log("Unauthorized access attempt.");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  try {
    const { userId, trialEndDate } = await req.json();
    console.log("Received data:", { userId, trialEndDate });

    if (!userId || !trialEndDate) {
      console.log("Missing required fields:", { userId, trialEndDate });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = CreateSupabaseClient(session.supabaseAccessToken);

    // Zapisanie daty zakończenia okresu próbnego w bazie danych
    const { data, error } = await supabase
      .from("users")
      .update({ trial_end_date: trialEndDate, subscription_status: 'trial'})
      .eq("id", userId);

    if (error) {
      console.log("Database error:", error.message);
      return NextResponse.json({ error: "Failed to start trial period" }, { status: 500 });
    }
    console.log("Trial period started successfully for user:", userId);
    return NextResponse.json({ message: "Trial period started successfully" }, { status: 200 });
  } catch (err) {
    console.log("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
