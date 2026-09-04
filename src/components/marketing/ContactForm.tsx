"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const initialValues = { name: "", email: "", subject: "", message: "" };

// The shared Input/Textarea primitives are styled for the dark dashboard;
// this form lives on the light marketing site, so it carries its own field
// styling rather than fighting those defaults with overrides.
const fieldClass =
  "w-full rounded-xl border border-ink/12 bg-mist px-4 py-3 text-sm text-ink placeholder:text-slate/70 transition-colors focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20";

const labelClass = "mb-1.5 block text-sm font-medium text-ink";

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
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            required
            value={values.name}
            onChange={handleChange("name")}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange("email")}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input
          id="subject"
          required
          value={values.subject}
          onChange={handleChange("subject")}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={values.message}
          onChange={handleChange("message")}
          className={fieldClass}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex items-center gap-2.5 rounded-full bg-brand-gradient py-2 pl-6 pr-2 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send Message"}
        <span className="flex size-8 items-center justify-center rounded-full bg-white/25 transition-transform group-hover:translate-x-0.5">
          <ArrowRight size={15} />
        </span>
      </button>
    </form>
  );
}
