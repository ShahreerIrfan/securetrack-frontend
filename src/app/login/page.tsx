"use client";

import { useRouter } from "next/navigation";
import { AuthForm, AuthFormField } from "@/components/auth/AuthForm";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";

const fields: AuthFormField[] = [
  { name: "username", label: "Username", type: "text", autoComplete: "username" },
  { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
];

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const { data: tokens } = await api.post("/auth/login/", {
        username: values.username,
        password: values.password,
      });
      const { data: me } = await api.get("/auth/me/", {
        headers: { Authorization: `Bearer ${tokens.access}` },
      });
      useAuthStore.getState().setAuth({
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        user: me,
      });
      router.push("/dashboard");
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  };

  return (
    <AuthForm
      title="Log In"
      fields={fields}
      submitLabel="Log In"
      onSubmit={handleSubmit}
      footer={{ text: "Don't have an account?", linkLabel: "Register", href: "/register" }}
    />
  );
}
