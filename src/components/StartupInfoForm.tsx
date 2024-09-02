// components/StartupInfoForm.tsx
import { useForm } from "react-hook-form"
import { countries } from 'countries-list' // Import countries list
import { StartupInfoValues } from "@/lib/schema" // Update this import as needed
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
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/MultiSelect"
import { INDUSTRIES, VERTICALS } from '@/lib/constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"

type StartupInfoFormProps = {
  initialData: Partial<StartupInfoValues>
  onSubmit: (data: StartupInfoValues) => void
  onNext: () => void
  onBack: () => void
}

const industryOptions = INDUSTRIES.map(industry => ({ label: industry, value: industry }))
const verticalOptions = VERTICALS.map(vertical => ({ label: vertical, value: vertical }))

const countryOptions = Object.entries(countries).map(([code, country]) => ({
  label: country.name,
  value: code,
}))

export function StartupInfoForm({ initialData, onSubmit, onNext, onBack }: StartupInfoFormProps) {
  const form = useForm<StartupInfoValues>({
    defaultValues: {
      companyName: "",
      industries: [],
      verticals: [],
      startupLocation: [],
      startupIntro: "",
      ...initialData,
    },
  })

  const handleSubmit = (data: StartupInfoValues) => {
    if (data.verticals.length > 0) {
      onSubmit(data)
      onNext()
    } else {
      // Trigger validation for required fields
      form.trigger(["verticals"])
    }
  }

  return (
    <div className="w-full max-w-[900px] mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Startup Details</CardTitle>
          <CardDescription>Review and edit your startup&apos;s information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startupLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Startup Locations</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={countryOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select countries"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industries</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={industryOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select industries"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="verticals"
                  rules={{ required: "Verticals are required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verticals (Required)</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={verticalOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select verticals"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="startupIntro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-20" />
                    </FormControl>
                  </FormItem>
                )}
              />
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
          <span>URL Input</span>
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)}
          className="flex items-center space-x-2"
        >
          <span>Fundraising Details</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}