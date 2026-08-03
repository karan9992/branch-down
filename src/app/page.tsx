import Link from "next/link";
import { ArrowRight, ClipboardPenLine, MapPinned, TreePine } from "lucide-react";
import type { ReactNode } from "react";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <section className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-sm font-medium text-emerald-200">
            <TreePine className="size-4" /> Community response network
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Safer streets begin with a single report.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg">
            Help your community respond to fallen trees quickly. Share the location, add a photo, and keep local routes safer for everyone.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/home" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-200">
              Report a fallen tree <ArrowRight className="size-4" />
            </Link>
            <Link href="/admin" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
              View operations dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Feature icon={<ClipboardPenLine className="size-5" />} title="Quick to submit" text="A clear, guided report designed for when you are on the move." />
          <Feature icon={<MapPinned className="size-5" />} title="Location-aware" text="Confirm the exact location so crews can find the incident without delay." />
        </section>
      </div>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <article className="rounded-2xl border border-white/10 bg-neutral-900/65 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
    <span className="mb-4 inline-flex rounded-xl bg-emerald-300/10 p-2.5 text-emerald-200">{icon}</span>
    <h2 className="font-semibold text-white">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-400">{text}</p>
  </article>
}
