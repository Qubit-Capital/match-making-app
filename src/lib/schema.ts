import * as z from "zod"
import { INDUSTRIES, VERTICALS, LOCATIONS } from '@/lib/constants'

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
  startupLocation: z.array(z.enum(LOCATIONS)).min(1, { message: "Select at least one location" }),
  startupIntro: z.string().min(10, { message: "Intro must be at least 10 characters" }).max(1000, { message: "Intro must not exceed 1000 characters" }),
})

export const fundraisingSchema = z.object({
  fundAsk: z.number().nonnegative({ message: "Fund ask must be a non-negative number" }),
  targetFundingStages: z.array(z.enum(["Pre-seed", "Seed", "Series A", "Beyond A"])).min(1, { message: "Select at least one target funding stage" }),
  lastFundingAmount: z.number().nonnegative({ message: "Last funding amount must be a non-negative number" }),
  lastFundingStage: z.enum(["Bootstrapped", "Pre-seed", "Seed", "Series A", "Series B", "Series C", "Series D+"]).optional(),
  targetLocations: z.array(z.enum(LOCATIONS)).min(1, { message: "Select at least one location" }),
  targetInvestors: z.array(z.enum(["Venture Capital", "Corporate Venture Capital", "Angel Investor", "Family Office"])).min(1, { message: "Select at least one target investor" })
})
export type UrlFormValues = z.infer<typeof urlFormSchema>
export type StartupInfoValues = z.infer<typeof startupInfoSchema>
export type FundraisingValues = z.infer<typeof fundraisingSchema>