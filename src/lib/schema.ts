import * as z from "zod"
import { INDUSTRIES, VERTICALS } from '@/lib/constants'

export const urlFormSchema = z.object({
    url: z.string().min(1, "URL is required").refine((value) => {
      console.log('Input value:', value);
      // This regex allows for domain names without protocol or www
      const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
      return domainPattern.test(value);
    }, { message: "Please enter a valid domain name (e.g., example.com)" }),
})

export const startupInfoSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  industries: z.array(z.enum(INDUSTRIES)).min(1, { message: "Select at least one industry" }),
  verticals: z.array(z.enum(VERTICALS)).min(1, { message: "Select at least one vertical" }),
  startupLocation: z.string().min(2, { message: "Please enter a valid location" }),
  startupIntro: z.string().min(10, { message: "Intro must be at least 10 characters" }).max(500, { message: "Intro must not exceed 500 characters" }),
})

export const fundraisingSchema = z.object({
  fundAsk: z.number().nonnegative({ message: "Fund ask must be a non-negative number" }),
  fundingStage: z.enum(["Pre-seed", "Seed", "Series A", "Series B", "Series C", "Series D+"]),
  lastFundingRound: z.object({
    amount: z.number().nonnegative(),
    stage: z.enum(["Bootstrapped", "Pre-seed", "Seed", "Series A", "Series B", "Series C", "Series D+"]),
  }),
})

export type UrlFormValues = z.infer<typeof urlFormSchema>
export type StartupInfoValues = z.infer<typeof startupInfoSchema>
export type FundraisingValues = z.infer<typeof fundraisingSchema>