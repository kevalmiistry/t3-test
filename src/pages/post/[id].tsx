import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { formatDistance } from "date-fns";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { type TPost } from "..";
import { type FC } from "react";
import superjson from "superjson";
import Head from "next/head";
// import { api } from "~/utils/api";

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
    const data = await helpers.posts.getOnePost.fetch({
        id: id,
    });

    const finalDataProps =
        data !== null
            ? {
                  ...data,
                  createdAt: formatDistance(
                      new Date(data.createdAt),
                      new Date()
                  ),
                  updatedAt: formatDistance(
                      new Date(data.updatedAt),
                      new Date()
                  ),
              }
            : null;
    return {
        props: {
            trpcState: helpers.dehydrate(),
            data: finalDataProps,
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
                <meta
                    property="og:image"
                    content={`http://localhost:3000/api/og?title=${
                        data?.title || "N/A"
                    }&content=${data?.content || "N/A"}&date=${
                        data?.createdAt || "N/A"
                    }`}
                />
            </Head>
            <main className="flex flex-col items-center">
                {data && <Post key={data.id} {...data} />}
            </main>
        </>
    );
};

type TOnePost = Partial<TPost>;
const Post: FC<TOnePost> = ({ content, createdAt, title }) => (
    <div className="mt-4 flex min-w-[300px] flex-col gap-2 rounded-2xl border bg-white p-4 shadow-lg">
        <p>
            <span className="font-bold">Title: </span> {title}
        </p>
        <p>
            <span className="font-bold">Content: </span> {content}
        </p>
        <p>
            Created On:
            <code>{createdAt}</code>
        </p>
    </div>
);

export default PostView;
