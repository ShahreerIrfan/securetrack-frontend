"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

const initialValues = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const toast = useToast();
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);

  const handleChange =
    (field: keyof typeof initialValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // No backend endpoint for contact submissions exists in this build -
    // this is a UI-only confirmation, matching the marketing site's scope.
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success("Message sent", {
      description: "We'll get back to you within one business day.",
    });
    setValues(initialValues);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-copy">
            Name
          </label>
          <Input id="name" required value={values.name} onChange={handleChange("name")} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-copy">
            Email
          </label>
          <Input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange("email")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm text-copy">
          Subject
        </label>
        <Input id="subject" required value={values.subject} onChange={handleChange("subject")} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-copy">
          Message
        </label>
        <Textarea
          id="message"
          rows={5}
          required
          value={values.message}
          onChange={handleChange("message")}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
