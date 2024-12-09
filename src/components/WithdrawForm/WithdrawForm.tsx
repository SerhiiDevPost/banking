'use client'
import { useNotification } from "@/hooks/useNotification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { withdrawSchema } from "@/lib/withdrawSchema";
import { createWithdraw } from "./action";

export function WithdrawForm() {
  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
    },
  })
  const {successToast, errorToast} = useNotification();

  async function onSubmit(values: z.infer<typeof withdrawSchema>) {
    try {
      const res = await createWithdraw(values)
      if(res?.status === 201) {
        successToast(res.message)
        form.reset();
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
        <Button type="submit">Withdraw</Button>
      </form>
    </Form>
  )
}