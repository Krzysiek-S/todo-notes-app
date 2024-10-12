import { useState } from "react";

const SubscriptionControls = () => {
  const [loading, setLoading] = useState(false);

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
      });

      if (res.ok) {
        alert("Your subscription has been cancelled.");
      } else {
        alert("Error cancelling subscription");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCancelSubscription} disabled={loading}>
      {loading ? "Cancelling..." : "Cancel Subscription"}
    </button>
  );
};

export default SubscriptionControls;
