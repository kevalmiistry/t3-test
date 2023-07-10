import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const postsRouter = createTRPCRouter({
    getAllPosts: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.post.findMany();
        // return ctx.prisma.post.findMany({
        //     orderBy: [
        //         {
        //             updatedAt: "desc",
        //         },
        //     ],
        // });
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

    getOnePost: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input: { id } }) => {
            if (id) {
                await ctx.prisma.post.findUnique({ where: { id } });
            }
        }),
});
