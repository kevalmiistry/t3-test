import type { NextPage } from "next"
import { signIn } from "next-auth/react"

const unauthorized: NextPage = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <p className="text-center">{"God Damn!!! You're unauthorized"}</p>
            <button onClick={() => void signIn("google", { callbackUrl: "/" })}>
                Sign In
            </button>
        </div>
    )
}

export default unauthorized
