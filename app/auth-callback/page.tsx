"use client"
import { trpc } from "../_trpc/client"

const Page = () => {

    const user =  trpc.getUser.useQuery()

    return (
        <div>
            <p>{JSON.stringify(user.data)}</p>
        </div>
    )
}

export default Page