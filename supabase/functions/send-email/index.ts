// // Import standardowych funkcji HTTP
// const handleRequest = async (req: Request) => {
//   try {
//     const { email, subject, message } = await req.json();

//     // Kod do wysyłania e-maila przez Resend API
//     const response = await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
//       },
//       body: JSON.stringify({
//         from: 'your-email@example.com',
//         to: email,
//         subject: subject,
//         text: message,
//       }),
//     });

//     if (!response.ok) {
//       return new Response('Failed to send email', { status: 500 });
//     }

//     return new Response('Email sent successfully', { status: 200 });
//   } catch (error) {
//     console.error('Error handling request:', error);
//     return new Response('Internal Server Error', { status: 500 });
//   }
// };

// // Eksportuj jako domyślną
// export default handleRequest;
