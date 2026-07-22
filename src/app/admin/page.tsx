'use client'
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect, useState } from 'react'
import { IReport } from "@/types/report"

// const reports = [
//     {
//         id: 1,
//         name: "Karan Bhoir",
//         title: "tree fallen",
//         description: "sdfffsfdsfsf",
//         address: "sector 29, Vashi",
//         landmark: "signal",
//         zip: 400703,
//         severity: "medium",
//         latitude: 19.1135,
//         longitude: 72.8664,
//         status: "pending"
//     },
//     {
//         id: 2,
//         name: "Rohan Patel",
//         title: "pole fallen",
//         description: "sdfffsfdsfsf",
//         address: "sector 29, Panvel",
//         landmark: "signal",
//         zip: 400531,
//         severity: "high",
//         latitude: 18.1135,
//         longitude: 68.8664,
//         status: "pending"

//     },
//     {
//         id: 3,
//         name: "Darshan K",
//         title: "pole fallen",
//         description: "sdfffsfdsfsf",
//         address: "sector 29, Panvel",
//         landmark: "signal",
//         zip: 400531,
//         severity: "low",
//         latitude: 32.1135,
//         longitude: 64.8664,
//         status: "completed"

//     },
//     {
//         id: 4,
//         name: "Shubham K",
//         title: "tree fallen",
//         description: "sdfffsfdsfsf",
//         address: "sector 29, Bandra",
//         landmark: "signal",
//         zip: 400531,
//         severity: "high",
//         latitude: 18.1135,
//         longitude: 68.8664,
//         status: "pending"

//     }
// ]

type TMetric = {
    total: number,
    resolved: number,
    pending: number,
}
const AdminPage = () => {

    const [reports, setReports] = useState<IReport[]>([])
    const [metrics, setMetrics] = useState<TMetric>({
        total: 0,
        resolved: 0,
        pending: 0,
    })

    useEffect(() => {
        fetch("/api/report")
            .then(res => res.json())
            .then(data => {
                setReports(data)
                console.log(data)
            }).catch(err => console.log("error:", err))
    }, [])

    useEffect(() => {
        let pending = 0;
        let resolved = 0;

        reports.forEach((report) => {
            if (report.status === "PENDING") {
                pending++;
            } else if (report.status === "RESOLVED") {
                resolved++;
            }
        });

        setMetrics({
            pending,
            resolved,
            total: reports.length,
        });
    }, [reports]);

    return (
        <div className='min-h-screen flex  justify-center border ' >
            <div className=" flex-1 w-full max-w-6xl p-2 h-screen overflow-auto flex flex-col ">


                <h1 className='text-2xl text-center'>Reports</h1>

                <div className="border flex gap-2 my-8 flex-row-reverse">
                    <div className="border border-neutral-500 p-2 px-4  text-2xl">Pending :{metrics.pending} </div>
                    <div className="border border-neutral-500 p-2 px-4  text-2xl">Completed :{metrics.resolved} </div>
                    <div className="border border-neutral-500 p-2 px-4  text-2xl">Incidents : {metrics.total}</div>

                </div>






                <div className="  mt-6 text-2xl ">
                    <Table className='text-lg' border={2}>
                        <TableCaption>Incident Reports</TableCaption>
                        <TableHeader>
                            <TableRow>
                                {/* <TableHead className="w-25">ID</TableHead> */}
                                <TableHead>Name</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="">Address</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>


                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {
                                reports?.map(r => <TableRow key={r._id}>
                                    {/* <TableCell>{r._id}</TableCell> */}
                                    <TableCell>{r.name}</TableCell>
                                    <TableCell className="font-semibold">{r.title}</TableCell>
                                    <TableCell>{r.description}</TableCell>
                                    <TableCell>{r.location.address}</TableCell>
                                    {/* <TableCell>{r.landmark}</TableCell>
                                    <TableCell>{r.zip}</TableCell> */}
                                    <TableCell>
                                        <span className={`badge-${r.severity}`}>
                                            {r.severity}
                                        </span>
                                    </TableCell>
                                    <TableCell>{r.status}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8">...<span className="sr-only">Open menu</span></Button>} />
                                            <DropdownMenuContent align="end">

                                                <DropdownMenuItem onClick={() => console.log("Completed", r._id)}>Completed</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem variant="destructive" onClick={() => console.log("Pending")}>
                                                    Pending
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>

                                </TableRow>)
                            }

                        </TableBody>
                    </Table>
                </div>

            </div>
        </div>
    )
}

export default AdminPage