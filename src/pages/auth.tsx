import { signIn } from "next-auth/react"
import type { FC } from "react"

// type TProp = {
// }
const auth: FC = () => {
    return (
        <main className="flex h-[100vh] items-center justify-center">
            <button
                id="google-login"
                className="rounded-xl bg-black p-3 text-center font-semibold text-white"
                onClick={() => void signIn("google", { callbackUrl: "/" })}
            >
                Login with Google
            </button>
        </main>
    )
}

export default auth
