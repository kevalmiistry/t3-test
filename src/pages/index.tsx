import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { getServerAuthSession } from "~/server/auth"
import { formatDistance } from "date-fns"
import { appRouter } from "~/server/api/root"
import { useState, type FC } from "react"
import { TRPCError } from "@trpc/server"
import { prisma } from "~/server/db"
import { Form } from "~/components/Form"
import superjson from "superjson"
import Head from "next/head"
import Link from "next/link"

export type TPost = {
    id: string
    uuid: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getServerAuthSession(context)

    // if (!session?.user) {
    //     return {
    //         redirect: {
    //             destination: "/login",
    //             permanent: false,
    //         },
    //     }
    // }

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: {
            session: session,
            prisma: prisma,
        },
        transformer: superjson,
    })

    try {
        const data = await helpers.posts.getAllPosts.fetch()

        const finalDataProps = data.map((data) => ({
            ...data,
            createdAt: formatDistance(new Date(data.createdAt), new Date()),
            updatedAt: formatDistance(new Date(data.updatedAt), new Date()),
        }))

        return {
            props: {
                trpcState: helpers.dehydrate(),
                data: finalDataProps,
            },
        }
    } catch (error) {
        if (error instanceof TRPCError) {
            if (error?.code === "UNAUTHORIZED") {
                return {
                    redirect: {
                        destination: "/auth",
                        permanent: false,
                    },
                }
            }
        }
    }
}

const Home = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const [posts, setPosts] = useState<TPost[]>(props.data || [])
    const { data: session } = useSession()

    return (
        <>
            <Head>
                <title>Keval Mistry</title>
                <meta name="description" content="Keval Mistry's App 😎" />
            </Head>
            <main className="flex flex-col items-center">
                {session ? (
                    <button onClick={() => void signOut()}>Sign Out</button>
                ) : (
                    <button onClick={() => void signIn("google")}>
                        Sign In
                    </button>
                )}
                <Form setPosts={setPosts} />
                {false ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    posts.map((post, idx) => <Post key={idx} {...post} />)
                )}
            </main>
        </>
    )
}

const Post: FC<TPost> = ({ content, createdAt, id, title }) => (
    <Link href={`/post/${id}`}>
        <div className="mt-4 flex min-w-[300px] flex-col gap-2 rounded-2xl border bg-white p-4 shadow-lg">
            <p>
                <span className="font-bold">Title: </span> {title}
            </p>
            <p>
                <span className="font-bold">Content: </span> {content}
            </p>
            <p>
                Created On: <code>{createdAt}</code>
            </p>
        </div>
    </Link>
)

export default Home
