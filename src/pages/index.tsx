import type { NextPage } from "next";
import { useState, type FC, useEffect } from "react";
import { api } from "~/utils/api";
import { Form } from "~/components/Form";
import Head from "next/head";

export type TPost = {
    id: string;
    uuid: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

type HomeProps = {
    // data: TPost[];
};
const Home: NextPage<HomeProps> = () => {
    const { data, error, isLoading, isFetched } =
        api.posts.getAllPosts.useQuery();
    const [posts, setPosts] = useState<TPost[]>([]);

    useEffect(() => {
        isFetched && setPosts(data || []);
    }, [isFetched, data]);

    if (error) return <p>Oops! something wen wrong :(</p>;

    return (
        <>
            <Head>
                <title>Keval Mistry</title>
                <meta name="description" content="Keval Mistry's App 😎" />
            </Head>
            <main className="flex flex-col items-center">
                <Form setPosts={setPosts} />
                {isLoading ? (
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
    // id,
    title,
    // updatedAt,
    // uuid,
}) => (
    <div className="mt-4 flex min-w-[300px] flex-col gap-2 rounded-2xl border bg-white p-4 shadow-lg">
        <p>
            <span className="font-bold">Title: </span> {title}
        </p>
        <p>
            <span className="font-bold">Content: </span> {content}
        </p>
        <p>
            Created On:{" "}
            <code>{new Intl.DateTimeFormat("en-US").format(createdAt)}</code>
        </p>
    </div>
);

export default Home;
