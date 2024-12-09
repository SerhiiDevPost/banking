'use server'
import { depositSchema } from "@/lib/depositSchema";
import { generateAccountNumber } from "@/lib/generateCount";
import db from "@/lib/prisma";
import { cookies } from "next/headers";
import { z } from "zod";

export const createDeposit = async (values: z.infer<typeof depositSchema>) => {
  const cookieStore = await cookies()
  try{ 
    const accountId = cookieStore.get('id')
    if(!accountId) {
      const countryCode = 'UA'; // Country code
      const bankCode = '10020030'; // Bank code
      const accountNumber = generateAccountNumber(10); // Account code
      const iban = `${countryCode}${bankCode}${accountNumber}`;
      const newUser = await db.account.create({
        data: {
          iban: iban,
          balance: values.amount
        }
      });
        
      await db.transaction.create({
        data: {
          type: 'deposit',
          rest: values.amount,
          amount: values.amount,
          accountId: newUser.id,
        },
      })

      if(newUser) {
        cookieStore.set("IBAN", newUser.iban)
        cookieStore.set("id", newUser.id)
        return {status: 200, message: "Account successfully created!"}
      }      
    } else {
      const existedUser = await db.account.findUnique({
        where: {
          id: accountId?.value
        }
      })
      const updatedUser = await db.account.update({
        where: {
          id: accountId?.value
        }, 
        data: {
          balance: existedUser?.balance! + values.amount
        }
      })
      const rest = updatedUser.balance === 0 ? updatedUser.balance : values.amount

      await db.transaction.create({
        data: {
          type: 'deposit',
          rest: rest,
          amount: values.amount,
          accountId: updatedUser.id,
        },
      })
      return {status: 200, message: "Deposit is made successfully!"}
    }
  } catch(e) {
    console.log(e)
    return {status: 500, message: "Internal server error"}
  }
}