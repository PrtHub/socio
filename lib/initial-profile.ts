import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";


export const initialProfile = async () => {
    const user = await currentUser()

    if(!user) {
        return
    }

    const existingProfile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    })

    if(!existingProfile) {
       const newProfile = await db.profile.create({
           data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            imgUrl: user.imageUrl,
           }
        })

        return newProfile
    } else {
        return existingProfile
    }
}