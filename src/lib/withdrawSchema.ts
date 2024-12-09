import { z } from "zod";

export const withdrawSchema = z.object({
  amount: z.number({
    invalid_type_error: "Amount must be a number.",
  })
  .positive("Amount must be a positive number.")
  .min(0.01, "Amount must be at least 0.01."),
})