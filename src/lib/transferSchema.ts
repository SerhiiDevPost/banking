import { z } from "zod";
import IBAN from 'iban'

export const transferSchema = z.object({
  to: z.string().refine(IBAN.isValid, {message: 'Invalid IBAN'}),
  amount: z.number({
    invalid_type_error: "Amount must be a number.",
  })
  .positive("Amount must be a positive number.")
  .min(0.01, "Amount must be at least 0.01."),
})

export const bodyTransferSchema = transferSchema.extend({
  accountId: z.string().uuid("Account ID must be a valid UUID."),
  type: z.enum(["transfer", "withdrawal", "deposit"], {message: "Invalid type."}),
});