import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { urlFormSchema, UrlFormValues } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

type UrlFormProps = {
  onSubmit: (data: UrlFormValues) => void;
  isLoading: boolean;
  onNext: () => void;
};

export function UrlForm({ onSubmit, isLoading, onNext }: UrlFormProps) {
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
    <div className="w-[600px] max-w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Investor Matchmaker</CardTitle>
          <CardDescription>Enter your startup&apos;s website to get started</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          variant="outline"
          className="flex items-center space-x-2"
        >
          <span>Next: Startup Info</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}