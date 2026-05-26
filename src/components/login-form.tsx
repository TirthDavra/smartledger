
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/schemas/auth.schema";
type FormData = z.infer<typeof loginSchema>;

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function LoginForm({
  ...props
}: React.ComponentProps<typeof Card>) {

  const [error, setError] = useState("");

  const route = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        setError(response.error);
        toast.error(response.error || "Invalid email or password");
        return;
      }

      setError("");
      toast.success("Logged in successfully");
      route.push("/dashboard");
    } catch {
      toast.error("Could not sign in. Please try again.");
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isSubmitting}
              />
              <FieldError errors={errors.email ? [errors.email] : undefined} />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
              </div>
              <Input
                {...register("password")}
                id="password"
                type="password"
                required
                disabled={isSubmitting}
              />
              <FieldError errors={errors.password ? [errors.password] : undefined} />
            </Field>
            <Field>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/register">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
