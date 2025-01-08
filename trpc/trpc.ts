import { initTRPC,  TRPCError} from '@trpc/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

const t = initTRPC.create({});
//define a middleware for auth purposes
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  })
})
// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth)