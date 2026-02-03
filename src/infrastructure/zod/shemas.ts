import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  amount: z
    .number({ error: "Amount must be a number" })
    .int("Amount must be an integer")
    .positive("Amount must be greater than 0")
    .max(999999, "Amount is too big"),

  orderId: z
    .string({ error: "Order ID is required" })
    .min(1, "Order ID is required"),

  customerEmail: z.email("Invalid email format").max(255, "Email is too long"),

  customerName: z
    .string({ error: "Name is required" })
    .min(1, "Name is required")
    .max(100, "Name is too long"),
});

export type CreatePaymentIntentDTO = z.infer<typeof createPaymentIntentSchema>;
