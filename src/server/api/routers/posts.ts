import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc"
import { z } from "zod"

export const postsRouter = createTRPCRouter({
    getAllPosts: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.post.findMany({
            orderBy: [
                {
                    updatedAt: "desc",
                },
            ],
        })
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
            })
        }),

    getOnePost: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input: { id } }) => {
            if (id) {
                return await ctx.prisma.post.findUnique({ where: { id } })
            } else {
                throw Error("Not found")
            }
        }),
})
