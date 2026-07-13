'use client'
import React, { useState } from 'react'

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
        <div className=' min-h-screen flex justify-center items-center'>
            <div className="border h-full max-h-120  w-full max-w-xl p-4 flex flex-col items-center justify-center">
                <h1 className='py-8'> LoginPage</h1>

                <input type="email" className='p-2 border w-3/4 m-2' value={email} onChange={(e) => handleChange(e, 'email')} placeholder='Email' />
                <input type="password" className='p-2 border w-3/4 m-2' value={password} onChange={(e) => handleChange(e, 'password')} placeholder='Password' />
                <button type="submit" onClick={handleSubmit} className='p-2 border w-3/4 m-2 rounded hover:bg-neutral-200 hover:text-neutral-900'>Login</button>

            </div>
        </div>
    )
}

export default LoginPage