// components/StartupInfoForm.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { startupInfoSchema, StartupInfoValues } from "@/lib/schema"
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

type StartupInfoFormProps = {
  initialData: Partial<StartupInfoValues>
  onSubmit: (data: StartupInfoValues) => void
}

const industryOptions = INDUSTRIES.map(industry => ({ label: industry, value: industry }))
const verticalOptions = VERTICALS.map(vertical => ({ label: vertical, value: vertical }))

export function StartupInfoForm({ initialData, onSubmit }: StartupInfoFormProps) {
  const form = useForm<StartupInfoValues>({
    resolver: zodResolver(startupInfoSchema),
    defaultValues: {
      companyName: "",
      industries: [],
      verticals: [],
      startupLocation: "",
      startupIntro: "",
      ...initialData,
    },
  })

  const handleSubmit = (data: StartupInfoValues) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="verticals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verticals</FormLabel>
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
        <FormField
          control={form.control}
          name="startupLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Startup Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startupIntro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Startup Intro</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Next: Fundraising Details</Button>
      </form>
    </Form>
  )
}