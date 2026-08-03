'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react'

const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, t: string) => {

        if (t == 'email') {
            setEmail(e.target.value)
        } else {
            setPassword(e.target.value)
        }
    }

    const handleSubmit = () => {
        console.log(email, password)
    }

    return (
        <main className='min-h-screen px-4 py-6 sm:p-8'>
            <Link href="/" className="mx-auto flex w-full max-w-md items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-emerald-200"><ArrowLeft className="size-4" /> Back to home</Link>
            <div className="mx-auto mt-16 w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
                <div className="mb-8"><span className="inline-flex rounded-xl bg-emerald-300/10 p-3 text-emerald-200"><LockKeyhole className="size-5" /></span><h1 className='mt-5 text-2xl font-semibold text-white'>Welcome back</h1><p className="mt-2 text-sm text-neutral-400">Sign in to manage community reports.</p></div>
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-neutral-200">Email<input type="email" className='mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none transition placeholder:text-neutral-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/15' value={email} onChange={(e) => handleChange(e, 'email')} placeholder='you@example.com' /></label>
                    <label className="block text-sm font-medium text-neutral-200">Password<input type="password" className='mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none transition placeholder:text-neutral-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/15' value={password} onChange={(e) => handleChange(e, 'password')} placeholder='Enter your password' /></label>
                    <button type="submit" onClick={handleSubmit} className='mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200'><Mail className="size-4" /> Sign in</button>
                </div>
            </div>
        </main>
    )
}

export default LoginPage
