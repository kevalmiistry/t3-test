import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import { type FC } from "react";
// import { api } from "~/utils/api";
import Head from "next/head";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";
import type { TPost } from "..";

export async function getServerSideProps(
    context: GetServerSidePropsContext<{ id: string }>
) {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: {
            session: null,
            prisma: prisma,
        },
        transformer: superjson,
    });
    const id = context.params?.id as string;
    // console.log(id);

    const data = await helpers.posts.getOnePost.fetch({
        id: id,
        // id: "clju2de120002i3o4zfrnduhp",
    });

    const newD =
        data !== null
            ? {
                  id: data.id,
                  uuid: data.uuid,
                  title: data.title,
                  content: data.content,
                  //   createdAt: data.createdAt.toString(),
              }
            : null;
    return {
        props: {
            trpcState: helpers.dehydrate(),
            data: newD,
        },
    };
}

const PostView = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const { data } = props;

    return (
        <>
            <Head>
                <title>Keval Mistry</title>
                <meta name="description" content="Keval Mistry's App 😎" />
            </Head>
            <main className="flex flex-col items-center">
                {data && <Post key={data.id} {...data} />}
            </main>
        </>
    );
};

type TOnePost = Partial<TPost>;
const Post: FC<TOnePost> = ({
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

export default PostView;
