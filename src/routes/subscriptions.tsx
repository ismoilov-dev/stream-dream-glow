import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Subscriptions, unwrapList } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({ meta: [{ title: "Plans — StreamPlay" }] }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const { isAuthenticated } = useAuthStore();
  const { data: plansData, isLoading } = useQuery({ queryKey: ["plans"], queryFn: Subscriptions.plans });
  const mine = useQuery({ queryKey: ["my-sub"], queryFn: Subscriptions.mine, enabled: isAuthenticated, retry: false });
  const plans = unwrapList(plansData);

  const subscribe = async (planId: number) => {
    if (!isAuthenticated) { toast.error("Sign in to subscribe"); return; }
    try {
      await Subscriptions.subscribe(planId);
      toast.success("Subscribed");
    } catch { toast.error("Could not subscribe"); }
  };

  return (
    <div className="pt-24 pb-16 mx-auto max-w-[1400px] px-4 lg:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold">
          <Crown className="h-3.5 w-3.5" /> Premium plans
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-gradient">Pick your plan</h1>
        <p className="mt-3 text-muted-foreground">Unlock 4K quality, downloads, and the entire premium catalogue.</p>
      </div>

      {mine.data && (
        <div className="mt-8 max-w-xl mx-auto rounded-xl border border-border bg-surface p-4 text-sm">
          <span className="text-muted-foreground">You're on </span>
          <span className="font-semibold">{mine.data.plan_details?.name}</span>
          <span className="text-muted-foreground"> · expires {new Date(mine.data.expires_at).toLocaleDateString()}</span>
        </div>
      )}

      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-96 rounded-2xl skeleton" />)
          : plans.map((p, i) => (
              <div
                key={p.id}
                className={`relative rounded-2xl p-6 border ${
                  i === 1 ? "border-primary bg-surface shadow-glow" : "border-border bg-surface"
                }`}
              >
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-brand text-primary-foreground text-xs font-semibold">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-black">{p.price}</span>
                  <span className="text-muted-foreground mb-1">{p.currency}/{p.period}</span>
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  <Feature>Up to {p.max_quality} quality</Feature>
                  <Feature>{p.max_concurrent_streams} concurrent streams</Feature>
                  {p.allows_downloads && <Feature>Offline downloads</Feature>}
                  <Feature>Cancel anytime</Feature>
                </ul>
                <button
                  onClick={() => subscribe(p.id)}
                  className={`mt-6 w-full h-11 rounded-md font-semibold transition ${
                    i === 1 ? "gradient-brand text-primary-foreground hover:brightness-110" : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {mine.data?.plan === p.id ? "Current plan" : "Choose plan"}
                </button>
              </div>
            ))}
      </div>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}
