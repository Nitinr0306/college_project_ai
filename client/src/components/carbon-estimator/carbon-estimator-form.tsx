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
                  <FormControl>
                    <Input
                      placeholder="https://yourwebsite.com"
                      {...field}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    />
                  </FormControl>
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
            
            {/* Calculate Button with increased prominence */}
            <div className="mt-10">
              <div className="p-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-xl">
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 text-white text-lg font-bold rounded-lg py-5 hover:bg-green-700 shadow-lg transition-all transform hover:scale-[1.02]"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Analyzing Website Carbon Footprint...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="animate-bounce-slow mr-2">🌱</span>
                      CALCULATE CARBON FOOTPRINT
                      <span className="animate-bounce-slow ml-2">🌱</span>
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Get detailed insights about your website's environmental impact</p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
