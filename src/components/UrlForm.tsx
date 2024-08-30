import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { urlFormSchema, UrlFormValues } from "@/lib/schema";

type UrlFormProps = {
  onSubmit: (data: UrlFormValues) => void;
  isLoading: boolean;
};

export function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleSubmit = (data: UrlFormValues) => {
    console.log("Submitting URL:", data.url);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Startup Website URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}