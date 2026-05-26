"use client"


import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { getClientErrorMessage } from "@/lib/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/schemas/auth.schema";
import { registerUser } from "@/actions/auth.actions";
type FormData = z.infer<typeof registerSchema>;

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
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

    const route = useRouter();
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerUser(data);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success || "Account created successfully");
        route.push("/login");
      }
    } catch (error) {
      toast.error(
        getClientErrorMessage(error, "Could not create account. Please try again.")
      );
    }
  };

  return (
    <Card {...props} className="">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <FieldContent>
                <Input
                  {...register("name")}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                />
              </FieldContent>
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isSubmitting}
                />
              </FieldContent>
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
              <FieldError errors={errors.email ? [errors.email] : undefined} />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <FieldContent>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  required
                  disabled={isSubmitting}
                />
              </FieldContent>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
              <FieldError errors={errors.password ? [errors.password] : undefined} />
            </Field>

            <div className="flex flex-col gap-3 pt-3">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account? <Link className="text-primary underline" href="/login">Sign in</Link>
              </p>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
