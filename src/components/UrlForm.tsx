import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

type UrlFormValues = z.infer<typeof urlSchema>;

type UrlFormProps = {
  onSubmit: (data: UrlFormValues) => void;
  isLoading: boolean;
};

export function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Startup Website URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://yourstartup.com" />
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