import type { ReactElement } from "react"
import type { NextPageWithLayout } from "./_app"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

// eslint-disable-next-line
interface Itest {}
const test: NextPageWithLayout<Itest> = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const sesssion = useSession()

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()

    const { data, status } = sesssion

    if (status === "loading") {
        return <p>Loading...</p>
    }
    // if (status === "unauthenticated") {
    // }
    if (!data?.user) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push("/auth")
    }
    return <>Test</>
}

test.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>
}

export default test
