'use client'

import { useNotification } from "@/hooks/useNotification";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { transferSchema } from "@/lib/transferSchema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createTransaction } from "./action";

export function TransferForm({id}: {id: string}) {
const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      to: '',
      amount: 0,
    },
  })
  const {successToast, errorToast} = useNotification();

  async function onSubmit(values: z.infer<typeof transferSchema>) {
    try {
      const res = await createTransaction({...values, type: 'transfer', accountId: id})
      if(res.message) {
        successToast(res.message)
      }
    } catch (e) {
      console.error('Unexpected error:', e);
      errorToast("An unexpected error occurred");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full md:max-w-[500px]">
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IBAN</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter IBAN code who you want to send" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit">Make a Transfer</Button>
      </form>
    </Form>
  )
}