import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

// Define schema for form validation
const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  hostingProvider: z.string().min(1, { message: "Please select a hosting provider" }),
  monthlyTraffic: z.string().min(1, { message: "Please select a monthly traffic range" }),
});

// Hosting providers
const hostingProviders = [
  "Green Hosting Co.",
  "AWS",
  "Google Cloud",
  "Azure",
  "Digital Ocean",
  "Linode",
  "GoDaddy",
  "Other",
];

// Traffic ranges
const trafficRanges = [
  "1-1,000 visitors",
  "1,001-10,000 visitors",
  "10,001-100,000 visitors",
  "100,001+ visitors",
];

type FormValues = z.infer<typeof formSchema>;

type CarbonEstimatorFormProps = {
  onAnalyze: (data: FormValues) => void;
  isLoading: boolean;
};

export default function CarbonEstimatorForm({ onAnalyze, isLoading }: CarbonEstimatorFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      hostingProvider: "",
      monthlyTraffic: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    onAnalyze(data);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Website Carbon Estimator</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input
                        placeholder="https://yourwebsite.com"
                        {...field}
                        className="flex-1 px-4 py-2 border border-neutral-300 rounded-l-lg"
                      />
                    </FormControl>
                    <Button 
                      type="submit" 
                      className="bg-primary-600 text-white rounded-r-lg hover:bg-primary-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Analyze"
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hostingProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hosting Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hostingProviders.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyTraffic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Traffic</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trafficRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
