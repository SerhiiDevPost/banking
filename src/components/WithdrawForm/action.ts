'use server'

import db from "@/lib/prisma"
import { withdrawSchema } from "@/lib/withdrawSchema"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { z } from "zod"

export const createWithdraw = async (value: z.infer<typeof withdrawSchema>) => {
  const cookieStore = await cookies()
  try {
    const accountId = cookieStore.get('id')
    const existedUser = await db.account.findUnique({
      where: {
        id: accountId?.value
      }
    })
    if(!existedUser) {
      return {status: 400, message: 'User does not exist.'}
    }
    if(existedUser.balance < value.amount) {
      return {status: 400, message: 'You do not have enough money'}
    }
    const rest = existedUser.balance - value.amount
    const [updatedUser] = await db.$transaction([
      db.account.update({
        where: {
          id: accountId?.value
        },
        data: {
          balance: rest
        }
      }),
      db.transaction.create({
        data: {
          accountId: existedUser.id,
          rest: rest,
          amount: value.amount,
          type: 'withdraw'
        }
      })
    ])
    revalidateTag('balance')
    return {status: 201, message: `Successfully withdraw money, your balance ${updatedUser.balance}`}
  } catch (e) {
    console.log(e)
    return {status: 500, message: "Internal server error"}
  }
}