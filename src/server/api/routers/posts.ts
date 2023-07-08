import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const postsRouter = createTRPCRouter({
    getAllPosts: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.post.findMany({
            orderBy: [
                {
                    updatedAt: "desc",
                },
            ],
        });
    }),
    createPost: publicProcedure
        .input(
            z.object({
                title: z.string(),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.post.create({
                data: input,
            });
        }),
});
