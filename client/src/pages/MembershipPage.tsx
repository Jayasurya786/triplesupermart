import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Seo } from "@/seo/Seo";
import { registerMember } from "@/services/authService";

interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
}

async function registerAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      password: String(formData.get("password") || ""),
    };
    await registerMember(payload);
    return { status: "success", message: "Membership request received." };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Submitting..." : "Register Membership"}
    </button>
  );
}

export function MembershipPage() {
  const [state, formAction] = useActionState(registerAction, { status: "idle" });

  return (
    <div className="mx-auto max-w-5xl px-6 md:px-10 py-12">
      <Seo title="Membership" description="Join Triple N Supermart loyalty membership." />
      <PageHeader
        title="Membership Registration"
        description="Create your loyalty profile and start earning rewards on every visit."
      />
      <GlassCard>
        <form action={formAction} className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            placeholder="Full name"
            className="rounded-2xl border border-brand-100 px-4 py-3 text-sm"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="rounded-2xl border border-brand-100 px-4 py-3 text-sm"
            required
          />
          <input
            name="phone"
            placeholder="Mobile number"
            className="rounded-2xl border border-brand-100 px-4 py-3 text-sm"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Create password"
            className="rounded-2xl border border-brand-100 px-4 py-3 text-sm"
            required
          />
          <div className="md:col-span-2">
            <SubmitButton />
          </div>
        </form>
        {state.status !== "idle" ? (
          <p className="mt-4 text-sm text-brand-700">{state.message}</p>
        ) : null}
      </GlassCard>
    </div>
  );
}
