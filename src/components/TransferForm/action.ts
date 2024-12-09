'use server'
import { transferSchema } from "@/lib/transferSchema";
import { revalidateTag } from "next/cache";
import { z } from "zod";

type Props = {
type: string;
accountId: string;
} & z.infer<typeof transferSchema>

export const createTransaction = async (data: Props) => {
  const res = await fetch(`${process.env.BASE_URL}/api/transfer`, {
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  revalidateTag('balance')
  return res.json()
}