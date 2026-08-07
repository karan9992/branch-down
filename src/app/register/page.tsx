"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "");

    if (password !== confirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password,
          role,
          adminCode: role === "ADMIN" ? formData.get("adminCode") : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message ?? "Unable to create your account.");
        return;
      }

      toast.success("Your account is ready.");
      router.replace(data.role === "ADMIN" ? "/admin" : "/home");
    } catch {
      toast.error("Unable to create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:p-8">
      <Link href="/" className="mx-auto flex w-full max-w-md items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-emerald-200"><ArrowLeft className="size-4" /> Back to home</Link>
      <form onSubmit={handleSubmit} className="mx-auto mt-10 w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
        <div className="mb-7"><span className="inline-flex rounded-xl bg-emerald-300/10 p-3 text-emerald-200"><UserPlus className="size-5" /></span><h1 className="mt-5 text-2xl font-semibold text-white">Create your account</h1><p className="mt-2 text-sm text-neutral-400">Register to report fallen trees or manage incidents.</p></div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-neutral-200">Full name<input required name="name" autoComplete="name" className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none transition placeholder:text-neutral-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/15" placeholder="Your full name" /></label>
          <label className="block text-sm font-medium text-neutral-200">Email<input required name="email" type="email" autoComplete="email" className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none transition placeholder:text-neutral-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/15" placeholder="you@example.com" /></label>
          <label className="block text-sm font-medium text-neutral-200">Password<input required name="password" type="password" minLength={8} autoComplete="new-password" className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none transition placeholder:text-neutral-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/15" placeholder="At least 8 characters" /></label>
          <label className="block text-sm font-medium text-neutral-200">Confirm password<input required name="confirmation" type="password" minLength={8} autoComplete="new-password" className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none transition placeholder:text-neutral-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/15" placeholder="Repeat your password" /></label>
          <fieldset><legend className="mb-2 text-sm font-medium text-neutral-200">Account type</legend><div className="grid grid-cols-2 gap-2"><label className={`cursor-pointer rounded-xl border p-3 text-sm transition ${role === "USER" ? "border-emerald-300/50 bg-emerald-300/10 text-emerald-100" : "border-white/10 text-neutral-400"}`}><input className="sr-only" type="radio" checked={role === "USER"} onChange={() => setRole("USER")} />Reporter</label><label className={`cursor-pointer rounded-xl border p-3 text-sm transition ${role === "ADMIN" ? "border-emerald-300/50 bg-emerald-300/10 text-emerald-100" : "border-white/10 text-neutral-400"}`}><input className="sr-only" type="radio" checked={role === "ADMIN"} onChange={() => setRole("ADMIN")} />Administrator</label></div></fieldset>
          {role === "ADMIN" && <label className="block rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-sm font-medium text-amber-100"><span className="flex items-center gap-2"><ShieldCheck className="size-4" /> Administrator registration code</span><input required name="adminCode" type="password" className="mt-3 h-10 w-full rounded-lg border border-white/10 bg-black/15 px-3 text-white outline-none focus:border-emerald-300/60" placeholder="Enter the private code" /></label>}
          <button type="submit" disabled={isSubmitting} className="flex h-11 w-full items-center justify-center rounded-xl bg-emerald-300 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Creating account..." : "Create account"}</button>
          <p className="text-center text-sm text-neutral-400">Already have an account? <Link href="/login" className="font-medium text-emerald-200 hover:text-emerald-100">Sign in</Link></p>
        </div>
      </form>
    </main>
  );
}
