import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fundraisingSchema = z.object({
  fundAsk: z.number().min(0, "Fund ask must be a positive number"),
  fundingStage: z.string().min(1, "Please select a funding stage"),
  lastFundingAmount: z.number().min(0, "Last funding amount must be a positive number"),
  lastFundingStage: z.string().min(1, "Please select the last funding stage"),
})

type FundraisingFormValues = z.infer<typeof fundraisingSchema>

type FundraisingFormProps = {
  initialData: Partial<FundraisingFormValues>
  onSubmit: (data: FundraisingFormValues) => void
}

const fundingStages = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D+",
  "Bootstrapped",
]

export function FundraisingForm({ initialData, onSubmit }: FundraisingFormProps) {
  const form = useForm<FundraisingFormValues>({
    resolver: zodResolver(fundraisingSchema),
    defaultValues: {
      fundAsk: 0,
      fundingStage: "",
      lastFundingAmount: 0,
      lastFundingStage: "",
      ...initialData,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fundAsk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fund Ask (in millions)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fundingStage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Funding Stage</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a funding stage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fundingStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastFundingAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Funding Amount (in millions)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastFundingStage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Funding Stage</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a funding stage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fundingStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Match Investors</Button>
      </form>
    </Form>
  )
}