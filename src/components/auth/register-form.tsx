"use client";

import { useState } from "react";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

const STREAMS = ["Sciences", "Arts", "Languages", "Commercial", "Trade"] as const;
const CLASS_LEVELS = ["SS1", "SS2", "SS3"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\+?[0-9\s-]{7,20}$/.test(v), "Enter a valid phone number"),
  classLevel: z.enum(CLASS_LEVELS).optional(),
  stream: z.enum(STREAMS).optional(),
  password: z.string().min(10, "At least 10 characters"),
  consentTos: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms of Service" }),
  }),
  consentMarketing: z.boolean().optional().default(false),
});

type Values = z.infer<typeof schema>;

export function RegisterForm() {
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      consentTos: false as unknown as true,
      consentMarketing: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: Values) => {
    setSubmitting(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
        classLevel: values.classLevel,
        stream: values.stream,
        consentMarketing: values.consentMarketing,
        consentTos: true,
      });
      toast.success("Welcome to Perfect Mark!");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "CONFLICT") {
          form.setError("email", { message: err.message });
        } else if (err.code === "VALIDATION_ERROR") {
          toast.error(err.message);
        } else if (err.status === 429) {
          toast.error("Too many attempts — please try again in a few minutes.");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Could not create account. Check your connection and try again.");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input type="tel" autoComplete="tel" placeholder="+234 812 345 6789" {...field} />
              </FormControl>
              <FormDescription>Optional — used for account recovery.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="classLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CLASS_LEVELS.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
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
            name="stream"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stream</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STREAMS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormDescription>At least 10 characters. A passphrase works great.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consentTos"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-1">
              <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-4 cursor-pointer hover:border-primary/30 transition-smooth">
                <input
                  type="checkbox"
                  checked={field.value === true}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-sm text-foreground/90 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="font-semibold text-primary underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-primary underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consentMarketing"
          render={({ field }) => (
            <FormItem>
              <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value === true}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                />
                <span>Send me exam tips and study reminders by email (optional).</span>
              </label>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="hero"
          size="xl"
          className="w-full mt-4 shadow-glow transition-all active:scale-[0.98]"
          disabled={submitting}
        >
          {submitting ? "Creating your portal…" : "Create Student Account"}
        </Button>
      </form>
    </Form>
  );
}
