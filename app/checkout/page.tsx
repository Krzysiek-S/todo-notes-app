// app/checkout/page.tsx
"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    const session = await response.json();

    await stripe?.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <button onClick={handleCheckout}>Go to Checkout</button>
    </div>
  );
}
