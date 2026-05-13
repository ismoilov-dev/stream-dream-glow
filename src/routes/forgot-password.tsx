import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Mail } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — StreamPlay" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
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
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the email associated with your account and we'll send you a reset link.
        </p>

        {sent ? (
          <div className="mt-6 rounded-lg border border-border p-4 bg-surface/60 text-sm">
            <Mail className="h-5 w-5 text-primary mb-2" />
            If an account exists for <span className="font-medium text-foreground">{email}</span>, a
            reset link is on its way. Please check your inbox and spam folder.
          </div>
        ) : (
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("If the email exists, a reset link has been sent.");
            }}
          >
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full h-11 rounded-md bg-input/40 border border-border px-3 outline-none focus:border-primary transition"
              />
            </label>
            <button
              type="submit"
              className="w-full h-11 rounded-md gradient-brand text-primary-foreground font-semibold hover:brightness-110 transition"
            >
              Send reset link
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-muted-foreground text-center">
          Remembered it?{" "}
          <Link to="/login" className="text-foreground font-medium hover:underline">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
