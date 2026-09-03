"use client";

import { useRouter } from "next/navigation";
import { AuthForm, AuthFormField } from "@/components/auth/AuthForm";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";

const fields: AuthFormField[] = [
  { name: "first_name", label: "First Name", type: "text", autoComplete: "given-name" },
  { name: "last_name", label: "Last Name", type: "text", autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
];

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      await api.post("/auth/register/", {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      });
      router.push("/login");
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  };

  return (
    <AuthForm
      title="Register"
      fields={fields}
      submitLabel="Register"
      onSubmit={handleSubmit}
      footer={{ text: "Already have an account?", linkLabel: "Log In", href: "/login" }}
    />
  );
}
