// components/withSubscriptionCheck.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withSubscriptionCheck = (WrappedComponent: React.ComponentType) => {
  return function ComponentWithSubscriptionCheck(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (
        status === "authenticated" &&
        session?.user?.subscription_status !== "active"
      ) {
        // Jeśli subskrypcja nie jest aktywna, przekieruj na stronę informacyjną lub wyświetl komunikat
        router.push("/subscribe"); // Strona informująca o potrzebie aktywnej subskrypcji
      }
    }, [session, status, router]);

    // Jeśli subskrypcja jest aktywna, wyświetl komponent
    return <WrappedComponent {...props} />;
  };
};

export default withSubscriptionCheck;
