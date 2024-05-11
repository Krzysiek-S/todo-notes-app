import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import Todos from "../ui/components/todos/todos";

export default function NavBar() {
  return (
    <>
      <SignedIn>
        <Todos />
        <UserButton />
      </SignedIn>
    </>
  );
}
