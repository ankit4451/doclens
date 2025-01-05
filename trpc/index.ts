import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    getUser : publicProcedure.query( () => {
        return "Ankit"
    }),
});

export type AppRouter = typeof appRouter;