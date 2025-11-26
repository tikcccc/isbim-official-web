"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { m } from "@/components/motion/lazy-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as messages from "@/paraglide/messages";

const subscriptionSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

export function NewsletterForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
  });

  const onSubmit = async (data: SubscriptionFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Subscription Data:", data);
    setIsSubmitted(true);
    reset();

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2.5 pt-0.5">
      <div className="flex space-x-2">
        <Input
          {...register("email")}
          placeholder={messages.footer_email_placeholder()}
          type="email"
          className="flex-1 h-10 text-[15px] border-slate-300 dark:border-slate-700 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 transition-all duration-200 hover:border-slate-400 hover:shadow-sm dark:hover:border-slate-500"
        />
        <Button
          type="submit"
          disabled={isSubmitting || isSubmitted}
          className="px-4 h-10 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md focus:shadow-md disabled:translate-y-0 disabled:shadow-sm"
        >
          {isSubmitting ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <Send className="h-[18px] w-[18px]" />
          )}
        </Button>
      </div>

      {errors.email && (
        <p className="text-xs text-red-500 pl-0.5">{errors.email.message}</p>
      )}

      {isSubmitted && (
        <m.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-green-600 dark:text-green-400 pl-0.5"
        >
          {messages.footer_subscribe_success()}
        </m.p>
      )}
    </form>
  );
}
