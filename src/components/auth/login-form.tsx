"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

const schema = z.object({
  pin: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 8, "Enter your 8-digit PIN"),
});

type Values = z.infer<typeof schema>;

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { pin: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: Values) => {
    setSubmitting(true);
    try {
      await login(values.pin);
      if (next && next.startsWith("/") && !next.startsWith("//")) {
        router.replace(next);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          form.setError("pin", { message: "Invalid PIN. Check the number and try again." });
        } else if (err.status === 429) {
          toast.error("Too many attempts — please try again in a few minutes.");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Could not sign in. Check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access PIN</FormLabel>
              <FormControl>
                <Input
                  placeholder="1234-5678"
                  inputMode="numeric"
                  autoComplete="off"
                  {...field}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
                    const formatted =
                      digits.length > 4
                        ? `${digits.slice(0, 4)}-${digits.slice(4)}`
                        : digits;
                    field.onChange(formatted);
                  }}
                />
              </FormControl>
              <FormDescription>The 8-digit PIN you used to register.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="hero"
          size="xl"
          className="w-full mt-6 shadow-glow transition-all active:scale-[0.98]"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign in to Dashboard"}
        </Button>
      </form>
    </Form>
  );
}
