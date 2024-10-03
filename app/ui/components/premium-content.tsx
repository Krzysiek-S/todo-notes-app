// pages/premium-content.tsx
import withSubscriptionCheck from "../components/withSubscriptionCheck";

function PremiumContent() {
  return (
    <div>
      <h1>Premium Content</h1>
      <p>This content is only available to active subscribers.</p>
    </div>
  );
}

export default withSubscriptionCheck(PremiumContent);
