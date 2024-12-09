'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import {Input} from '../ui/input'
import { useNotification } from "@/hooks/useNotification"
import { Button } from "../ui/button"
import { depositSchema } from "@/lib/depositSchema"
import { useRouter } from "next/navigation"
import { createDeposit } from "./action"

export function DepositForm () {
  const form = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
    },
  })
  const {successToast, errorToast} = useNotification();
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof depositSchema>) {
    try {
      const res = await createDeposit(values)
      if(res?.status === 200) {
        successToast('Successfully')
        form.reset();
        router.push('/transfer')
      }
    } catch (error) {
      errorToast('Something went wrong')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full md:max-w-[500px]">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter amount" 
                  type="number"
                  step='0.01' 
                  {...field}
                  onChange={(e) => {
                    if(e.target.value === "") {
                      field.onChange(e.target.value)
                    } else {
                      form.clearErrors()
                      field.onChange(parseFloat(e.target.value))}
                    }
                  }
                   />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Make a Deposit</Button>
      </form>
    </Form>
  )
}