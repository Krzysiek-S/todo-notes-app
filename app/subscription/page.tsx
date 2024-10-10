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
      <div className="bg-[#ffebca] rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Upgrade to Unlock More!
        </h1>
        <p className="text-gray-600 mb-6">
          Experience our to-do list app in its full potential with a premium
          subscription. Enjoy a smooth, ad-free interface designed for comfort
          and focus. With your support, we can continue enhancing features, all
          while keeping things simple and distraction-free.
        </p>

        <ul className="flex flex-col justify-center items-center text-gray-700 mb-8">
          <li className="mb-2">
            <div className="flex justify-center items-center">
              <span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#F76201]"></span>
              <span className="font-semibold mr-2">Ad-Free Experience</span>
              <span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#F76201]"></span>
            </div>
            <p>Stay focused with zero interruptions.</p>
          </li>
          <div className="border border-gray-400 border-dotted w-[60px] mb-2"></div>
          <li className="mb-2">
            <div className="flex justify-center items-center">
              <span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#F76201]"></span>
              <span className="font-semibold mr-2">Minimalist Design</span>
              <span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#F76201]"></span>
            </div>
            <p>
              A clean, calming layout that lets you concentrate on what matters.
            </p>
          </li>
          <div className="border border-gray-400 border-dotted w-[60px] mb-2"></div>
          <li className="mb-2">
            <div className="flex justify-center items-center">
              <span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#F76201]"></span>
              <span className="font-semibold mr-2">Ongoing Development</span>
              <span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#F76201]"></span>
            </div>
            <p>
              Your subscription fuels future updates and improvements, bringing
              exciting new features.
            </p>
          </li>
          <div className="border border-gray-400 border-dotted w-[60px] mb-2"></div>
          <li className="mb-2 flex justify-center items-center">
            <span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#F76201]"></span>
            <span className="font-semibold mr-2">Priority Support</span>
            <span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#F76201]"></span>
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
