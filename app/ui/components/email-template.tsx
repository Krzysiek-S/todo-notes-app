// components/email-template.tsx
import * as React from "react";

interface EmailTemplateProps {
  name: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
}) => (
  <div>
    <h1>Witaj, {name}!</h1>
    <p>
      Twoja ostatnia płatność nie powiodła się. Proszę, zaktualizuj swoje dane
      płatności, aby kontynuować subskrypcję.
    </p>
  </div>
);
