import { signOut } from "@/auth.ts"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut("discord")
      }}
    >
      <button type="submit">Signin with Discord</button>
    </form>
  )
} 