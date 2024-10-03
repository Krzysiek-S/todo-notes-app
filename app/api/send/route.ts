// app/api/send/route.ts lub pages/api/send.ts

import { Resend } from 'resend';
import { EmailTemplate } from '../../ui/components/email-template'; // Dopasuj ścieżkę do szablonu
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    // Wysyłanie e-maila za pomocą Resend
    const response = await resend.emails.send({
      from: 'your-email@example.com', // Zamień na swój adres e-mail
      to: [email],
      subject: 'Problemy z płatnością',
      react: EmailTemplate({ name }),
    });

    if (response.error) {
      console.error('Error sending email:', response.error);
      return NextResponse.json({ error: response.error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in send-email function:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
