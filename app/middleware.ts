// // middleware.ts
// import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { AuthOptions } from "@/app/api/auth/[...nextauth]/route";
// import { CreateSupabaseClient } from './utils/supabaseClient';

// export async function middleware(req: NextRequest) {
//   const session = await getServerSession(AuthOptions);

//   if (!session || !session.user || !session.user.id) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   const supabase = CreateSupabaseClient(session.supabaseAccessToken);

//   const { data: user, error } = await supabase
//     .from('users')
//     .select('subscription_status')
//     .eq('id', session.user.id)
//     .single();

//   if (error || user?.subscription_status !== 'active') {
//     return NextResponse.redirect(new URL('/subscription-required', req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/premium/*'], // Aplikuj middleware tylko do ścieżek premium
// };
