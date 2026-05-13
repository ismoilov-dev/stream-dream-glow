import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Users } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — StreamPlay" }] }),
  component: () => (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  ),
});

function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", preferred_language: "en" as "uz" | "ru" | "en" });
  const [pwd, setPwd] = useState({ old_password: "", new_password: "" });

  useEffect(() => {
    if (user) setForm({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      preferred_language: user.preferred_language ?? "en",
    });
  }, [user]);

  if (!user) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await Users.update(user.id, form as any);
      setUser(updated);
      toast.success("Profile updated");
    } catch { toast.error("Failed to update"); }
  };

  const changePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Users.changePassword(pwd.old_password, pwd.new_password);
      toast.success("Password changed");
      setPwd({ old_password: "", new_password: "" });
    } catch { toast.error("Could not change password"); }
  };

  return (
    <div className="pt-24 pb-16 mx-auto max-w-3xl px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full gradient-brand grid place-items-center text-primary-foreground text-2xl font-bold ring-4 ring-background">
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Member since {new Date(user.date_joined).toLocaleDateString()}</p>
        </div>
      </div>

      <form onSubmit={save} className="mt-8 grid sm:grid-cols-2 gap-3 p-5 rounded-xl bg-surface border border-border">
        <h2 className="sm:col-span-2 text-lg font-semibold">Account details</h2>
        <Input label="First name" value={form.first_name} onChange={(v) => setForm({ ...form, first_name: v })} />
        <Input label="Last name" value={form.last_name} onChange={(v) => setForm({ ...form, last_name: v })} />
        <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Preferred language</span>
          <select
            value={form.preferred_language}
            onChange={(e) => setForm({ ...form, preferred_language: e.target.value as any })}
            className="mt-1 w-full h-11 rounded-md bg-background border border-border px-3"
          >
            <option value="uz">O'zbek</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>
        <button className="sm:col-span-2 mt-2 h-11 rounded-md gradient-brand text-primary-foreground font-semibold">
          Save changes
        </button>
      </form>

      <form onSubmit={changePwd} className="mt-6 p-5 rounded-xl bg-surface border border-border space-y-3">
        <h2 className="text-lg font-semibold">Change password</h2>
        <Input label="Current password" type="password" value={pwd.old_password} onChange={(v) => setPwd({ ...pwd, old_password: v })} />
        <Input label="New password" type="password" value={pwd.new_password} onChange={(v) => setPwd({ ...pwd, new_password: v })} />
        <button className="h-11 px-5 rounded-md bg-foreground text-background font-semibold">Update password</button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 rounded-md bg-background border border-border px-3 outline-none focus:border-primary"
      />
    </label>
  );
}
