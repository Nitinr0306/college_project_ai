import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm({ onToggleForm }: { onToggleForm: () => void }) {
  const { loginMutation } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginMutation.mutateAsync({
      username: data.username,
      password: data.password,
    });
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // This would typically redirect to Google OAuth
    // For now, we'll just show a toast message
    setTimeout(() => {
      setIsGoogleLoading(false);
    }, 2000);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Sign in to GreenWeb</h2>
        <p className="text-neutral-600">Access your sustainability dashboard and tools</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your username" 
                    {...field} 
                    className="px-4 py-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    {...field} 
                    className="px-4 py-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember me</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-lg shadow-sm text-neutral-700 hover:bg-neutral-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.05 5.05 0 0 1-2.2 3.34v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.12z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77a7.08 7.08 0 0 1-3.72 1.07 7.01 7.01 0 0 1-6.6-4.92H1.8v2.86A11.99 11.99 0 0 0 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.4 13.72a7.1 7.1 0 0 1 0-4.52V6.34H1.8a11.99 11.99 0 0 0 0 10.76l3.6-3.38z"
              />
              <path
                fill="#EA4335"
                d="M12 5.36c1.62 0 3.06.56 4.2 1.66l3.14-3.15A10.56 10.56 0 0 0 12 0 11.93 11.93 0 0 0 1.8 6.34l3.6 3.38A7.02 7.02 0 0 1 12 5.36z"
              />
            </svg>
            {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-neutral-600">
        Don't have an account?{" "}
        <button
          onClick={onToggleForm}
          className="text-primary-600 font-medium hover:text-primary-700"
        >
          Sign up for free
        </button>
      </div>
    </div>
  );
}
