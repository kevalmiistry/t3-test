import type { InferGetServerSidePropsType } from "next";
import { useState, type FC } from "react";
// import { api } from "~/utils/api";
import { Form } from "~/components/Form";
import Head from "next/head";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";
import Link from "next/link";

export type TPost = {
    id: string;
    uuid: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

// type HomeProps = {
//     data: TPost[];
// };

export async function getServerSideProps() {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: {
            session: null,
            prisma: prisma,
        },
        transformer: superjson,
    });
    /*
     * Prefetching the `post.byId` query.
     * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
     */
    const data = await helpers.posts.getAllPosts.fetch();
    // Make sure to return { props: { trpcState: helpers.dehydrate() } }
    return {
        props: {
            trpcState: helpers.dehydrate(),
            data: data,
        },
    };
}

const Home = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    // const { data } = await api.posts.getAllPosts.useQuery();
    const [posts, setPosts] = useState<TPost[]>(props.data || []);

    // useEffect(() => {
    //     isFetched && setPosts(data || []);
    // }, [isFetched, data]);

    // if (error) return <p>Oops! something wen wrong :(</p>;

    return (
        <>
            <Head>
                <title>Keval Mistry</title>
                <meta name="description" content="Keval Mistry's App 😎" />
            </Head>
            <main className="flex flex-col items-center">
                {/* <p>{JSON.stringify()}</p> */}
                <Form setPosts={setPosts} />
                {false ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    posts.map((post, idx) => <Post key={idx} {...post} />)
                )}
            </main>
        </>
    );
};

const Post: FC<TPost> = ({
    content,
    createdAt,
    id,
    title,
    // updatedAt,
    // uuid,
}) => (
    <Link href={`/post/${id}`}>
        <div className="mt-4 flex min-w-[300px] flex-col gap-2 rounded-2xl border bg-white p-4 shadow-lg">
            <p>
                <span className="font-bold">Title: </span> {title}
            </p>
            <p>
                <span className="font-bold">Content: </span> {content}
            </p>
            <p>
                Created On:{" "}
                <code>
                    {new Intl.DateTimeFormat("en-US").format(createdAt)}
                </code>
            </p>
        </div>
    </Link>
);

export default Home;
