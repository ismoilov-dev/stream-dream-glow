import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Film } from "lucide-react";
import { Auth, Users } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { AuthShell } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — StreamPlay" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await Auth.register(form);
      const tokens = await Auth.login(form.username, form.password);
      setTokens(tokens);
      try {
        const me = await Users.me();
        setUser(me);
      } catch { /* ignore */ }
      toast.success("Account created");
      navigate({ to: "/" });
    } catch (err: unknown) {
      const e = err as { response?: { data?: Record<string, unknown> } };
      const data = e?.response?.data;
      const msg =
        (data && typeof data === "object" && Object.values(data).flat().join(" ")) ||
        "Failed to register";
      toast.error(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-strong rounded-2xl p-8 shadow-elevated"
      >
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-lg gradient-brand grid place-items-center">
            <Film className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">StreamPlay</span>
        </Link>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join the cinematic experience.</p>

        <form className="mt-6 space-y-3" onSubmit={submit}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" value={form.first_name} onChange={onChange("first_name")} />
            <Field label="Last name" value={form.last_name} onChange={onChange("last_name")} />
          </div>
          <Field label="Username" required value={form.username} onChange={onChange("username")} autoComplete="username" />
          <Field label="Email" required type="email" value={form.email} onChange={onChange("email")} autoComplete="email" />
          <Field label="Password" required type="password" value={form.password} onChange={onChange("password")} autoComplete="new-password" />
          <Field label="Confirm password" required type="password" value={form.password2} onChange={onChange("password2")} autoComplete="new-password" />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-11 rounded-md gradient-brand text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-60 hover:brightness-110 transition"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-1 w-full h-11 rounded-md bg-input/40 border border-border px-3 outline-none focus:border-primary transition"
      />
    </label>
  );
}
