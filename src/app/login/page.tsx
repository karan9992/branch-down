'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, t: string) => {

        if (t == 'email') {
            setEmail(e.target.value)
        } else {
            setPassword(e.target.value)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!email || !password) {
            toast.error("Enter your email and password.")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json()

            if (!response.ok) {
                toast.error(data.message ?? "Unable to sign in.")
                return
            }

            toast.success("Signed in successfully.")
            router.replace(data.role === "ADMIN" ? "/admin" : "/home")
        } catch {
            toast.error("Unable to sign in. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className='min-h-screen px-4 py-6 sm:p-8'>
            <Link href="/" className="mx-auto flex w-full max-w-md items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-emerald-200"><ArrowLeft className="size-4" /> Back to home</Link>
            <form onSubmit={handleSubmit} className="mx-auto mt-16 w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
                <div className="mb-8"><span className="inline-flex rounded-xl bg-emerald-300/10 p-3 text-emerald-200"><LockKeyhole className="size-5" /></span><h1 className='mt-5 text-2xl font-semibold text-white'>Welcome back</h1><p className="mt-2 text-sm text-neutral-400">Sign in to manage community reports.</p></div>
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-neutral-200">Email<input type="email" className='mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none transition placeholder:text-neutral-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/15' value={email} onChange={(e) => handleChange(e, 'email')} placeholder='you@example.com' /></label>
                    <label className="block text-sm font-medium text-neutral-200">Password<input type="password" className='mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none transition placeholder:text-neutral-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/15' value={password} onChange={(e) => handleChange(e, 'password')} placeholder='Enter your password' /></label>
                    <button type="submit" disabled={isSubmitting} className='mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60'><Mail className="size-4" /> {isSubmitting ? "Signing in..." : "Sign in"}</button>
                    <p className="pt-2 text-center text-sm text-neutral-400">New here? <Link href="/register" className="font-medium text-emerald-200 hover:text-emerald-100">Create an account</Link></p>
                </div>
            </form>
        </main>
    )
}

export default LoginPage
