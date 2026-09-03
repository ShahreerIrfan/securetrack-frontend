"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface AuthFormField {
  name: string;
  label: string;
  type: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
}

export interface AuthFormFooter {
  text: string;
  linkLabel: string;
  href: string;
}

export interface AuthFormProps {
  title: string;
  fields: AuthFormField[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  footer?: AuthFormFooter;
}

export function AuthForm({ title, fields, submitLabel, onSubmit, footer }: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="mb-1.5 block text-sm text-copy">
                {field.label}
              </label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                required
                value={values[field.name] ?? ""}
                onChange={handleChange(field.name)}
              />
            </div>
          ))}
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Please wait..." : submitLabel}
          </Button>
        </form>
        {footer && (
          <p className="mt-6 text-center text-sm text-copy">
            {footer.text}{" "}
            <Link href={footer.href} className="font-medium text-accent hover:underline">
              {footer.linkLabel}
            </Link>
          </p>
        )}
      </Card>
    </div>
  );
}
