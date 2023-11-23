import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import type { AppType, AppProps } from "next/app"
import { api } from "~/utils/api"
import "~/styles/globals.css"
import type { NextPage } from "next"
import type { ReactElement, ReactNode } from "react"
import SidebarAndProfile from "~/components/SidebarAndProfile"

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppType &
    AppProps<{ session: Session | null }> & {
        Component: NextPageWithLayout
    }

const MyApp = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
    const getLayout =
        Component.getLayout ??
        ((page) => (
            <SessionProvider session={session}>
                <SidebarAndProfile>{page}</SidebarAndProfile>
            </SessionProvider>
        ))

    return getLayout(
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default api.withTRPC(MyApp)
