import { type InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { formatDistance } from "date-fns";
import { appRouter } from "~/server/api/root";
import { useState, type FC } from "react";
import { prisma } from "~/server/db";
import { Form } from "~/components/Form";
import superjson from "superjson";
import Head from "next/head";
import Link from "next/link";
// import { api } from "~/utils/api";

export type TPost = {
    id: string;
    uuid: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export const getServerSideProps = async () => {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: {
            session: null,
            prisma: prisma,
        },
        transformer: superjson,
    });

    const data = await helpers.posts.getAllPosts.fetch();

    const finalDataProps = data.map((data) => ({
        ...data,
        createdAt: formatDistance(new Date(data.createdAt), new Date()),
        updatedAt: formatDistance(new Date(data.updatedAt), new Date()),
    }));

    return {
        props: {
            trpcState: helpers.dehydrate(),
            data: finalDataProps,
        },
    };
};

const Home = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const [posts, setPosts] = useState<TPost[]>(props.data || []);

    return (
        <>
            <Head>
                <title>Keval Mistry</title>
                <meta name="description" content="Keval Mistry's App 😎" />
            </Head>
            <main className="flex flex-col items-center">
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
);

export default Home;
