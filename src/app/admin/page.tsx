import React from 'react'


const reports = [
    {
        id: 1,
        name: "Karan Bhoir",
        title: "tree fallen",
        description: "sdfffsfdsfsf",
        address: "sector 29, Vashi",
        landmark: "signal",
        zip: 400703,
        severity: "medium",
        latitude: 19.1135,
        longitude: 72.8664
    },
    {
        id: 2,
        name: "Rohan Patel",
        title: "pole fallen",
        description: "sdfffsfdsfsf",
        address: "sector 29, Panvel",
        landmark: "signal",
        zip: 400531,
        severity: "high",
        latitude: 18.1135,
        longitude: 68.8664
    },
    {
        id: 3,
        name: "Darshan K",
        title: "pole fallen",
        description: "sdfffsfdsfsf",
        address: "sector 29, Panvel",
        landmark: "signal",
        zip: 400531,
        severity: "low",
        latitude: 32.1135,
        longitude: 64.8664
    },
    {
        id: 4,
        name: "Shubham K",
        title: "tree fallen",
        description: "sdfffsfdsfsf",
        address: "sector 29, Bandra",
        landmark: "signal",
        zip: 400531,
        severity: "high",
        latitude: 18.1135,
        longitude: 68.8664
    }
]
const AdminPage = () => {
    return (
        <div className='min-h-screen flex border-neutral-50 border' >
            <div className="border border-white w-1/5 h-screen "> sidebar</div>
            <div className="border border-white flex-1  p-2 h-screen overflow-auto flex flex-col ">
                <h1 className='text-2xl text-center'>Reports</h1>

                <div className="border border-white mt-6 text-2xl ">
                    <ul>
                        {
                            reports.map(r => <li key={r.id}>
                                <p> <span>{r.id}</span> &nbsp; <span>{r.title}</span> &nbsp; <span>{r.address}</span></p>
                            </li>)
                        }
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default AdminPage