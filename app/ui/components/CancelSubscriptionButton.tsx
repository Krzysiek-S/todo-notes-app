"use client";

import { useState } from "react";

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const cancelSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Subskrypcja została anulowana.");
      } else {
        setMessage(`Błąd: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Wystąpił problem: ${(error as Error).message}`);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={cancelSubscription} disabled={loading}>
        {loading ? "Anulowanie..." : "Anuluj subskrypcję"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
