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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { MultiSelect } from "@/components/MultiSelect"
import { fundraisingSchema } from "@/lib/schema"

type FundraisingFormValues = z.infer<typeof fundraisingSchema>

type FundraisingFormProps = {
  initialData: Partial<FundraisingFormValues>
  onSubmit: (data: FundraisingFormValues) => void
  onNext: () => void
  onBack: () => void
}

const targetFundingStageOptions = [
  "Seed",
  "Series A",
  "Beyond A"
].map(stage => ({ label: stage, value: stage }))

const lastFundingStageOptions = [
  "Bootstrapped",
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D+",
]

const targetLocationOptions = [
  { label: "US", value: "US" },
  { label: "UK", value: "UK" },
  { label: "Europe", value: "Europe" },
  { label: "Canada", value: "Canada" },
  { label: "Germany", value: "Germany" },
  { label: "UAE", value: "UAE" },
  { label: "India", value: "India" },
]

const targetInvestorOptions = [
  { label: "Venture Capital", value: "Venture Capital" },
  { label: "Corporate Venture Capital", value: "Corporate Venture Capital" },
  { label: "Angel Investor", value: "Angel Investor" },
  { label: "Family Office", value: "Family Office" },
]

export function FundraisingForm({ initialData, onSubmit, onNext, onBack }: FundraisingFormProps) {
  const form = useForm<FundraisingFormValues>({
    resolver: zodResolver(fundraisingSchema),
    defaultValues: {
      fundAsk: 0,
      targetFundingStages: [],
      lastFundingAmount: 0,
      lastFundingStage: "Bootstrapped",
      targetLocations: [],
      targetInvestors: [],
      ...initialData,
    },
  })

  const handleSubmit = (data: FundraisingFormValues) => {
    if (
      data.targetFundingStages.length > 0 &&
      data.targetLocations.length > 0 &&
      data.targetInvestors.length > 0
    ) {
      onSubmit(data)
      onNext()
    } else {
      // Trigger validation for all required fields
      form.trigger(["targetFundingStages", "targetLocations", "targetInvestors"])
    }
  }

  return (
    <div className="w-full max-w-[900px] mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Fundraising Details</CardTitle>
          <CardDescription>Enter your fundraising details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
              <FormField
                  control={form.control}
                  name="fundAsk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fund Ask (million $)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastFundingAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Funding Amount (million $)</FormLabel>
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
                          {lastFundingStageOptions.map((stage) => (
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
                  name="targetFundingStages"
                  rules={{ required: "Target Funding Stages are required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Funding Stages (Required)</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={targetFundingStageOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select target funding stages"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetLocations"
                  rules={{ required: "Target Locations are required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Locations (Required)</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={targetLocationOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select target locations"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetInvestors"
                  rules={{ required: "Target Investors are required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Investors (Required)</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={targetInvestorOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select target investors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="flex justify-between mt-4">
        <Button 
          onClick={onBack} 
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Startup Info</span>
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)}
          className="flex items-center space-x-2"
        >
          <span>Match Investors</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}