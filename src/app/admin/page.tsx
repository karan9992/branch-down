"use client";

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    MapPin,
    MoreHorizontal,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { IReport } from "@/types/report";

const ReportMap = dynamic(() => import("../components/Map"), {
    ssr: false,
});

type TMetric = {
    total: number;
    resolved: number;
    pending: number;
};

const severityStyles: Record<IReport["severity"], string> = {
    LOW: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
    MEDIUM: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
    HIGH: "bg-rose-500/10 text-rose-300 ring-rose-400/20",
};

const statusStyles: Record<IReport["status"], string> = {
    PENDING: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
    VERIFIED: "bg-sky-500/10 text-sky-300 ring-sky-400/20",
    IN_PROGRESS: "bg-violet-500/10 text-violet-300 ring-violet-400/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
    REJECTED: "bg-rose-500/10 text-rose-300 ring-rose-400/20",
};

const AdminPage = () => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [metrics, setMetrics] = useState<TMetric>({
        total: 0,
        resolved: 0,
        pending: 0,
    });
    const [highlightIncident, setHighlightIncident] = useState<string>("")

    useEffect(() => {
        fetch("/api/report")
            .then((res) => res.json())
            .then((data) => setReports(data))
            .catch((err) => console.log("error:", err));
    }, []);

    useEffect(() => {
        const pending = reports.filter(
            (report) => report.status === "PENDING",
        ).length;
        const resolved = reports.filter(
            (report) => report.status === "RESOLVED",
        ).length;

        setMetrics({ pending, resolved, total: reports.length });
    }, [reports]);

    return (
        <main className="min-h-screen  px-4 py-8 text-neutral-100 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl space-y-8">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-emerald-600">
                            Operations dashboard
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                            Incident reports
                        </h1>
                        <p className="mt-2 text-sm text-neutral-400">
                            Review and manage incoming fallen-tree reports.
                        </p>
                    </div>
                    <p className="text-sm text-neutral-400">Live report overview</p>
                </header>

                <section className="grid gap-4 sm:grid-cols-3">
                    <MetricCard
                        label="Total incidents"
                        value={metrics.total}
                        icon={<AlertCircle className="size-5" />}
                        tone="neutral"
                    />
                    <MetricCard
                        label="Awaiting review"
                        value={metrics.pending}
                        icon={<Clock3 className="size-5" />}
                        tone="amber"
                    />
                    <MetricCard
                        label="Resolved"
                        value={metrics.resolved}
                        icon={<CheckCircle2 className="size-5" />}
                        tone="emerald"
                    />
                </section>

                <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4 sm:px-6">
                        <div>
                            <h2 className="font-semibold text-white">All reports</h2>
                            <p className="mt-1 text-sm text-neutral-400">
                                {metrics.total} incident{metrics.total === 1 ? "" : "s"}{" "}
                                recorded
                            </p>
                        </div>
                    </div>

                    <Table className="min-w-[900px]">
                        <TableHeader className="bg-neutral-800/70">
                            <TableRow className="border-neutral-800 hover:bg-neutral-800/70" >
                                <TableHead className="h-12 px-6 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                    Reporter
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                    Incident
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                    Location
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                    Severity
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                    Status
                                </TableHead>
                                <TableHead className="w-16 px-6 text-right text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow
                                    key={report._id}
                                    className="border-neutral-800 hover:bg-neutral-800/60"
                                    onClick={() => setHighlightIncident(report._id)}
                                >
                                    <TableCell className="px-6 py-4">
                                        <p className="font-medium text-neutral-100">
                                            {report.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-neutral-500">
                                            Report #{report._id.slice(-6).toUpperCase()}
                                        </p>
                                    </TableCell>
                                    <TableCell className="max-w-64 py-4 whitespace-normal">
                                        <p className="font-medium text-neutral-100">
                                            {report.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-1 text-sm text-neutral-400">
                                            {report.description}
                                        </p>
                                    </TableCell>
                                    <TableCell className="max-w-56 py-4 whitespace-normal">
                                        <div className="flex gap-2">
                                            <MapPin className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                                            <span className="line-clamp-2 text-sm text-neutral-300">
                                                {report.location.address}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge className={severityStyles[report.severity]}>
                                            {report.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge className={statusStyles[report.status]}>
                                            {report.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        variant="default"
                                                        size="icon"
                                                        className="size-8 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                                                    >
                                                        <MoreHorizontal className="size-4" />
                                                        <span className="sr-only">
                                                            Open actions for {report.title}
                                                        </span>
                                                    </Button>
                                                }
                                            />
                                            <DropdownMenuContent
                                                align="end"
                                                className="border border-neutral-700 bg-neutral-900 text-neutral-100 shadow-xl shadow-black/30"
                                            >
                                                <DropdownMenuItem
                                                    className="focus:bg-neutral-800 focus:text-white"
                                                    onClick={() => console.log("Resolved", report._id)}
                                                >
                                                    Mark as resolved
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="focus:bg-neutral-800 focus:text-white"
                                                    onClick={() => console.log("Pending", report._id)}
                                                >
                                                    Mark as pending
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {reports.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="px-6 py-14 text-center text-sm text-neutral-400"
                                    >
                                        No incident reports yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </section>

                <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-2 shadow-xl shadow-black/20">
                    <ReportMap height="500px" reportData={reports} />
                </section>
            </div>
        </main>
    );
};

function MetricCard({
    label,
    value,
    icon,
    tone,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    tone: "neutral" | "amber" | "emerald";
}) {
    const tones = {
        neutral: "bg-neutral-800 text-neutral-300",
        amber: "bg-amber-500/15 text-amber-300",
        emerald: "bg-emerald-500/15 text-emerald-300",
    };

    return (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl shadow-black/20">
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-neutral-400">{label}</p>
                <span className={`rounded-lg p-2 ${tones[tone]}`}>{icon}</span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {value}
            </p>
        </div>
    );
}

function Badge({
    children,
    className,
}: {
    children: React.ReactNode;
    className: string;
}) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
        >
            {children}
        </span>
    );
}

export default AdminPage;
