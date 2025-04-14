import * as z from "zod";

export const addressSchema = z.object({

  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number can't be more than 15 digits")
    .optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z
    .string()
    .min(6, "Pincode must be at least 6 characters")
    .max(10, "Pincode can't be more than 10 characters"),
});

export type AddressSchema = z.infer<typeof addressSchema>;
