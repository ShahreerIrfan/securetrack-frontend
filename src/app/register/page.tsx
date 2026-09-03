"use client";

import { useRouter } from "next/navigation";
import { AuthForm, AuthFormField } from "@/components/auth/AuthForm";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";

const fields: AuthFormField[] = [
  { name: "username", label: "Username", type: "text", autoComplete: "username" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
];

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      await api.post("/auth/register/", {
        username: values.username,
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
