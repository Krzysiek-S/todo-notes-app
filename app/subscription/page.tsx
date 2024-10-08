// subscription/page.tsx
"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { signOut } from "next-auth/react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PRICE_ID = "price_1PrQfoHB4zYbZOwNYiBOi7i6"; // Twój price_id z okresami próbnymi ustawionymi w Stripe

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        alert("Failed to initialize Stripe");
        setLoading(false);
        return;
      }

      // Tworzenie sesji Checkout z ustawionym okresem próbnym w planie
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_VERCEL_URL}/api/subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: PRICE_ID,
          }),
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json();
        alert("Failed to create subscription: " + errorResponse.error);
        setLoading(false);
        return;
      }

      const { sessionId } = await res.json();

      if (!sessionId) {
        alert("Failed to create checkout session");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        alert("Payment failed: " + error.message);
      }
    } catch (error) {
      alert("Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r bg-[#FFE0AE] flex flex-col items-center justify-center p-6">
      <div className="bg-[#ffebca] rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Unlock Exclusive Features!
        </h1>
        <p className="text-gray-600 mb-6">
          Upgrade your experience with our premium subscription plan. Enjoy
          unlimited access to all features, priority support, and much more!
        </p>
        <ul className="text-left text-gray-700 mb-8">
          <li className="mb-2 flex items-center">
            <span className="inline-block w-4 h-4 mr-2 rounded-full bg-[#F76201]"></span>
            <span className="font-semibold mr-2">Unlimited Access</span> to all
            features
          </li>
          <li className="mb-2 flex items-center">
            <span className="inline-block w-4 h-4 mr-2 rounded-full bg-[#F76201]"></span>
            <span className="font-semibold mr-2">Priority Support</span> for any
            issues or questions
          </li>
          <li className="mb-2 flex items-center">
            <span className="inline-block w-4 h-4 mr-2 rounded-full bg-[#F76201]"></span>
            <span className="font-semibold mr-2">Early Access</span> to new
            updates and features
          </li>
        </ul>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="inline-block w-full py-3 px-4 mb-4 text-white bg-[#FFA303] hover:bg-[#F76201] rounded-lg font-semibold transition duration-200"
        >
          {loading ? "Loading..." : "Start Your 5-Day Free Trial"}
        </button>
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-500 hover:underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
